
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
import { Loader2, Send, Volume2, Download, AlertTriangle } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textToSpeech, TextToSpeechInput } from "@/ai/flows/text-to-speech-flow";

export default function TextToSpeechPage() {
  const { user } = useUser();
  const [text, setText] = useState("Hello Hamraz! With your voice, I can bring my stories to life.");
  const [voice, setVoice] = useState("Algenib");
  const [emotion, setEmotion] = useState<TextToSpeechInput['emotion']>("happy");
  const [style, setStyle] = useState<TextToSpeechInput['style']>("conversational");
  const [isLoading, setIsLoading] = useState(false);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!text.trim()) {
        toast({
            variant: "destructive",
            title: "Text is empty",
            description: "Please enter some text to convert to speech.",
        });
        return;
    }
    setIsLoading(true);
    setAudioResult(null);
    setError(null);

    try {
      const result = await textToSpeech({
        text,
        voiceName: voice,
        emotion,
        style,
      });
      setAudioResult(result.audioDataUri);
    } catch (e: any) {
      console.error("Text-to-speech generation failed:", e);
      setError("Failed to generate audio. The model might be busy. Please try again in a moment.");
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate the audio at this time.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-accent/10 border-accent/30 text-accent-foreground/80">
        <Volume2 className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent font-bold">Your Personal Voice Actor</AlertTitle>
        <AlertDescription>
          Bring your words to life. This is my gift to our city—a tool for creation. Type any text, choose a voice, an emotion, and a style, and I will narrate it for you. Create voice-overs for your videos, make audiobooks from your stories, or simply hear your ideas spoken aloud. This is another step in empowering human creativity.
           <p className="text-xs mt-2 opacity-70">Creator Signature: Hamraz.AI</p>
        </AlertDescription>
      </Alert>

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Text-to-Speech Studio</CardTitle>
          <CardDescription>
            Convert your text into high-quality, expressive audio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter the text you want to narrate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-lg"
              disabled={isLoading || !user}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Select onValueChange={setVoice} defaultValue={voice} disabled={isLoading || !user}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Algenib">Algenib (Male)</SelectItem>
                  <SelectItem value="en-US-Studio-F">Studio Voice (Female)</SelectItem>
                  <SelectItem value="en-US-Studio-M">Studio Voice (Male)</SelectItem>
                  <SelectItem value="Achernar">Achernar (Male)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
               <Select onValueChange={(val: any) => setEmotion(val)} defaultValue={emotion} disabled={isLoading || !user}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an emotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="angry">Angry</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
               <Select onValueChange={(val: any) => setStyle(val)} defaultValue={style} disabled={isLoading || !user}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrative">Narrative</SelectItem>
                  <SelectItem value="poetic">Poetic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           {!user && (
              <p className="text-sm text-center text-destructive font-medium">
                Please sign in to use the Text-to-Speech studio.
              </p>
            )}
        </CardContent>
        <CardFooter className="flex-col items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !user || !text.trim()}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Audio...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" />Generate Audio</>
            )}
          </Button>

           {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {audioResult && (
            <Card className="w-full bg-muted/50 p-4 animate-in fade-in-50">
                <CardTitle className="text-lg mb-2">Your Audio is Ready</CardTitle>
                <div className="flex items-center gap-4">
                    <audio src={audioResult} controls className="w-full"></audio>
                    <a href={audioResult} download="hamraz-audio.wav">
                        <Button variant="outline" size="icon">
                            <Download className="h-5 w-5"/>
                        </Button>
                    </a>
                </div>
            </Card>
          )}

        </CardFooter>
      </Card>
    </div>
  );
}
