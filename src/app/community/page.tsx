"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Send, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";

type ChatMessage = {
  id?: string;
  uid: string;
  user: string;
  text: string;
  avatar: string;
  timestamp: any;
};

const communityUsers = [
  { name: "Aria", status: "Online", img: "https://picsum.photos/seed/user1/100/100" },
  { name: "Bahar", status: "Playing a game", img: "https://picsum.photos/seed/user2/100/100" },
  { name: "Kian", status: "Online", img: "https://picsum.photos/seed/user3/100/100" },
  { name: "Sara", status: "Away", img: "https://picsum.photos/seed/user4/100/100" },
  { name: "Parsa", status: "Online", img: "https://picsum.photos/seed/user5/100/100" },
];

export default function CommunityPage() {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const db = useFirestore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "community-chat"), orderBy("timestamp", "asc"), limit(50));
  }, [db]);

  const { data: messages, loading: messagesLoading } = useCollection<ChatMessage>(messagesQuery);
  
  const handleSend = async () => {
    if (!input.trim() || !user || !userProfile || !db) return;

    setIsSending(true);
    const avatarUrl = userProfile?.selectedAvatar?.imageUrl || user?.photoURL || 'https://picsum.photos/seed/you/100/100';
    const userName = userProfile?.displayName || "Anonymous";

    const newMessage: Omit<ChatMessage, 'id' | 'timestamp'> & { timestamp: any } = {
        uid: user.uid,
        user: userName,
        text: input.trim(),
        avatar: avatarUrl,
        timestamp: serverTimestamp(),
    };
    
    try {
        await addDoc(collection(db, "community-chat"), newMessage);
        setInput("");
    } catch (error) {
        console.error("Error sending message:", error);
    } finally {
        setIsSending(false);
    }
  };

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100);
    }
  }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full max-h-[calc(100vh-8rem)]">
      <Card className="lg:col-span-2 shadow-lg flex flex-col">
        <CardHeader>
          <CardTitle>Global Chat</CardTitle>
          <CardDescription>Chat with other members of the Hamraz community.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messagesLoading && (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              {messages && messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.uid === user?.uid ? 'justify-end' : ''}`}>
                  {msg.uid !== user?.uid && (
                    <Avatar>
                        <AvatarImage src={msg.avatar} alt={msg.user} />
                        <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className={`font-semibold text-sm ${msg.uid === user?.uid ? 'text-right' : ''}`}>{msg.user}</p>
                    <div className={`p-3 rounded-lg text-sm ${msg.uid === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {msg.text}
                    </div>
                  </div>
                   {msg.uid === user?.uid && (
                    <Avatar>
                        <AvatarImage src={msg.avatar} alt={msg.user} />
                        <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="relative w-full">
            <Input
              placeholder={user ? "Type a message..." : "Please sign in to chat."}
              className="pr-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
              disabled={!user || isSending}
            />
            <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleSend} disabled={!user || isSending || !input.trim()}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="lg:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle>Community Members</CardTitle>
          <CardDescription>{communityUsers.filter(u => u.status !== 'Away').length} members online.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-4">
              {communityUsers.map((user) => (
                <div key={user.name} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Avatar className="relative">
                    <AvatarImage src={user.img} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background ${
                      user.status === 'Online' ? 'bg-green-500' : user.status === 'Away' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.status}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">Chat</Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
