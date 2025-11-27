
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
import { Loader2, Music, Video, ThumbsUp, Star, Play, MicVocal, PartyPopper } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const audioClips = {
    en: [
        { id: 1, title: "Dramatic Movie Line", artist: "Classic Films", url: "/audio/dramatic_en.mp3", duration: 5 },
        { id: 2, title: "Funny Catchphrase", artist: "Famous Comedian", url: "/audio/funny_en.mp3", duration: 4 },
    ],
    fa: [
        { id: 3, title: "شعر معروف", artist: "شاعر نامی", url: "/audio/poem_fa.mp3", duration: 7 },
    ],
    es: [
        { id: 4, title: "Frase de Telenovela", artist: "Actor Famoso", url: "/audio/telenovela_es.mp3", duration: 6 },
    ],
    ar: [
        { id: 5, title: "اقتباس سينمائي", artist: "ممثل مشهور", url: "/audio/quote_ar.mp3", duration: 5 },
    ]
};

const sampleSubmissions = [
    { id: 1, audioTitle: "Dramatic Movie Line", user: "Alex", votes: 210, videoUrl: "https://videos.pexels.com/video-files/854341/854341-hd_1280_720_25fps.mp4" },
    { id: 2, audioTitle: "Funny Catchphrase", user: "Maria", votes: 185, videoUrl: "https://videos.pexels.com/video-files/5494391/5494391-hd_1280_720_25fps.mp4" },
    { id: 3, audioTitle: "شعر معروف", user: "کیان", votes: 152, videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_30fps.mp4" },
];

export default function LipSyncPage() {
  const [selectedAudio, setSelectedAudio] = useState<typeof audioClips.en[0] | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const { toast } = useToast();
  const { user } = useUser();
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions to record.",
        });
      }
    };
    if (selectedAudio && !isSubmitted) {
        getCameraPermission();
    }
     return () => {
      if (userVideoRef.current && userVideoRef.current.srcObject) {
        const stream = userVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedAudio, isSubmitted, toast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && selectedAudio && recordingTime < selectedAudio.duration) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (isRecording && selectedAudio && recordingTime >= selectedAudio.duration) {
        handleStopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingTime, selectedAudio]);
  

  const handleStartRecording = async () => {
    if (!selectedAudio || !user || hasCameraPermission !== true) return;

    setIsRecording(true);
    setRecordingTime(0);
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }
    if(userVideoRef.current?.paused){
        userVideoRef.current.play();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if(audioRef.current) audioRef.current.pause();
    if(userVideoRef.current) userVideoRef.current.pause();

    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({ title: "Lip Sync Submitted!", description: "Your video is now up for voting!" });
    }, 2000);
  };
  
  const resetForm = () => {
      setSelectedAudio(null);
      setIsSubmitted(false);
      setRecordingTime(0);
  }

  const renderAudioSelector = () => (
     <Card>
        <CardHeader>
            <CardTitle className="font-headline">1. Choose an Audio Clip</CardTitle>
            <CardDescription>Select a sound to create your lip sync video.</CardDescription>
        </CardHeader>
        <CardContent>
             <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="fa">فارسی</TabsTrigger>
                    <TabsTrigger value="es">Español</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                {(Object.keys(audioClips) as Array<keyof typeof audioClips>).map(lang => (
                    <TabsContent key={lang} value={lang} className="mt-4">
                        <div className="space-y-3">
                        {audioClips[lang].map(clip => (
                            <div key={clip.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50">
                                <div>
                                    <p className="font-semibold">{clip.title}</p>
                                    <p className="text-sm text-muted-foreground">{clip.artist}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className="text-xs text-muted-foreground">{clip.duration}s</span>
                                     <Button size="sm" onClick={() => setSelectedAudio(clip)}>
                                         <Play className="mr-2 h-4 w-4" /> Select
                                     </Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </CardContent>
    </Card>
  );

  const renderRecorder = () => (
     <Card className="w-full max-w-2xl mx-auto shadow-lg">
         <CardHeader>
            <CardTitle className="text-2xl font-headline">Recording: "{selectedAudio?.title}"</CardTitle>
            <CardDescription>Get ready to perform! The audio will play when you start recording.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {isSubmitted ? (
                <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Submission Successful!</h3>
                    <p className="text-muted-foreground mt-2">Your video is now live for the community to vote on. Good luck!</p>
                    <Button className="mt-6" onClick={resetForm}>Create Another Video</Button>
                </div>
            ) : (
            <>
            <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                 <video ref={userVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                 {hasCameraPermission === false && (
                    <Alert variant="destructive" className="m-4">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>Please allow camera access to record a video.</AlertDescription>
                    </Alert>
                 )}
                 <audio ref={audioRef} src={selectedAudio?.url} className="hidden" />
            </div>
             {isRecording && selectedAudio && (
                <div className="space-y-2">
                    <Progress value={(recordingTime / selectedAudio.duration) * 100} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">{recordingTime}s / {selectedAudio.duration}s</p>
                </div>
             )}
             </>
            )}
        </CardContent>
        {!isSubmitted && (
            <CardFooter className="flex justify-center gap-4">
                <Button onClick={() => setSelectedAudio(null)} variant="outline" disabled={isRecording || isLoading}>Change Audio</Button>
                {!isRecording ? (
                    <Button onClick={handleStartRecording} disabled={!user || isLoading || hasCameraPermission !== true}>
                        <MicVocal className="mr-2 h-4 w-4" /> Start Recording
                    </Button>
                ) : (
                    <Button onClick={handleStopRecording} variant="destructive" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <><Video className="mr-2 h-4 w-4"/> Stop & Submit</>}
                    </Button>
                )}
            </CardFooter>
        )}
    </Card>
  );

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-accent/20 border-accent/30">
        <Star className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">Lip Sync Challenge!</AlertTitle>
        <AlertDescription>
         Show off your talent! Pick a sound, record your lip sync video, and submit it. The community will vote for the best videos. Every month, a prize will be awarded to one of the top-voted creators! Top entries will also be featured on our social media channels.
        </AlertDescription>
      </Alert>

        {selectedAudio ? renderRecorder() : renderAudioSelector()}

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
                        <CardTitle className="text-lg">{sub.audioTitle}</CardTitle>
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

    