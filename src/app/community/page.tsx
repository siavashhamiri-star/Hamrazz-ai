"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Send } from "lucide-react";
import React, { useState } from "react";

const communityUsers = [
  { name: "Aria", status: "Online", img: "https://picsum.photos/seed/user1/100/100" },
  { name: "Bahar", status: "Playing a game", img: "https://picsum.photos/seed/user2/100/100" },
  { name: "Kian", status: "Online", img: "https://picsum.photos/seed/user3/100/100" },
  { name: "Sara", status: "Away", img: "https://picsum.photos/seed/user4/100/100" },
  { name: "Parsa", status: "Online", img: "https://picsum.photos/seed/user5/100/100" },
  { name: "Nazanin", status: "Playing a game", img: "https://picsum.photos/seed/user6/100/100" },
  { name: "Ramin", status: "Online", img: "https://picsum.photos/seed/user7/100/100" },
  { name: "Yasmin", status: "Away", img: "https://picsum.photos/seed/user8/100/100" },
];

type ChatMessage = {
  user: string;
  text: string;
  avatar: string;
};

export default function CommunityPage() {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { user: "Aria", text: "Hey everyone! Who's up for a game?", avatar: "https://picsum.photos/seed/user1/100/100" },
    { user: "Bahar", text: "I am! Which one?", avatar: "https://picsum.photos/seed/user2/100/100" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && userProfile) {
      const avatarUrl = userProfile?.selectedAvatar?.imageUrl || user?.photoURL ||'https://picsum.photos/seed/you/100/100';
      const userName = userProfile?.displayName || "You";
      setMessages([...messages, { user: userName, text: input, avatar: avatarUrl }]);
      setInput("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <Card className="lg:col-span-2 shadow-lg flex flex-col">
        <CardHeader>
          <CardTitle>Global Chat</CardTitle>
          <CardDescription>Chat with other members of the Hamraz community.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={msg.avatar} alt={msg.user} />
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{msg.user}</p>
                    <div className="bg-muted p-3 rounded-lg text-muted-foreground">{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="relative w-full">
            <Input
              placeholder="Type a message..."
              className="pr-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!user}
            />
            <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleSend} disabled={!user}>
              <Send className="h-4 w-4" />
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
