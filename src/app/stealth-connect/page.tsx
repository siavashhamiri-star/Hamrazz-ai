
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Power, PowerOff, Globe, Server, Shield, CheckCircle, XCircle, ChevronDown, Fingerprint, Route } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "disconnecting";
const FIXED_IP = "72.14.204.103"; // A stable, memorable IP for the demo

const proxyServers = [
    { location: "United States", ip: "209.141.53.110" },
    { location: "Germany", ip: "136.243.66.72" },
    { location: "Singapore", ip: "103.159.198.55" },
    { location: "Netherlands", ip: "5.188.10.201" },
];

export default function StealthConnectPage() {
    const [status, setStatus] = useState<ConnectionStatus>("disconnected");
    const [elapsedTime, setElapsedTime] = useState(0);
    const [selectedProxy, setSelectedProxy] = useState(proxyServers[0]);
    const [killSwitch, setKillSwitch] = useState(true);
    const [obfuscation, setObfuscation] = useState(false);

    const { user } = useUser();
    const { toast } = useToast();
    const isConnected = status === 'connected';

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'connected') {
            timer = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(timer);
    }, [status]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    
    const handleConnect = () => {
        setStatus('connecting');
        toast({ title: "Connecting...", description: `Establishing secure connection via ${selectedProxy.location}...` });
        setTimeout(() => {
            setStatus('connected');
            toast({ title: "Connected!", description: "You are now securely connected with a fixed IP.", variant: "default" });
        }, 2500);
    };

    const handleDisconnect = () => {
        setStatus('disconnecting');
        toast({ title: "Disconnecting...", description: "Closing secure connection." });
        setTimeout(() => {
            setStatus('disconnected');
            toast({ title: "Disconnected" });
        }, 1500);
    };

    // Security Gate: Only the owner can access this page
    if (user?.uid !== 'owner-the-creator') {
        return (
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-destructive">Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This is a high-security tool reserved for the Creator. Access is strictly forbidden.</p>
                </CardContent>
            </Card>
          </div>
        )
    }

    return (
        <div className="space-y-8">
            <Alert variant="default" className="bg-primary/10 border-primary/30">
                <Fingerprint className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Stealth Connect</AlertTitle>
                <AlertDescription>
                    Your personal, high-security VPN for unrestricted and anonymous access. This tool provides you with a fixed IP address, proxy switching, and advanced features to ensure your work can proceed without interruption.
                </AlertDescription>
            </Alert>

            <Card className="w-full max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">VPN Status</CardTitle>
                    <CardDescription
                        className={cn("font-semibold text-lg transition-colors",
                            isConnected ? "text-green-500" : "text-destructive"
                        )}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <Button
                        size="lg"
                        className={cn("w-48 h-16 rounded-full text-lg gap-2", 
                            isConnected ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
                            (status === 'connecting' || status === 'disconnecting') && "bg-muted-foreground"
                        )}
                        onClick={isConnected ? handleDisconnect : handleConnect}
                        disabled={status === 'connecting' || status === 'disconnecting'}
                    >
                        {status === 'connecting' || status === 'disconnecting' ? <Loader2 className="h-6 w-6 animate-spin" /> : isConnected ? <PowerOff className="h-6 w-6" /> : <Power className="h-6 w-6" />}
                        {isConnected ? "Disconnect" : "Connect"}
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center">
                        <Card className="p-4">
                            <CardTitle className="text-sm text-muted-foreground">Your Fixed IP</CardTitle>
                            <CardDescription className="text-xl font-mono">{isConnected ? FIXED_IP : "---.---.---.---"}</CardDescription>
                        </Card>
                        <Card className="p-4">
                            <CardTitle className="text-sm text-muted-foreground">Session Duration</CardTitle>
                            <CardDescription className="text-xl font-mono">{formatTime(elapsedTime)}</CardDescription>
                        </Card>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-6 pt-6 border-t">
                    <div className="w-full space-y-4">
                        <h3 className="font-semibold text-center text-muted-foreground">Advanced Settings</h3>
                         <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="proxy-switcher" className="flex items-center gap-2"><Server className="h-5 w-5"/> Proxy Server</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] justify-between" disabled={isConnected}>
                                        {selectedProxy.location}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    {proxyServers.map(server => (
                                        <Button key={server.ip} variant="ghost" className="w-full justify-start" onClick={() => setSelectedProxy(server)}>
                                            {server.location}
                                        </Button>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="kill-switch" className="flex items-center gap-2"><Shield className="h-5 w-5"/> Kill Switch</Label>
                            <Switch id="kill-switch" checked={killSwitch} onCheckedChange={setKillSwitch} />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label htmlFor="obfuscation" className="flex items-center gap-2"><Route className="h-5 w-5"/> Obfuscation</Label>
                            <Switch id="obfuscation" checked={obfuscation} onCheckedChange={setObfuscation} />
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
