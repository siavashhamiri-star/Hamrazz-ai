
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
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
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      handleVoiceCommand(command);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please allow microphone access to use voice commands.',
        });
        setIsListening(false);
      }
    };
    
    recognition.onend = () => {
      if (isListening) {
        // If it stops unexpectedly while it should be listening, restart it.
        // This handles cases where the browser might time it out.
        console.log("Recognition ended, restarting...");
        recognition.start();
      }
    };
    
    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast, handleVoiceCommand, isListening]);
  
  const toggleListening = useCallback(() => {
    if (!isSupported) {
      toast({
        variant: 'destructive',
        title: 'Voice Control Not Supported',
        description: 'Your browser does not support the Web Speech API.',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
       try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch(e) {
         console.error("Could not start recognition:", e);
         if (e instanceof Error && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
            toast({
              variant: 'destructive',
              title: 'Microphone Access Denied',
              description: 'Please allow microphone access to use voice commands.',
            });
         }
         setIsListening(false);
      }
    }
  }, [isListening, isSupported, toast]);


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
          <MicOff className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default VoiceScroll;
