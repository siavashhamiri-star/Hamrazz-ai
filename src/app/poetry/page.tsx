
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
import { Loader2, PartyPopper, Upload, Feather } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const samplePoems = [
  {
    title: "The Rainbow",
    author: "Christina Rossetti",
    videoUrl: "https://videos.pexels.com/video-files/2099395/2099395-hd_1280_720_25fps.mp4",
    performer: "Aria, age 7"
  },
  {
    title: "Twinkle, Twinkle, Little Star",
    author: "Jane Taylor",
    videoUrl: "https://videos.pexels.com/video-files/3691359/3691359-hd_1280_720_25fps.mp4",
    performer: "Kian, age 5"
  },
  {
    title: "The Land of Nod",
    author: "Robert Louis Stevenson",
    videoUrl: "https://videos.pexels.com/video-files/853874/853874-hd_1280_720_25fps.mp4",
    performer: "Bahar, age 9"
  }
];

export default function PoetryPage() {
  const [poemTitle, setPoemTitle] = useState("");
  const [poetName, setPoetName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poemTitle.trim() || !videoFile) {
      toast({
        variant: "destructive",
        title: "Incomplete Submission",
        description: "Please provide the poem's title and upload a video.",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log("Poetry Submission:", {
      userId: user?.uid || "anonymous",
      poemTitle,
      poetName,
      videoFileName: videoFile?.name,
    });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Feather className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Welcome to the Poetry Corner!</AlertTitle>
        <AlertDescription>
          Share your child's talent! Record a video of them reading a poem and submit it here. Selected videos may be featured on our social media channels.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePoems.map((poem, index) => (
          <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
             <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <video src={poem.videoUrl} className="w-full h-full object-cover" controls />
             </div>
            <CardHeader>
              <CardTitle>{poem.title}</CardTitle>
              <CardDescription>Performed by {poem.performer}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">Original poem by {poem.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="w-full max-w-2xl mx-auto shadow-lg" id="share-poem">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Share a Poem</CardTitle>
            <CardDescription>Upload a video of your child's poetry reading.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            { isSubmitted ? (
                 <div className="text-center p-8">
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-headline mt-4">Video Shared!</h3>
                    <p className="text-muted-foreground mt-2">Thank you for sharing this wonderful performance. It will be reviewed and may be featured soon!</p>
                    <Button className="mt-6" onClick={() => {
                        setIsSubmitted(false);
                        setPoemTitle('');
                        setPoetName('');
                        setVideoFile(null);
                    }}>Share Another Poem</Button>
                </div>
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="poem-title">Poem Title</Label>
                  <Input
                    id="poem-title"
                    placeholder="e.g., 'The Tyger'"
                    value={poemTitle}
                    onChange={(e) => setPoemTitle(e.target.value)}
                    disabled={isLoading || !user}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poet-name">Poet's Name (Optional)</Label>
                  <Input
                    id="poet-name"
                    placeholder="e.g., 'William Blake'"
                    value={poetName}
                    onChange={(e) => setPoetName(e.target.value)}
                    disabled={isLoading || !user}
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
                    <><Upload className="mr-2 h-4 w-4" />Share Performance</>
                )}
                </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
