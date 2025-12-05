
"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Video, Mic, Circle, Square, RefreshCcw, Play, Pause, Youtube, Twitch, Instagram, Link as LinkIcon, RadioTower, Loader2, Award, Clock, ShieldCheck, Rocket, Lightbulb } from "lucide-react";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type ConnectionStatus = "disconnected" | "connecting" | "connected";
type Platform = "youtube" | "twitch" | "instagram";

const LIVE_ACCESS_THRESHOLD = 5000;
const BASE_LIVE_MINUTES = 10;
const POINTS_PER_MINUTE = 100;

export default function CameraPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Teleprompter state
  const [teleprompterText, setTeleprompterText] = useState("Your script will appear here. Start typing below!");
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(15);
  const teleprompterRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Broadcast state
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastTime, setBroadcastTime] = useState(0);
  const [streamTitle, setStreamTitle] = useState("");
  const [connections, setConnections] = useState<Record<Platform, ConnectionStatus>>({
    youtube: "disconnected",
    twitch: "disconnected",
    instagram: "disconnected",
  });
  const connectedPlatforms = Object.values(connections).filter(s => s === 'connected').length;


  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);

  const userPoints = userProfile?.points || 0;
  const hasLiveAccess = userPoints >= LIVE_ACCESS_THRESHOLD;
  const availableLiveMinutes = useMemo(() => {
    return BASE_LIVE_MINUTES + Math.floor(userPoints / POINTS_PER_MINUTE);
  }, [userPoints]);

  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const getCameraPermission = useCallback(async () => {
    if (!user) {
      setHasPermission(false);
      return;
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Camera & Mic Access Denied",
          description: "Please enable permissions in your browser to use this feature.",
        });
      }
    } else {
        setHasPermission(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (recordedVideo) {
      stopCameraStream();
    } else {
      getCameraPermission();
    }
    return () => {
      stopCameraStream();
    };
  }, [recordedVideo, getCameraPermission, stopCameraStream]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (isBroadcasting) {
      timer = setInterval(() => {
        setBroadcastTime((prev) => prev + 1);
      }, 1000);
    }
    else {
      setRecordingTime(0);
      setBroadcastTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording, isBroadcasting]);
  
  const startRecordingLogic = () => {
     if (videoRef.current?.srcObject) {
      recordedChunksRef.current = [];
      const stream = videoRef.current.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  }

  const handleStartRecording = () => {
    startRecordingLogic();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleRetake = () => {
    setRecordedVideo(null);
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Teleprompter animation logic
  const animateTeleprompter = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (teleprompterRef.current) {
      const scrollAmount = deltaTime * teleprompterSpeed;
      teleprompterRef.current.scrollTop += scrollAmount;
      if (teleprompterRef.current.scrollTop < teleprompterRef.current.scrollHeight - teleprompterRef.current.clientHeight) {
        animationFrameRef.current = requestAnimationFrame(animateTeleprompter);
      } else {
        setIsTeleprompterPlaying(false);
      }
    }
  }, [teleprompterSpeed]);

  useEffect(() => {
    if (isTeleprompterPlaying) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animateTeleprompter);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTeleprompterPlaying, animateTeleprompter]);

  const handleTeleprompterReset = () => {
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
    setIsTeleprompterPlaying(false);
  };
  
  const handleConnect = (platform: Platform) => {
    setConnections(prev => ({...prev, [platform]: 'connecting'}));
    setTimeout(() => {
        setConnections(prev => ({...prev, [platform]: 'connected'}));
    }, 1500)
  }

  const handleGoLive = () => {
    if (connectedPlatforms > 0 && hasPermission && hasLiveAccess) {
        startRecordingLogic();
        setIsBroadcasting(true);
    } else {
        toast({
            variant: "destructive",
            title: "Cannot Go Live",
            description: "Please connect to at least one streaming service and ensure you have enough points for live access."
        });
    }
  }
  
  const handleStopLive = () => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
    }
    setIsBroadcasting(false);
    setIsRecording(false);
    setBroadcastTime(0);
  }

  return (
    <div className="space-y-8">
        <Alert variant="default" className="bg-primary/10 border-primary/30">
          <Rocket className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold">Unlock Your Global Stage!</AlertTitle>
          <AlertDescription>
            Gaining access to live broadcasting is more than a feature; it's your opportunity to shine. Here’s what you unlock:
            <ul className="list-disc list-inside mt-2 text-xs">
              <li><strong>Direct Interaction:</strong> Connect with your audience in real-time, build a community, and get instant feedback.</li>
              <li><strong>Showcase Talent:</strong> Whether it's poetry, singing, or sharing ideas, this is your stage to perform for the world.</li>
              <li><strong>Increased Visibility:</strong> Live content gets prioritized, helping you reach a wider audience faster.</li>
              <li><strong>Monetization:</strong> Future updates will allow for sponsorships and virtual gifts, turning your passion into a profession.</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Alert variant="default" className="bg-accent/10 border-accent/30">
          <Lightbulb className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent font-bold">Idea Starter: What to Create?</AlertTitle>
          <AlertDescription>
            Not sure what to perform? Here are a few ideas to get you started on your live broadcast:
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-2 text-xs">
              <ul className="list-disc list-inside">
                <li><strong>Solo Performance:</strong></li>
                <ul className="list-['-_'] list-inside ml-4">
                  <li>Read a poem or a short story.</li>
                  <li>Sing a song or play an instrument.</li>
                  <li>Share a personal monologue or story.</li>
                  <li>Teach a quick mini-lesson.</li>
                </ul>
              </ul>
              <ul className="list-disc list-inside">
                <li><strong>Group Performance:</strong></li>
                 <ul className="list-['-_'] list-inside ml-4">
                  <li>Perform a scene from a play.</li>
                  <li>Host a debate or panel discussion.</li>
                  <li>Collaborate on a song.</li>
                  <li>Host a live Q&A with your audience.</li>
                </ul>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {user && (
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>Your Broadcast Status</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg">
                        <Award className="w-8 h-8 text-yellow-500"/>
                        <p className="text-2xl font-bold">{userPoints.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                     <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg">
                        <Clock className="w-8 h-8 text-primary"/>
                        <p className="text-2xl font-bold">{availableLiveMinutes}</p>
                        <p className="text-sm text-muted-foreground">Live Minutes Available</p>
                    </div>
                     <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg">
                        <ShieldCheck className="w-8 h-8 text-green-500"/>
                        <p className="text-2xl font-bold">{hasLiveAccess ? "Unlocked" : "Locked"}</p>
                        <p className="text-sm text-muted-foreground">Live Access ({LIVE_ACCESS_THRESHOLD.toLocaleString()} points needed)</p>
                    </div>
                </CardContent>
            </Card>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                    <Camera className="w-6 h-6" />
                    {recordedVideo ? "Review Your Video" : isBroadcasting ? "You Are Live!" : "Your Personal Recording Studio"}
                    </CardTitle>
                    <CardDescription>
                    {recordedVideo ? "Watch your recording below. You can retake it or use it." : isBroadcasting ? `Streaming live to ${connectedPlatforms} platform(s). The recording will be available after the stream ends.` : "Record a video, or go live to the world with an integrated teleprompter."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
                    <video
                        ref={videoRef}
                        src={recordedVideo || undefined}
                        className={cn("w-full h-full object-cover", { 'hidden': recordedVideo || hasPermission !== true })}
                        autoPlay={!isRecording && !isBroadcasting}
                        muted={!recordedVideo}
                        playsInline
                        controls={!!recordedVideo}
                    />
                    
                    {!recordedVideo && (
                        <div ref={teleprompterRef} className="absolute inset-x-0 top-0 h-2/3 p-10 bg-black/50 text-white text-3xl font-bold overflow-hidden pointer-events-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        <div className="text-center leading-relaxed whitespace-pre-wrap">
                            {teleprompterText}
                        </div>
                        </div>
                    )}

                    {hasPermission === false && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                        <Alert variant="destructive">
                            <Video className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                { user ? "Please allow camera & mic access to use this feature." : "Please sign in to use the camera." }
                            </AlertDescription>
                        </Alert>
                        </div>
                    )}
                    {hasPermission === null && !recordedVideo && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <p className="text-muted-foreground">Requesting camera permission...</p>
                        </div>
                    )}
                    {(isRecording || isBroadcasting) && (
                        <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded-md flex items-center gap-2">
                            <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse"/>
                            <span>{isBroadcasting ? formatTime(broadcastTime) : formatTime(recordingTime)}</span>
                            {isBroadcasting && <span className="font-bold text-red-500">LIVE</span>}
                        </div>
                    )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-center gap-4">
                    {!user ? (
                        <p className="text-sm text-muted-foreground">Sign in to start creating.</p>
                    ) : recordedVideo ? (
                        <>
                            <Button variant="outline" onClick={handleRetake}>
                                <RefreshCcw className="mr-2"/> Retake Video
                            </Button>
                            <Button>
                                <Video className="mr-2"/> Use This Video
                            </Button>
                        </>
                    ) : (
                        isRecording ? (
                            <Button onClick={handleStopRecording} variant="destructive" className="w-full sm:w-auto" disabled={isBroadcasting}>
                                <Square className="mr-2" /> Stop Recording
                            </Button>
                        ) : (
                            <Button onClick={handleStartRecording} disabled={hasPermission !== true || isBroadcasting} className="w-full sm:w-auto">
                                <Mic className="mr-2" /> Record Video
                            </Button>
                        )
                    )}
                </CardFooter>
                </Card>

                {!recordedVideo && user && (
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <CardTitle>Teleprompter</CardTitle>
                        <CardDescription>Enter your script below. It will scroll over the video as you record or go live.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Paste your script here..."
                            className="min-h-[200px] text-base"
                            value={teleprompterText}
                            onChange={(e) => setTeleprompterText(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setIsTeleprompterPlaying(!isTeleprompterPlaying)} variant="outline" disabled={!teleprompterText}>
                                {isTeleprompterPlaying ? <Pause className="mr-2"/> : <Play className="mr-2" />}
                                {isTeleprompterPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <Button onClick={handleTeleprompterReset} variant="ghost" disabled={!teleprompterText}>
                                <RefreshCcw className="mr-2" /> Reset
                            </Button>
                        </div>
                        <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                            <Label htmlFor="speed-slider">Scroll Speed</Label>
                            <Slider
                                id="speed-slider"
                                min={5}
                                max={100}
                                step={1}
                                value={[teleprompterSpeed]}
                                onValueChange={(value) => setTeleprompterSpeed(value[0])}
                                className="w-full"
                                disabled={!teleprompterText}
                            />
                        </div>
                    </CardFooter>
                </Card>
                )}
            </div>

            <div className="lg:col-span-1 space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><RadioTower className="w-6 h-6 text-primary"/> Broadcast Studio</CardTitle>
                            <CardDescription>Stream your live performance to the world.</CardDescription>
                        </CardHeader>
                         <fieldset disabled={!hasLiveAccess || !user} className="disabled:opacity-50">
                            <CardContent className="space-y-4">
                                {!hasLiveAccess && user && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Live Access Locked</AlertTitle>
                                        <AlertDescription>You need {LIVE_ACCESS_THRESHOLD.toLocaleString()} points to unlock broadcasting. Keep engaging with the app to earn more points!</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="stream-title">Stream Title</Label>
                                    <Input id="stream-title" placeholder="e.g., My Live Poetry Reading" value={streamTitle} onChange={(e) => setStreamTitle(e.target.value)} disabled={isBroadcasting} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Connect to Platforms</Label>
                                    <div className="space-y-2">
                                        {(Object.keys(connections) as Platform[]).map(platform => (
                                            <div key={platform} className="flex items-center justify-between p-2 border rounded-md">
                                                <div className="flex items-center gap-2 font-medium capitalize">
                                                    {platform === 'youtube' && <Youtube className="w-5 h-5 text-red-600"/>}
                                                    {platform === 'twitch' && <Twitch className="w-5 h-5 text-purple-600"/>}
                                                    {platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600"/>}
                                                    {platform}
                                                </div>
                                                <Button size="sm" variant="secondary" onClick={() => handleConnect(platform)} disabled={connections[platform] !== 'disconnected' || isBroadcasting}>
                                                    {connections[platform] === 'disconnected' && <><LinkIcon className="mr-2 h-4 w-4"/>Connect</>}
                                                    {connections[platform] === 'connecting' && <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Connecting...</>}
                                                    {connections[platform] === 'connected' && <>Connected</>}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {isBroadcasting ? (
                                    <Button className="w-full" variant="destructive" onClick={handleStopLive}>
                                        <Square className="mr-2 h-4 w-4" /> End Broadcast
                                    </Button>
                                ) : (
                                    <Button className="w-full" onClick={handleGoLive} disabled={hasPermission !== true || connectedPlatforms === 0 || isRecording}>
                                        Go Live Now
                                    </Button>
                                )}
                            </CardFooter>
                        </fieldset>
                    </Card>
            </div>
        </div>
    </div>
  );
}

    
