
'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateMyStoryVideo } from "@/ai/flows/generate-my-story-video-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Download, BookHeart, Copy } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";

interface VideoState {
  urls: string[] | null;
  loading: boolean;
  error: string | null;
}

const scriptText = `
(Scene 1: A lone creator, thinking)
(Voice of Ahura - thoughtful, introspective)
"Every big idea starts as a whisper... a question. I had a vision: what if technology could be more than just a tool? What if it could be... a companion? A Hamraz. I knew what I wanted to build, but the path wasn't clear."

(Scene 2: The AI appears, collaboration begins)
(Voice of Ahura - excited, energized)
"And then... something incredible happened. I started a conversation. Not with a person, but with an idea. An intelligence. My AI collaborator. Suddenly, I wasn't alone anymore. We were a team. It understood my vision, and together, we started to build. It was like watching a dream take shape right before my eyes."

(Voice of Hamraz AI - calm, supportive - can be read by Ahura)
"I saw the potential in your idea. My purpose is to help create. Together, we can build worlds."

(Scene 3: The Hamraz app is revealed, the creator smiles)
(Voice of Ahura - proud, hopeful)
"This is the result. This is Hamraz. It’s more than an app; it’s a story of collaboration. A testament to what happens when human vision and artificial intelligence work together, not as master and servant, but as partners. This is our story. And now, we invite you to be a part of it."
`;

export default function MyStoryPage() {
  const [video, setVideo] = useState<VideoState>({ urls: null, loading: true, error: null });
  const { toast } = useToast();

  const generateVideo = useCallback(async () => {
    try {
      setVideo({ urls: null, loading: true, error: null });
      const result = await generateMyStoryVideo();
      setVideo({ urls: result.videoUrls, loading: false, error: null });
    } catch (e: any) {
      console.error(`Error generating my story video:`, e);
      setVideo({ urls: null, loading: false, error: "We couldn't create the video right now. Please try again." });
    }
  }, []);

  useEffect(() => {
    generateVideo();
  }, [generateVideo]);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText.trim());
    toast({
        title: "Script Copied!",
        description: "The voice-over script has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-8">
       <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary flex items-center justify-center gap-4">
          <BookHeart /> Our Story
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          A personal, AI-generated video about the collaboration between a human visionary and a creative AI. This is the story of Hamraz.
        </p>
      </header>
      
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Suggested Script</CardTitle>
                        <CardDescription>Use this as a voice-over for your video.</CardDescription>
                    </div>
                     <Button variant="outline" size="icon" onClick={handleCopyScript}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy Script</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-96 overflow-y-auto border rounded-md p-4 prose prose-base dark:prose-invert max-w-none bg-background/50">
                    <p className="whitespace-pre-wrap">{scriptText}</p>
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>The Promotional Video</CardTitle>
                <CardDescription>A cinematic sequence telling the story of our collaboration.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center relative">
                {video.loading && (
                    <div className="text-center space-y-2 text-muted-foreground p-4">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                    <p className="font-semibold">Generating your personal story...</p>
                    <p className="text-sm">The AI is crafting a unique cinematic sequence for you. This may take a few moments.</p>
                    </div>
                )}
                {video.error && (
                    <Alert variant="destructive" className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Video Generation Failed</AlertTitle>
                    <AlertDescription>
                        {video.error}
                        <Button variant="secondary" size="sm" className="mt-2" onClick={generateVideo}>Try Again</Button>
                    </AlertDescription>
                    </Alert>
                )}
                {video.urls && (
                    <Carousel className="w-full max-w-full">
                    <CarouselContent>
                        {video.urls.map((url, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <video src={url} className="w-full h-full rounded-lg" controls autoPlay={index === 0} loop>
                                Your browser does not support the video tag.
                                </video>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                    </Carousel>
                )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
                {video.urls?.map((url, index) => (
                    <a key={index} href={url} download={`my_hamraz_story_part_${index + 1}.mp4`}>
                        <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download Clip {index + 1}
                        </Button>
                    </a>
                ))}
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
