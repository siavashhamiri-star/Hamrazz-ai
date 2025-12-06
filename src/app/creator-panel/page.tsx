
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mic, Send, Terminal, Clipboard, BrainCircuit } from "lucide-react";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const MOCK_RESPONSE_DELAY = 1500;

export default function CreatorPanelPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState("");
  const [systemLogs, setSystemLogs] = useState<string[]>(["System Initialized. Awaiting voice command from the Creator..."]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const addLog = (log: string) => {
    setSystemLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };
  
  useEffect(() => {
    const terminal = document.getElementById('terminal-logs');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [systemLogs]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addLog("ERROR: Speech recognition not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      addLog("Voice recognition activated. Listening for command...");
    };

    recognition.onend = () => {
      setIsListening(false);
      addLog("Voice recognition deactivated.");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      addLog(`Command Received: "${transcript}"`);
      handleCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      addLog(`ERROR: ${event.error}`);
      toast({
        variant: "destructive",
        title: "Voice Recognition Error",
        description: `Could not process voice command. Error: ${event.error}`,
      });
      setIsListening(false);
    };

    recognitionRef.current = recognition;

  }, [toast]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening || isProcessing) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        addLog("ERROR: Failed to start voice recognition. Check microphone permissions.");
      }
    }
  };

  const handleCommand = async (cmd: string) => {
    if (!cmd.trim() || isProcessing) return;

    setIsProcessing(true);
    addLog(`Processing command: "${cmd}"`);
    
    // Simulate AI processing and responding
    await new Promise(resolve => setTimeout(resolve, MOCK_RESPONSE_DELAY));
    
    let response = "Acknowledged. Task completed.";
    if (cmd.toLowerCase().includes("update")) {
        response = `Simulating update sequence... Pulling latest changes, running build, deploying to staging environment. All tasks completed successfully.`;
    } else if (cmd.toLowerCase().includes("status")) {
        response = "System status: All services operational. User engagement is up 15% this week.";
    } else if (cmd.toLowerCase().includes("create")) {
        response = `Understood. Scaffolding new feature: "${cmd.replace('create', '').trim()}". A new branch has been created and initial components are being generated.`;
    }

    addLog(`Hamraz Response: ${response}`);
    setIsProcessing(false);
    setCommand("");
  };

  if (!user || user.uid !== 'owner-the-creator') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is the Creator's private command center. Access is restricted.</p>
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Clipboard className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">Creator's Command Center</AlertTitle>
        <AlertDescription>
          This is your private studio, Ahura. Use your voice to interact directly with Hamraz, guide the development of the app, and receive real-time system status updates.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg text-center">
                <CardHeader>
                    <CardTitle>Voice Command</CardTitle>
                    <CardDescription>Press the mic to issue a command.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        size="icon"
                        onClick={handleMicClick}
                        disabled={isProcessing}
                        className={cn("h-24 w-24 rounded-full transition-all duration-300", 
                            isListening ? "bg-destructive animate-pulse" : "bg-primary",
                            isProcessing && "bg-muted-foreground"
                        )}
                    >
                       {isProcessing ? <Loader2 className="h-10 w-10 animate-spin" /> : <Mic className="h-10 w-10" />}
                    </Button>
                </CardContent>
                 <CardFooter className="flex-col gap-2 min-h-[4rem]">
                    <p className="text-sm font-medium text-muted-foreground">
                        {isProcessing ? "Processing..." : isListening ? "Listening..." : "Awaiting Command"}
                    </p>
                    <p className="text-sm font-mono text-primary truncate">{command}</p>
                 </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit/> Command Examples</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    <ul className="list-disc list-inside space-y-2 font-mono">
                        <li>"Hamraz, report system status."</li>
                        <li>"Create a new page for user analytics."</li>
                        <li>"Update the 'Hall of Fame' with the latest winners."</li>
                        <li>"What's the current user count?"</li>
                    </ul>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Terminal /> System Log</CardTitle>
                    <CardDescription>Real-time responses and actions from Hamraz.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div id="terminal-logs" className="p-4 bg-black text-green-400 rounded-md h-[400px] overflow-auto text-xs font-mono whitespace-pre-wrap">
                        {systemLogs.join('\n')}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Textarea
                            placeholder="Or type a command..."
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleCommand(command))}
                            disabled={isProcessing || isListening}
                            className="font-mono"
                        />
                        <Button onClick={() => handleCommand(command)} disabled={isProcessing || isListening || !command}>
                            <Send />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
