
"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, PartyPopper, Upload, Cloud } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sampleDreams = [
  {
    title: "I want to be an astronaut!",
    childName: "Kian, age 6",
    videoUrl: "https://videos.pexels.com/video-files/853874/853874-hd_1280_720_25fps.mp4",
    description: "He says he wants to discover a new planet and name it after his cat."
  },
  {
    title: "My dream is to be a chef.",
    childName: "Bahar, age 8",
    videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_30fps.mp4",
    description: "She wants to open a restaurant that only serves desserts. Her favorite fruit is strawberry."
  },
  {
    title: "A Vet for all animals",
    childName: "Sara, age 7",
    videoUrl: "https://videos.pexels.com/video-files/5992982/5992982-hd_1280_720_25fps.mp4",
    description: "She told me her biggest wish is to be able to talk to animals and help them when they are sick."
  }
];

export default function DreamsPage() {
  const [dreamTitle, setDreamTitle] = useState("");
  const [childName, setChildName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamTitle.trim() || !childName.trim() || !videoFile) {
      toast({
        variant: "destructive",
        title: "Incomplete Submission",
        description: "Please fill out all fields and upload a video.",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log("Dream Submission:", {
      userId: user?.uid || "anonymous",
      dreamTitle,
      childName,
      videoFileName: videoFile?.name,
    });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Cloud className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">World of Dreams</AlertTitle>
        <AlertDescription>
          Ask your child about their dreams! What do they want to be when they grow up? What is their biggest wish? What's their favorite fruit? Share these precious conversations with the community.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDreams.map((dream, index) => (
          <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
             <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <video src={dream.videoUrl} className="w-full h-full object-cover" controls />
             </div>
            <CardHeader>
              <CardTitle>"{dream.title}"</CardTitle>
              <CardDescription>A dream by {dream.childName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">Parent's note: {dream.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="w-full max-w-2xl mx-auto shadow-lg" id="share-dream">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Share a Dream</CardTitle>
            <CardDescription>Upload a short video of your child sharing their dreams and wishes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            { isSubmitted ? (
                 <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Dream Shared!</h3>
                    <p className="text-muted-foreground mt-2">Thank you for sharing this inspiring moment. It's sure to bring a smile to many faces!</p>
                    <Button className="mt-6" onClick={() => {
                        setIsSubmitted(false);
                        setDreamTitle('');
                        setChildName('');
                        setVideoFile(null);
                    }}>Share Another Dream</Button>
                </div>
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dream-title">Dream / Wish Title</Label>
                <Input
                  id="dream-title"
                  placeholder="e.g., 'I want to be a firefighter'"
                  value={dreamTitle}
                  onChange={(e) => setDreamTitle(e.target.value)}
                  disabled={isLoading || !user}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="child-name">Your Child's Name & Age</Label>
                <Input
                  id="child-name"
                  placeholder="e.g., 'Aria, 5'"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  disabled={isLoading || !user}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Video</Label>
                <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                    disabled={isLoading || !user}
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                 {videoFile && <p className="text-xs text-muted-foreground pt-1">Selected: {videoFile.name}</p>}
            </div>

            {!user && (
              <p className="text-sm text-center text-destructive font-medium">
                Please sign in to share a video.
              </p>
            )}
            </>
            )}
          </CardContent>
          {!isSubmitted && (
             <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || !user}>
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                ) : (
                    <><Upload className="mr-2 h-4 w-4" />Share Dream</>
                )}
                </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
