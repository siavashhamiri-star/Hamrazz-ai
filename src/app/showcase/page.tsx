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
import { Loader2, PartyPopper, Upload, Trophy, Film } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const successStories = [
    {
        title: "From Hobby to Business: My AI-Powered App Journey",
        author: "Alex Chen",
        videoUrl: "https://videos.pexels.com/video-files/853874/853874-hd_1280_720_25fps.mp4",
        description: "Learn how I used the Hamraz platform to turn a simple idea for a language learning game into a profitable app with thousands of users."
    },
    {
        title: "Securing Funding with an AI-Generated Pitch",
        author: "Priya Sharma",
        videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_30fps.mp4",
        description: "The AI tools here helped me create a compelling video pitch that wowed investors and secured the seed funding for my startup."
    },
    {
        title: "Finding My Co-Founder in the Hamraz Community",
        author: "Ben Carter",
        videoUrl: "https://videos.pexels.com/video-files/853874/853874-hd_1280_720_25fps.mp4",
        description: "I posted a collaborator request and found the perfect technical co-founder. Together, we're building the future of EdTech."
    }
];

export default function ShowcasePage() {
  const [title, setTitle] = useState("");
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
    if (!title.trim() || !description.trim() || !videoFile) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please provide a title, description, and a video for your success story.",
      });
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    console.log("Success Story Submission:", {
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
      <Alert variant="default" className="bg-accent/10 border-accent/30">
        <Trophy className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent">Share Your Success!</AlertTitle>
        <AlertDescription>
          Have you turned an idea into reality, found a collaborator, or reached a milestone using our platform? Share your story to inspire others and get featured!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {successStories.map((story, index) => (
          <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
             <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <video src={story.videoUrl} className="w-full h-full object-cover" controls />
             </div>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>by {story.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{story.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg" id="submit-story">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Submit Your Success Story</CardTitle>
            <CardDescription>We'd love to hear how Hamraz has helped you achieve your goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            { isSubmitted ? (
                <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Story Submitted!</h3>
                    <p className="text-muted-foreground mt-2">Thank you for sharing your success. We'll review your submission and may feature it on our showcase!</p>
                    <Button className="mt-6" onClick={() => {
                        setIsSubmitted(false);
                        setTitle('');
                        setDescription('');
                        setVideoFile(null);
                    }}>Submit Another Story</Button>
                </div>
            ) : (
            <>
            <div className="space-y-2">
              <Label htmlFor="story-title">Title of Your Story</Label>
              <Input
                id="story-title"
                placeholder="e.g., How I Launched My First App"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading || !user}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-description">Your Story</Label>
              <Textarea
                id="story-description"
                placeholder="Tell us about your journey and your success..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || !user}
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Your Video</Label>
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
                Please sign in to submit your story.
              </p>
            )}
            </>
            )}
          </CardContent>
          {!isSubmitted && (
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || !user}>
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                ) : (
                    <><Trophy className="mr-2 h-4 w-4" />Submit My Story</>
                )}
                </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
