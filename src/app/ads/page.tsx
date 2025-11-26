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
import { Loader2, PartyPopper, Upload, Film } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdsPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !videoFile) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill out all fields and upload a sample video.",
      });
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    console.log("Ad Video Submission:", {
      userId: user?.uid || "anonymous",
      name,
      contact,
      videoFileName: videoFile.name,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg text-center animate-in fade-in-50">
            <CardHeader>
                <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                <CardTitle className="text-2xl font-headline mt-4">Submission Successful!</CardTitle>
                <CardDescription>Thank you for submitting your promotional video. Our team will review it, and if it meets our standards, you will be invited to our community of advertisers.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full" onClick={() => setIsSubmitted(false)}>Submit Another Video</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Film className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Join Our Advertising Creators Community!</AlertTitle>
        <AlertDescription>
          Can you create compelling promotional videos? Submit a sample of your work. If your video is approved, you'll join our exclusive community of ad creators. You'll get opportunities to advertise your services within our app and social media channels, connecting you with new clients.
        </AlertDescription>
      </Alert>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Submit Your Promotional Video</CardTitle>
            <CardDescription>Showcase your talent and get opportunities to attract clients.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Your Name / Company Name</Label>
                    <Input id="name" placeholder="e.g., John Doe Productions" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading || !user} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Info (Email/Portfolio)</Label>
                    <Input id="contact" placeholder="your.email@example.com" value={contact} onChange={(e) => setContact(e.target.value)} disabled={isLoading || !user} required />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Your Sample Ad Video</Label>
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
                Please sign in to submit a video.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !user}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" />Submit Video</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
