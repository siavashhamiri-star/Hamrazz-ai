
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
import { Loader2, PartyPopper, Upload, SmilePlus } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sampleAntics = [
  {
    title: "The Great Spaghetti Escape",
    description: "Caught him trying to wear his dinner as a hat. Couldn't stop laughing!",
    videoUrl: "https://videos.pexels.com/video-files/5586629/5586629-hd_1280_720_30fps.mp4",
    author: "Bahar's Mom"
  },
  {
    title: "Dancing to his own beat",
    description: "He invented this new dance move and wanted to show everyone. Pure joy!",
    videoUrl: "https://videos.pexels.com/video-files/5494391/5494391-hd_1280_720_25fps.mp4",
    author: "Kian's Dad"
  },
  {
    title: "First time tasting lemon",
    description: "That face says it all! A classic moment we had to capture.",
    videoUrl: "https://videos.pexels.com/video-files/5699419/5699419-hd_1280_720_25fps.mp4",
    author: "Sara's Parents"
  }
];

export default function AnticsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !videoFile) {
      toast({
        variant: "destructive",
        title: "Incomplete Submission",
        description: "Please provide a title, description, and upload a video.",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log("Antic Submission:", {
      userId: user?.uid || "anonymous",
      title,
      description,
      videoFileName: videoFile?.name,
    });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-accent/20 border-accent/30">
        <SmilePlus className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">Share a Funny Moment!</AlertTitle>
        <AlertDescription>
          Capture and share the funny, sweet, and silly things your children do. These precious moments bring joy to the entire community.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleAntics.map((antic, index) => (
          <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
             <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <video src={antic.videoUrl} className="w-full h-full object-cover" controls />
             </div>
            <CardHeader>
              <CardTitle>{antic.title}</CardTitle>
              <CardDescription>Shared by {antic.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">"{antic.description}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="w-full max-w-2xl mx-auto shadow-lg" id="share-antic">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Share a Sweet Moment</CardTitle>
            <CardDescription>Upload a short video of your child's funny antics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            { isSubmitted ? (
                 <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Moment Shared!</h3>
                    <p className="text-muted-foreground mt-2">Thank you for sharing this joyful moment. It's sure to bring a smile to many faces!</p>
                    <Button className="mt-6" onClick={() => {
                        setIsSubmitted(false);
                        setTitle('');
                        setDescription('');
                        setVideoFile(null);
                    }}>Share Another</Button>
                </div>
            ) : (
            <>
            <div className="space-y-2">
              <Label htmlFor="antic-title">Title</Label>
              <Input
                id="antic-title"
                placeholder="e.g., 'My son the superhero'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading || !user}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="antic-description">Description</Label>
              <Textarea
                id="antic-description"
                placeholder="Briefly describe the funny moment!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || !user}
                required
              />
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
