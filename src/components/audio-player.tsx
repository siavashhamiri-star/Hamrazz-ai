
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause } from 'lucide-react';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  textToPlay: string;
  voice?: string;
}

export default function AudioPlayer({ textToPlay, voice }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await textToSpeech({ text: textToPlay, voiceName: voice });
      setAudioUrl(result.audioDataUri);
      
      const audio = new Audio(result.audioDataUri);
      audioRef.current = audio;
      
      audio.play();
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
      };

    } catch (error) {
      console.error('Error generating or playing audio:', error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'Could not generate or play the audio at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
        <Button variant="outline" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={handlePlay}>
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
       <span className="sr-only">Listen</span>
    </Button>
  );
}
