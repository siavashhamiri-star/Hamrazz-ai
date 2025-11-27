
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Video, Upload, MessageSquare, ShieldAlert, Lightbulb } from "lucide-react";
import { useUser } from "@/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TextFeedback = ({title, description}: {title: string, description: string}) => {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Text Feedback submitted:", {
      userId: user?.uid || "anonymous",
      feedback,
      type: title,
      timestamp: new Date().toISOString(),
    });
    setIsLoading(false);
    setFeedback("");
    toast({
      title: "Thank you!",
      description: "Your message has been submitted.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={
            user ? "Your message..." : "Please sign in to submit."
          }
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[150px] text-base"
          disabled={!user || isLoading}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!user || isLoading || !feedback.trim()}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" />Submit</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const VideoTestimonial = () => {
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !videoFile) {
        toast({
            variant: "destructive",
            title: "Incomplete",
            description: "Please add a short description and upload your video.",
        });
        return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log("Video Testimonial submitted:", {
        userId: user?.uid,
        description,
        videoFileName: videoFile.name,
    });
    setIsLoading(false);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
        <Card className="text-center p-8">
             <CardTitle className="text-2xl font-headline mb-2">Thank You for Sharing!</CardTitle>
             <CardDescription className="mb-4">Your story is important to us. We appreciate you taking the time to share your experience.</CardDescription>
             <Button onClick={() => {
                 setIsSubmitted(false);
                 setDescription("");
                 setVideoFile(null);
             }}>Share Another Video</Button>
        </Card>
    )
  }


  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Share Your Experience</CardTitle>
          <CardDescription>
            Share a short (1-minute) video about your experience being part of the Hamraz family. Your video may be featured on our social media channels (YouTube, Instagram, TikTok), provided you are a member of our channel on that platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="video-description">Your Experience</Label>
              <Textarea
                id="video-description"
                placeholder="Briefly describe what you'll talk about in the video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || !user}
                required
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Your 1-Minute Video</Label>
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
                Please sign in to share a video testimonial.
              </p>
            )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || !user}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Video...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" />Submit Video</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default function FeedbackPage() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Share Your Voice</h1>
        <p className="text-muted-foreground mt-2">
          Your feedback and experiences are invaluable in helping us grow and improve.
        </p>
      </div>

      <Tabs defaultValue="strategic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategic"><Lightbulb className="mr-2"/>Strategic Ideas</TabsTrigger>
          <TabsTrigger value="reports"><ShieldAlert className="mr-2"/>Suggestions & Reports</TabsTrigger>
          <TabsTrigger value="video"><Video className="mr-2"/>Share Experience</TabsTrigger>
        </TabsList>
        <TabsContent value="strategic" className="mt-6">
          <TextFeedback 
            title="Strategic Ideas for the Future"
            description="Use this section to share your big, strategic ideas about the future of the Hamraz platform and even the nature of human-AI collaboration. Your messages will be sent directly to the leadership and strategy team."
          />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <TextFeedback 
            title="Suggestions & Reports"
            description="Use this form to share constructive suggestions, report a bug, or report user violations and misconduct."
          />
        </TabsContent>
        <TabsContent value="video" className="mt-6">
          <VideoTestimonial />
        </TabsContent>
      </Tabs>
    </div>
  );
}
