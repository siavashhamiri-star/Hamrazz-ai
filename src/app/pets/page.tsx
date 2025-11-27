
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
import { Loader2, PartyPopper, Upload, PawPrint } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const samplePets = [
  {
    title: "Gentle Giant",
    description: "Our dog is so patient and gentle with our little one. Best friends forever!",
    videoUrl: "https://videos.pexels.com/video-files/5992982/5992982-hd_1280_720_25fps.mp4",
    author: "Bahar's Mom"
  },
  {
    title: "A Purrfect Friendship",
    description: "The cat seems to understand that he needs to be extra careful. This is their daily cuddle routine.",
    videoUrl: "https://videos.pexels.com/video-files/7188143/7188143-hd_1280_720_25fps.mp4",
    author: "Kian's Dad"
  },
  {
    title: "Curiosity and Cuddles",
    description: "First meeting! The kitten is just as curious as the baby. A heartwarming moment.",
    videoUrl: "https://videos.pexels.com/video-files/7603734/7603734-hd_1280_720_25fps.mp4",
    author: "Sara's Parents"
  }
];

export default function PetsPage() {
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
    console.log("Pet Video Submission:", {
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
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <PawPrint className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Kids & Pets: A Special Bond</AlertTitle>
        <AlertDescription>
          Share heartwarming videos of the beautiful and loving interactions between children and animals. These moments teach us about compassion and friendship.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePets.map((pet, index) => (
          <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
             <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <video src={pet.videoUrl} className="w-full h-full object-cover" controls />
             </div>
            <CardHeader>
              <CardTitle>{pet.title}</CardTitle>
              <CardDescription>Shared by {pet.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">"{pet.description}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="w-full max-w-2xl mx-auto shadow-lg" id="share-pet-video">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Share a Heartwarming Moment</CardTitle>
            <CardDescription>Upload a short video of a child and a pet sharing a special bond.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            { isSubmitted ? (
                 <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Video Shared!</h3>
                    <p className="text-muted-foreground mt-2">Thank you for sharing this beautiful moment of friendship. It's sure to warm many hearts!</p>
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
              <Label htmlFor="pet-title">Title</Label>
              <Input
                id="pet-title"
                placeholder="e.g., 'A Gentle Nuzzle'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading || !user}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="pet-description">Description</Label>
              <Textarea
                id="pet-description"
                placeholder="Briefly describe the moment!"
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
