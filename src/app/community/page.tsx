
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Send, Loader2, Globe, Languages, PlusCircle, Users, Trophy } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type ChatMessage = {
  id?: string;
  uid: string;
  user: string;
  text: string;
  avatar: string;
  timestamp: any;
};

type ChatRoom = {
    id: string;
    name: string;
    topic: string;
    owner: string;
};

const communityUsers = [
  { name: "Aria", status: "Online", img: "https://picsum.photos/seed/user1/100/100" },
  { name: "Bahar", status: "Playing a game", img: "https://picsum.photos/seed/user2/100/100" },
  { name: "Kian", status: "Online", img: "https://picsum.photos/seed/user3/100/100" },
  { name: "Sara", status: "Away", img: "https://picsum.photos/seed/user4/100/100" },
  { name: "Parsa", status: "Online", img: "https://picsum.photos/seed/user5/100/100" },
  { name: "Juan", status: "Online", img: "https://picsum.photos/seed/user6/100/100" },
  { name: "Fatima", status: "Away", img: "https://picsum.photos/seed/user7/100/100" },
];

const ChatChannel = ({ channel, title }: { channel: string, title: string }) => {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const db = useFirestore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const collectionName = `community-chat-${channel}`;

  const messagesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, collectionName), orderBy("timestamp", "asc"), limit(50));
  }, [db, collectionName]);

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
        await addDoc(collection(db, collectionName), newMessage);
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
    <Card className="shadow-lg flex flex-col h-[calc(100vh-14rem)]">
         <CardHeader className="border-b">
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messagesLoading && (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              {messages && messages.length > 0 ? messages.map((msg) => (
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
              )) : (
                <div className="flex justify-center items-center h-full text-center text-muted-foreground p-8">
                    <div>
                        <Languages className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold">Be the first to start a conversation!</p>
                        <p className="text-sm">This channel is new. Say hello to the community.</p>
                    </div>
                </div>
              )}
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
  )
}

const CreateRoomDialog = ({ onRoomCreated }: { onRoomCreated: (room: ChatRoom) => void }) => {
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useUser();

    const handleCreate = () => {
        if (name.trim() && topic.trim() && user?.displayName) {
            const newRoom: ChatRoom = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name,
                topic,
                owner: user.displayName,
            };
            onRoomCreated(newRoom);
            setName("");
            setTopic("");
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Create Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Chat Room</DialogTitle>
                    <DialogDescription>
                        As a community leader, you can create your own chat room. This will help you build your team and earn points for the Premier League.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="room-name">Room Name</Label>
                        <Input id="room-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Creative Writers' Corner" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="room-topic">Topic</Label>
                        <Input id="room-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Discussing new story ideas" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function CommunityPage() {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
        { id: "game-devs", name: "Game Developers", topic: "Discussing the next big game", owner: "TechLead" },
        { id: "artists-hub", name: "Artists' Hub", topic: "Sharing digital art and techniques", owner: "Artisan" },
    ]);
    const [activeTab, setActiveTab] = useState("global");

    const handleRoomCreated = (room: ChatRoom) => {
        setChatRooms(prev => [...prev, room]);
        setActiveTab(room.id);
    }

  return (
    <div className="space-y-6">
        <Alert variant="default" className="bg-accent/10 border-accent/30">
            <Trophy className="h-4 w-4 text-accent" />
            <AlertTitle className="text-accent font-bold">Lead and Earn!</AlertTitle>
            <AlertDescription>
                Creating and actively managing chat rooms will earn you points towards the App Premier League. Build your community, foster great conversations, and climb the leaderboard!
            </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-wrap items-center gap-2">
                <TabsList>
                    <TabsTrigger value="global"><Globe className="mr-2"/>Global</TabsTrigger>
                    <TabsTrigger value="es">Español</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>
                 <div className="h-6 border-l border-border mx-2"></div>
                <TabsList>
                    {chatRooms.map(room => (
                         <TabsTrigger key={room.id} value={room.id}><Users className="mr-2 h-4 w-4"/>{room.name}</TabsTrigger>
                    ))}
                </TabsList>
                 <CreateRoomDialog onRoomCreated={handleRoomCreated} />
            </div>

            <TabsContent value="global" className="mt-4">
                <ChatChannel channel="global" title="Global Chat" />
            </TabsContent>
            <TabsContent value="es" className="mt-4">
                <ChatChannel channel="es" title="Chat en Español" />
            </TabsContent>
            <TabsContent value="ar" className="mt-4">
                <ChatChannel channel="ar" title="الدردشة العربية" />
            </TabsContent>
            {chatRooms.map(room => (
                 <TabsContent key={room.id} value={room.id} className="mt-4">
                    <ChatChannel channel={room.id} title={room.name} />
                </TabsContent>
            ))}
         </Tabs>
    </div>
  );
}
