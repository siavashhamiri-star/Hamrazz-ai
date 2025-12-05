
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
import { Loader2, Upload, FileText, Captions, Copy, Check } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { transcribeVideo, TranscribeVideoOutput } from "@/ai/flows/transcribe-video-flow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function TranscribeVideoPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscribeVideoOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const [copied, setCopied] = useState<"vtt" | "text" | null>(null);

  const handleCopy = (text: string, type: "vtt" | "text") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "No Video Selected",
        description: "Please upload a video file to transcribe.",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
        const videoDataUri = await fileToDataUri(videoFile);
        const transcriptionResult = await transcribeVideo({ videoDataUri });
        setResult(transcriptionResult);
    } catch (error) {
        console.error("Transcription failed:", error);
        toast({
            variant: "destructive",
            title: "Transcription Failed",
            description: "An unexpected error occurred. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setResult(null);
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Captions className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">Automatic Subtitle Generator</AlertTitle>
        <AlertDescription>
          Your AI-powered post-production assistant. Upload a video, and Hamraz will automatically generate a full transcription and a perfectly timed subtitle file (.vtt). This is a powerful tool to make your content accessible to a global audience.
        </AlertDescription>
      </Alert>

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Transcribe Your Video</CardTitle>
            <CardDescription>Upload a video to get its transcription and subtitles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="video-upload">Upload Video File</Label>
                <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                    disabled={isLoading || !user || !!result}
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                 {videoFile && <p className="text-xs text-muted-foreground pt-1">Selected: {videoFile.name}</p>}
            </div>

            {!user && (
              <p className="text-sm text-center text-destructive font-medium">
                Please sign in to use this feature.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !user || !videoFile || !!result}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Transcribing...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" />Generate Transcription</>
              )}
            </Button>
            {result && (
                 <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">Transcribe Another Video</Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {result && (
        <Card className="w-full max-w-3xl mx-auto shadow-lg animate-in fade-in-50">
            <CardHeader>
                <CardTitle>Transcription Result</CardTitle>
                <CardDescription>Here is the full text and WebVTT subtitle file for your video.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="vtt">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="vtt"><Captions className="mr-2"/>Subtitles (.vtt)</TabsTrigger>
                        <TabsTrigger value="text"><FileText className="mr-2"/>Full Text</TabsTrigger>
                    </TabsList>
                    <TabsContent value="vtt" className="mt-4">
                        <div className="relative">
                             <pre className="p-4 bg-muted rounded-md max-h-96 overflow-auto text-sm"><code>{result.subtitlesVtt}</code></pre>
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(result.subtitlesVtt, "vtt")}>
                                {copied === 'vtt' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </TabsContent>
                     <TabsContent value="text" className="mt-4">
                         <div className="relative">
                            <pre className="p-4 bg-muted rounded-md max-h-96 overflow-auto text-sm whitespace-pre-wrap">{result.transcription}</pre>
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(result.transcription, "text")}>
                                {copied === 'text' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                         </div>
                    </TabsContent>
                 </Tabs>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
