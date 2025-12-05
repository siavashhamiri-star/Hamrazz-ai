
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PartyPopper, Video, Upload, Rocket, DollarSign } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PitchPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions to record a video.",
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please provide a title and description for your idea.",
      });
      return;
    }
    // In a real app, video would be required. Here it's optional for demo.
    // if (!videoFile) {
    //   toast({ variant: "destructive", title: "Video Missing", description: "Please record or upload a video pitch." });
    //   return;
    // }
    setIsLoading(true);

    // Simulate API call for submission
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // In a real app, you would upload the video and form data
    console.log("Pitch Submission:", {
      userId: user?.uid || "anonymous",
      title,
      description,
      videoFileName: videoFile?.name,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex justify-center items-start pt-8">
        <Card className="w-full max-w-2xl shadow-lg text-center animate-in fade-in-50">
          <CardHeader>
            <PartyPopper className="w-16 h-16 mx-auto text-primary" />
            <CardTitle className="text-2xl font-headline mt-4">Your Idea Has Been Submitted!</CardTitle>
            <CardDescription>Thank you for sharing your vision. We will review it carefully. If your idea is selected, you may be contacted by potential sponsors or the Hamraz team directly.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => {
              setIsSubmitted(false);
              setTitle("");
              setDescription("");
              setVideoFile(null);
            }}>Submit Another Idea</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Rocket className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Become a Project Creator!</AlertTitle>
        <AlertDescription>
          Have a brilliant idea for an app or an online business using AI? Pitch it here! Your idea could attract sponsors and investors, or even get direct support from the Hamraz app itself to be built and launched.
        </AlertDescription>
      </Alert>

      <Alert variant="default" className="bg-accent/20 border-accent/30">
        <DollarSign className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">Brilliant Idea Sponsorship Fund</AlertTitle>
        <AlertDescription>
          We believe great ideas deserve a chance. That's why **1% of Hamraz's total revenue** is dedicated to a fund for sponsoring brilliant ideas from creators who may not have financial support. Your vision could be the next big thing we help bring to life.
        </AlertDescription>
      </Alert>

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Pitch Your Creative Idea</CardTitle>
            <CardDescription>Explain your vision. Your video pitch may be shared on our social channels to attract potential partners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="idea-title">Idea Title</Label>
              <Input
                id="idea-title"
                placeholder="What's the name of your project?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading || !user}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-description">Detailed Description</Label>
              <Textarea
                id="idea-description"
                placeholder="Describe your idea, the problem it solves, and who it's for."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || !user}
                required
                className="min-h-[150px]"
              />
            </div>
            
            <div className="space-y-4">
              <Label>Video Pitch (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <p className="text-sm text-muted-foreground">Record a short video explaining your idea.</p>
                   <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
                     <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                     {hasCameraPermission === false && (
                       <Alert variant="destructive" className="m-4">
                         <AlertTitle>Camera Access Required</AlertTitle>
                         <AlertDescription>Please allow camera access to record.</AlertDescription>
                       </Alert>
                     )}
                   </div>
                   <Button type="button" className="w-full" disabled={isLoading || !user || !hasCameraPermission}>
                     <Video className="mr-2 h-4 w-4" /> Start Recording
                   </Button>
                </div>
                 <div className="space-y-2 flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground">Or upload an existing video file.</p>
                    <Label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground text-center">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">MP4, MOV, or WEBM</p>
                        </div>
                        <Input id="video-upload" type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                    </Label>
                    {videoFile && <p className="text-xs text-muted-foreground">Selected: {videoFile.name}</p>}
                </div>
              </div>
            </div>

            {!user && (
              <p className="text-sm text-center text-destructive font-medium">
                Please sign in to submit your idea.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !user}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Idea...</>
              ) : (
                <><Rocket className="mr-2 h-4 w-4" />Launch My Idea</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
