
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const VoiceScroll = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const handleVoiceCommand = useCallback((command: string) => {
    console.log("Voice command received:", command);
    const scrollAmount = window.innerHeight * 0.7;
    const lowerCaseCommand = command.toLowerCase();

    if (lowerCaseCommand.includes('down') || lowerCaseCommand.includes('پایین')) {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else if (lowerCaseCommand.includes('up') || lowerCaseCommand.includes('بالا')) {
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      setIsSupported(false);
      return;
    }
    
    setIsSupported(true);
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false; // Set to false for better control
    recognition.interimResults = false;
    recognition.lang = 'en-US, fa-IR'; // Support both languages

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.trim();
      handleVoiceCommand(command);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast({
          variant: 'destructive',
          title: 'Voice Control Error',
          description: `Could not process voice command. Error: ${event.error}`,
        });
        // Turn off listening on critical errors
        setIsListening(false);
      }
    };
    
    recognition.onend = () => {
      // If it's supposed to be listening, restart it.
      // This creates a continuous loop while isListening is true.
      if (isListening) {
        try {
          recognition.start();
        } catch(e) {
          console.error("Could not restart recognition:", e);
          setIsListening(false);
        }
      }
    };

    // Cleanup function
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [handleVoiceCommand, toast, isListening]); // Add isListening to dependencies
  
  const toggleListening = useCallback(() => {
    if (!isSupported) {
      toast({
        variant: 'destructive',
        title: 'Voice Control Not Supported',
        description: 'Your browser does not support the Web Speech API.',
      });
      return;
    }
    
    setIsListening(prev => {
        const nextIsListening = !prev;
        if (nextIsListening) {
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Could not start recognition on toggle:", e);
            }
        } else {
            recognitionRef.current?.stop();
        }
        return nextIsListening;
    });
  }, [isSupported, toast]);


  if (!isSupported) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        onClick={toggleListening}
        className={cn(
          'rounded-full h-14 w-14 shadow-lg transition-colors',
          isListening ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
        )}
      >
        {isListening ? (
          <Mic className="h-6 w-6 animate-pulse" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default VoiceScroll;
