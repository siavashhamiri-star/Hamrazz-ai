
"use client";

import { useState, useRef, useEffect } from "react";
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
import { Loader2, PartyPopper, Upload, Mic, Video, ThumbsUp, Star } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const clips = [
    { id: 1, title: "The Curious Squirrel", url: "https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4", duration: 10 },
    { id: 2, title: "The Bouncing Ball", url: "https://videos.pexels.com/video-files/7578540/7578540-sd_640_360_25fps.mp4", duration: 8 },
    { id: 3, title: "Cat's Morning Stretch", url: "https://videos.pexels.com/video-files/4493547/4493547-sd_640_360_24fps.mp4", duration: 12 },
];

const sampleSubmissions = [
    { id: 1, clipTitle: "The Curious Squirrel", user: "Aria", votes: 125, videoUrl: "https://videos.pexels.com/video-files/854341/854341-hd_1280_720_25fps.mp4" },
    { id: 2, clipTitle: "The Curious Squirrel", user: "Kian", votes: 98, videoUrl: "https://videos.pexels.com/video-files/5494391/5494391-hd_1280_720_25fps.mp4" },
    { id: 3, clipTitle: "The Bouncing Ball", user: "Bahar", votes: 150, videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_30fps.mp4" },
]

export default function DubbingPage() {
  const [selectedClip, setSelectedClip] = useState<typeof clips[0] | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const clipVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && selectedClip && recordingTime < selectedClip.duration) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    if (selectedClip && recordingTime >= selectedClip.duration) {
        handleStopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingTime, selectedClip]);
  
  const setupCamera = async () => {
     try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
        }
        return true;
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          variant: "destructive",
          title: "Camera/Mic Access Denied",
          description: "Please enable camera and microphone permissions to record.",
        });
        return false;
      }
  }

  const handleStartRecording = async () => {
    if (!selectedClip || !user) return;
    const hasPermission = await setupCamera();
    if (!hasPermission) return;

    setIsRecording(true);
    setRecordingTime(0);
    if(clipVideoRef.current) {
        clipVideoRef.current.currentTime = 0;
        clipVideoRef.current.play();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if(clipVideoRef.current) clipVideoRef.current.pause();
    if (userVideoRef.current && userVideoRef.current.srcObject) {
      const stream = userVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      userVideoRef.current.srcObject = null;
    }
    // Here you would typically process the recorded video
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({ title: "Dubbing Submitted!", description: "Your voice-over has been submitted for voting." });
    }, 2000);
  };
  
  const resetForm = () => {
      setSelectedClip(null);
      setIsSubmitted(false);
      setRecordingTime(0);
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-accent/20 border-accent/30">
        <Star className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">Voice Acting Contest!</AlertTitle>
        <AlertDescription>
          Show off your voice acting talent! Pick a clip, record your voice-over, and submit it. The community will vote for the best dubbings. Every three months, a surprise prize will be awarded to one of the top-voted creators! Top entries will also be featured on our social media channels.
        </AlertDescription>
      </Alert>

        {selectedClip ? (
            <Card className="w-full max-w-3xl mx-auto shadow-lg">
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline">Dubbing: "{selectedClip.title}"</CardTitle>
                    <CardDescription>Get ready to record! Your video and voice will be captured.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isSubmitted ? (
                        <div className="text-center p-8">
                            <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                            <h3 className="text-2xl font-headline mt-4">Submission Successful!</h3>
                            <p className="text-muted-foreground mt-2">Your dubbing is now live for the community to vote on. Good luck!</p>
                            <Button className="mt-6" onClick={resetForm}>Dub Another Clip</Button>
                        </div>
                    ) : (
                    <>
                    <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden">
                        <video ref={clipVideoRef} src={selectedClip.url} className="w-full h-full object-cover" muted playsInline />
                         <div className="absolute bottom-4 right-4 w-1/4 aspect-[4/3] rounded-md overflow-hidden border-2 border-white shadow-2xl">
                             <video ref={userVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                         </div>
                    </div>
                     {isRecording && (
                        <div className="space-y-2">
                            <Progress value={(recordingTime / selectedClip.duration) * 100} className="w-full" />
                            <p className="text-sm text-center text-muted-foreground">{recordingTime}s / {selectedClip.duration}s</p>
                        </div>
                     )}
                     </>
                    )}
                </CardContent>
                {!isSubmitted && (
                    <CardFooter className="flex justify-center gap-4">
                        <Button onClick={() => setSelectedClip(null)} variant="outline" disabled={isRecording || isLoading}>Change Clip</Button>
                        {!isRecording ? (
                            <Button onClick={handleStartRecording} disabled={!user || isLoading}>
                                <Mic className="mr-2 h-4 w-4" /> Start Recording
                            </Button>
                        ) : (
                            <Button onClick={handleStopRecording} variant="destructive" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <><Video className="mr-2 h-4 w-4"/> Stop & Submit</>}
                            </Button>
                        )}
                    </CardFooter>
                )}
            </Card>
        ) : (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">1. Choose a Clip to Dub</CardTitle>
                    <CardDescription>Select one of the short animation clips below to start.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clips.map(clip => (
                    <Card key={clip.id} className="cursor-pointer hover:shadow-primary/20 transition-shadow" onClick={() => setSelectedClip(clip)}>
                        <CardContent className="p-0">
                            <video src={clip.url} className="aspect-video w-full object-cover rounded-t-lg bg-muted" muted playsInline loop/>
                        </CardContent>
                        <CardHeader>
                            <CardTitle className="text-lg">{clip.title}</CardTitle>
                            <CardDescription>{clip.duration} seconds</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
                </CardContent>
            </Card>
        )}

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">2. Vote for Your Favorites</CardTitle>
            <CardDescription>Watch the submissions from the community and vote for the best ones!</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleSubmissions.sort((a,b) => b.votes - a.votes).map(sub => (
                 <Card key={sub.id} className="shadow-lg flex flex-col">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <video src={sub.videoUrl} className="w-full h-full object-cover" controls />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">{sub.clipTitle}</CardTitle>
                        <CardDescription>by {sub.user}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" variant={user ? "default" : "outline"} disabled={!user}>
                            <ThumbsUp className="mr-2 h-4 w-4" /> Vote ({sub.votes})
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </CardContent>
      </Card>

    </div>
  );
}
