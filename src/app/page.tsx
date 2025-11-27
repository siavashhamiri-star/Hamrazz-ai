
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { reasonAboutSources } from "@/ai/flows/reason-about-sources-flow";
import { generateAvatarExpressions } from "@/ai/flows/generate-avatar-expressions-flow";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";

type Message = {
  sender: "user" | "ai";
  text: string;
  reasoning?: string;
};

export default function ChatPage() {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState({
    facialExpression: "neutral",
    emotion: "neutral",
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentAvatar = userProfile?.selectedAvatar;

  const handleSend = async () => {
    if (input.trim() === "" || !user) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const [aiResponse, expressionResponse] = await Promise.all([
        reasonAboutSources({ query: input }),
        generateAvatarExpressions({ message: input, currentEmotion: avatarExpression.emotion }),
      ]);
      
      const aiMessage: Message = {
        sender: "ai",
        text: aiResponse.advice,
        reasoning: aiResponse.reasoning,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setAvatarExpression({
        facialExpression: expressionResponse.facialExpression,
        emotion: expressionResponse.emotion,
      });

    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage: Message = {
        sender: "ai",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
}, [messages]);


  return (
    <div className="grid h-full max-h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card/50 border-2 border-primary/20 shadow-lg">
        <div className="relative">
          <Avatar className="w-48 h-48 md:w-64 md:h-64 border-4 border-primary/30 shadow-2xl">
            <AvatarImage src={currentAvatar?.imageUrl} alt="AI Avatar" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            </div>
          )}
           <div className={`absolute inset-0 rounded-full animate-pulse-slow ${
             isLoading ? 'shadow-[0_0_40px_10px] shadow-accent/80' : 'shadow-[0_0_30px_5px] shadow-primary/50'
           } transition-shadow duration-500`}></div>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold font-headline text-foreground">Hamraz</h2>
          <p className="text-muted-foreground capitalize">{avatarExpression.emotion} - {avatarExpression.facialExpression}</p>
        </div>
      </Card>
      <div className="md:col-span-2 flex flex-col h-full">
        <Card className="flex-1 flex flex-col shadow-lg">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.length === 0 && (
                  <div className="flex justify-center items-center h-full text-center text-muted-foreground">
                    {user ? (
                      <div className="prose dark:prose-invert">
                        <p className="text-lg font-semibold text-foreground">
                          شما به خانواده همراز ملحق شدید، جایی که با همت و تلاش شما تبدیل به بزرگترین خانواده مجازی جهان خواهد شد. اگر به این رویا و هدف ایمان داشته باشید، به مرور متوجه می‌شوید که در هر قدم از موفقیت‌های این خانواده، هر آنچه خوب، مفید و سودآور است، به خاطر حضور شماست و برای همه اعضای خانواده همراز، برای همه ماست. دارایی همراز، همراهی اعضای خانواده آن است و ثروت، خود تو هستی. همراز با من و تو، "مایی" به گستره گیتی خواهد شد.
                        </p>
                        <p className="mt-4 text-sm">
                          You have joined the Hamraz family, a place that, with your effort and endeavor, will become the largest virtual family in the world. If you believe in this dream, you'll see that in every success, everything good and profitable is because of you and for all of us. Hamraz's asset is its family, and its wealth is you. With you and I, Hamraz becomes a "We" that spans the globe.
                        </p>
                      </div>
                    ) : (
                      <p>Please sign in to chat with Hamraz.</p>
                    )}
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <Avatar className="w-8 h-8 border-2 border-primary/50">
                        <AvatarImage src={currentAvatar?.imageUrl} />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm md:text-base shadow-md ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                       {msg.reasoning && (
                          <details className="mt-2 text-xs opacity-70 cursor-pointer">
                              <summary className="font-semibold">Reasoning</summary>
                              <p className="mt-1 italic">{msg.reasoning}</p>
                          </details>
                        )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3 justify-start">
                     <Avatar className="w-8 h-8 border-2 border-primary/50">
                        <AvatarImage src={currentAvatar?.imageUrl} />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-card border rounded-xl px-4 py-3 text-sm md:text-base shadow-md">
                        <div className="flex items-center space-x-2">
                           <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                        </div>
                      </div>
                   </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background/80">
              <div className="relative">
                <Textarea
                  placeholder={user ? "Ask Hamraz anything..." : "Please sign in to start a conversation."}
                  className="pr-16 text-base resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading || !user}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full w-10 h-10"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !user}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
