
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import { Camera, Video, Mic, Circle, Square, RefreshCcw } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function CameraPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();
  const { user } = useUser();

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
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecording = () => {
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

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Camera className="w-6 h-6" />
            {recordedVideo ? "Review Your Video" : "Live Camera View"}
          </CardTitle>
          <CardDescription>
            {recordedVideo ? "Watch your recording below." : "This is your personal recording studio. Smile for the camera!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
            <video
              ref={videoRef}
              src={recordedVideo || undefined}
              className={cn("w-full h-full object-cover", { 'hidden': !recordedVideo && hasPermission !== true })}
              autoPlay={!isRecording}
              muted={!recordedVideo}
              playsInline
              controls={!!recordedVideo}
            />
            
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
            {isRecording && (
                <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded-md flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500"/>
                    <span>{formatTime(recordingTime)}</span>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
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
                    <Button onClick={handleStopRecording} variant="destructive" className="w-full sm:w-auto">
                        <Square className="mr-2" /> Stop Recording
                    </Button>
                ) : (
                    <Button onClick={handleStartRecording} disabled={hasPermission !== true} className="w-full sm:w-auto">
                        <Mic className="mr-2" /> Start Recording
                    </Button>
                )
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
