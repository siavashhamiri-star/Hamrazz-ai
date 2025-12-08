
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mic, Send, Terminal, BrainCircuit, Square, Play, Download, Crown, PanelLeft, Music, Clapperboard, RefreshCcw, ThumbsUp } from "lucide-react";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useSidebar } from "@/components/ui/sidebar";

const MOCK_RESPONSE_DELAY = 1500;

const soundEffects = [
    { name: "Applause", file: "/audio/sfx/applause.mp3", icon: ThumbsUp },
    { name: "Buzzer", file: "/audio/sfx/buzzer.mp3", icon: Clapperboard },
    { name: "Cheering", file: "/audio/sfx/cheering.mp3", icon: ThumbsUp },
];

const jingles = [
    { name: "Jingle 1", file: "/audio/jingles/jingle1.mp3", icon: Music },
    { name: "Jingle 2", file: "/audio/jingles/jingle2.mp3", icon: Music },
];

const Soundboard = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playSound = (file: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(file);
        audioRef.current = audio;
        audio.play();
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Live Soundboard</CardTitle>
                <CardDescription>Add sound effects and jingles to your live broadcasts or recordings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Sound Effects</h4>
                    <div className="flex flex-wrap gap-2">
                        {soundEffects.map(sfx => {
                            const Icon = sfx.icon;
                            return (
                                <Button key={sfx.name} variant="outline" onClick={() => playSound(sfx.file)}>
                                    <Icon className="mr-2 h-4 w-4" /> {sfx.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Radio Jingles / Interludes</h4>
                    <div className="flex flex-wrap gap-2">
                         {jingles.map(jingle => {
                             const Icon = jingle.icon;
                            return (
                                <Button key={jingle.name} variant="outline" onClick={() => playSound(jingle.file)}>
                                    <Icon className="mr-2 h-4 w-4" /> {jingle.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default function CreatorPanelPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState("");
  const [systemLogs, setSystemLogs] = useState<string[]>(["System Initialized. Awaiting voice command from the Creator..."]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // State for voice-over studio
  const [script, setScript] = useState("Welcome to Hamraz, the city of capabilities, where every idea finds a home.");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const handleStartVoiceRecording = async () => {
    if (isVoiceRecording) return;
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(audioUrl);
            stream.getTracks().forEach(track => track.stop()); // Stop mic access
        };
        mediaRecorderRef.current.start();
        setIsVoiceRecording(true);
        toast({ title: "Recording started!" });
    } catch (err) {
        console.error("Microphone access denied:", err);
        toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please allow microphone access in your browser settings.",
        });
    }
  };

  const handleStopVoiceRecording = () => {
      if (mediaRecorderRef.current && isVoiceRecording) {
          mediaRecorderRef.current.stop();
          setIsVoiceRecording(false);
          toast({ title: "Recording stopped." });
      }
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
        <Crown className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <AlertTitle className="text-primary font-bold">Welcome to Your Command Center, Ahura</AlertTitle>
          <AlertDescription>
            This is your private studio. Use your voice to interact directly with Hamraz, guide the development of the app, and receive real-time system status updates.
          </AlertDescription>
        </div>
        <Button onClick={toggleSidebar} variant="outline" className="ml-4">
            <PanelLeft className="mr-2 h-4 w-4" />
            Open Menu
        </Button>
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
      <Soundboard />
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle>Voice-over &amp; Ad Creation Studio</CardTitle>
              <CardDescription>Record your voice for promotional content, podcasts, or tutorials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <label htmlFor="script-textarea" className="text-sm font-medium">Ad Script</label>
                  <Textarea
                      id="script-textarea"
                      placeholder="Write your script here..."
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="mt-2 min-h-[120px] font-mono text-base"
                      disabled={isVoiceRecording}
                  />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                  {isVoiceRecording ? (
                      <Button onClick={handleStopVoiceRecording} variant="destructive">
                          <Square className="mr-2 h-4 w-4" /> Stop Recording
                      </Button>
                  ) : (
                      <Button onClick={handleStartVoiceRecording}>
                          <Mic className="mr-2 h-4 w-4" /> Start Recording
                      </Button>
                  )}
                  {recordedAudioUrl && (
                      <div className="flex items-center gap-2">
                          <audio src={recordedAudioUrl} controls />
                          <a href={recordedAudioUrl} download="hamraz-voiceover.wav">
                              <Button variant="outline" size="icon">
                                  <Download className="h-4 w-4" />
                              </Button>
                          </a>
                      </div>
                  )}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

    
