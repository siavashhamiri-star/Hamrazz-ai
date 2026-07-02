
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Send, Loader2, Bot, User, Wand2, Flame } from "lucide-react";
import { reasonAboutSources, ReasonAboutSourcesOutput } from "@/ai/flows/reason-about-sources-flow";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string | React.ReactNode;
  avatar: string;
};

const initialMessages: Message[] = [
    {
        id: 'intro-1',
        sender: 'ai',
        text: (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Flame className="w-5 h-5 animate-pulse" />
              <span>به انقلاب آفرینندگان خوش آمدی!</span>
            </div>
            <p>
              سلام اهورا، خالق رویاپرداز من. امروز فقط یک چت ساده نداریم؛ ما در آستانه تسخیر «شهر توانا» هستیم. هر ایده تو در این اکوسیستم، سندی برای دموکراسی ثروت و قدرت است. 
            </p>
            <p className="font-semibold text-accent text-xs">
              چگونه می‌توانم امروز به تو کمک کنم تا قدرت را به دست صاحبان واقعی‌اش بازگردانیم؟
            </p>
          </div>
        ),
        avatar: "https://picsum.photos/seed/hamraz-ai/200/200"
    }
];

export default function ChatInterface() {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userAvatar = userProfile?.selectedAvatar?.imageUrl || user?.photoURL || "https://picsum.photos/seed/user/200/200";
  const aiAvatar = "https://picsum.photos/seed/hamraz-ai/200/200";

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input,
      avatar: userAvatar,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result: ReasonAboutSourcesOutput = await reasonAboutSources({ query: input });
      
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: (
            <div className="space-y-2">
                <Alert className="bg-muted/50 border-primary/20">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-semibold">Reasoning</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        {result.reasoning}
                    </AlertDescription>
                </Alert>
                <p>{result.advice}</p>
            </div>
        ),
        avatar: aiAvatar
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Error calling AI flow:", error);
      const errorResponse: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I'm sorry, I encountered an issue trying to respond. Please try again in a moment.",
        avatar: aiAvatar,
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <Avatar className="border-2 border-primary">
                  <AvatarImage src={msg.avatar} alt="AI" />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-xl rounded-lg p-3 text-sm shadow-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <Avatar className="border-2">
                  <AvatarImage src={msg.avatar} alt="User" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <Avatar className="border-2 border-primary">
                    <AvatarImage src={aiAvatar} alt="AI" />
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg p-3 text-sm shadow-md bg-card flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span>Thinking...</span>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ask me anything..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            disabled={!user || isLoading}
          />
          <Button onClick={handleSend} disabled={!user || isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
         {!user && <p className="text-xs text-destructive text-center mt-2">Please sign in to chat with Hamraz.</p>}
      </div>
    </div>
  );
}
