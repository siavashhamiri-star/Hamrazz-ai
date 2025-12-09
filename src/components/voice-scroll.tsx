
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
  const isListeningRef = useRef(isListening); // Ref to hold the latest state

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

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
    // Set language to be more inclusive if needed, though most browsers handle this well
    // recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const command = event.results[i][0].transcript.trim().toLowerCase();
          handleVoiceCommand(command);
        }
      }
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
      // Use the ref here to get the most up-to-date state
      if (isListeningRef.current) {
        console.log("Recognition ended unexpectedly, restarting...");
        try {
          recognition.start();
        } catch(e) {
          console.error("Failed to restart recognition:", e);
        }
      } else {
        console.log("Recognition ended by user.");
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast, handleVoiceCommand]);
  
  const toggleListening = useCallback(() => {
    if (!isSupported) {
      toast({
        variant: 'destructive',
        title: 'Voice Control Not Supported',
        description: 'Your browser does not support the Web Speech API.',
      });
      return;
    }

    setIsListening(prevState => {
      const shouldBeListening = !prevState;
      if (shouldBeListening) {
        try {
          recognitionRef.current?.start();
        } catch(e) {
           console.error("Could not start recognition:", e);
           if (e instanceof Error && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
              toast({
                variant: 'destructive',
                title: 'Microphone Access Denied',
                description: 'Please allow microphone access to use voice commands.',
              });
           }
           return false; // Don't update state if it fails to start
        }
      } else {
        recognitionRef.current?.stop();
      }
      return shouldBeListening;
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
