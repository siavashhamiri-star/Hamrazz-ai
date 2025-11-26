
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PartyPopper, Upload, Camera, Film } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sampleMoments = [
  {
    title: "First time hearing a story!",
    author: "Sara's Dad",
    videoUrl: "https://videos.pexels.com/video-files/854341/854341-hd_1280_720_25fps.mp4",
    description: "Her eyes lit up when the AI started telling the story of the brave little fox. Such a magical moment."
  },
  {
    title: "Giggles with the chatbot",
    author: "Kian's Mom",
    videoUrl: "https://videos.pexels.com/video-files/2882112/2882112-hd_1280_720_30fps.mp4",
    description: "He couldn't stop laughing at the silly rhymes the chatbot made up. This is his new best friend!"
  },
  {
    title: "Learning Persian words",
    author: "Layla's Parents",
    videoUrl: "https://videos.pexels.com/video-files/5494391/5494391-hd_1280_720_25fps.mp4",
    description: "Watching her repeat her first Persian words with the tutor was priceless. So proud of her progress."
  }
];

export default function MomentsPage() {
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !videoFile) {
      toast({
        variant: "destructive",
        title: "Incomplete Submission",
        description: "Please provide a description and upload a video file.",
      });
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    console.log("Moment Submission:", {
      userId: user?.uid || "anonymous",
      description,
      videoFileName: videoFile?.name,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Camera className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Share a Precious Moment</AlertTitle>
        <AlertDescription>
          Capture and share a short video of your child's reaction while they listen to a story, chat with their AI companion, or learn something new. Let's celebrate these joyful learning moments together! Selected videos may be featured on our social media channels.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleMoments.map((moment, index) => (
          <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
             <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <video src={moment.videoUrl} className="w-full h-full object-cover" controls />
             </div>
            <CardHeader>
              <CardTitle>{moment.title}</CardTitle>
              <CardDescription>Shared by {moment.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">"{moment.description}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="w-full max-w-2xl mx-auto shadow-lg" id="share-moment">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Share Your Moment</CardTitle>
            <CardDescription>Upload a video of your child's delightful reaction. Note: Submitted videos may be featured on our official YouTube, Instagram, or TikTok channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            { isSubmitted ? (
                 <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Moment Shared!</h3>
                    <p className="text-muted-foreground mt-2">Thank you for sharing this beautiful memory with the community. It will be reviewed and may be featured soon!</p>
                    <Button className="mt-6" onClick={() => {
                        setIsSubmitted(false);
                        setDescription('');
                        setVideoFile(null);
                    }}>Share Another Moment</Button>
                </div>
            ) : (
            <>
            <div className="space-y-2">
              <Label htmlFor="moment-description">Description</Label>
              <Textarea
                id="moment-description"
                placeholder="Briefly describe this moment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || !user}
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Video</Label>
                <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isLoading || !user}
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                 {videoFile && <p className="text-xs text-muted-foreground pt-1">Selected: {videoFile.name}</p>}
            </div>

            {!user && (
              <p className="text-sm text-center text-destructive font-medium">
                Please sign in to share a moment.
              </p>
            )}
            </>
            )}
          </CardContent>
          {!isSubmitted && (
             <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || !user}>
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading Moment...</>
                ) : (
                    <><Upload className="mr-2 h-4 w-4" />Share Moment</>
                )}
                </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
