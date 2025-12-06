
"use client";

import { useState, useEffect, useRef } from "react";
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
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Send, Loader2, Users, Mic, Sofa, LogOut, Ghost, MessageSquare, Mail, UserPlus, Eye, PlusCircle, ImageIcon, Paperclip, Smile } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";


const NUM_SEATS = 6;

type Seat = {
  user: {
    uid: string;
    name: string;
    avatar: string;
  } | null;
};

type Message = {
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  isPrivate?: boolean;
};

type Spectator = {
    uid: string;
    name: string;
    avatar: string;
}

const PrivateMessageDialog = ({ targetUser, currentUser }: { targetUser: Seat['user'], currentUser: Seat['user'] }) => {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    
    if (!targetUser || !currentUser) return null;

    const handleSend = () => {
        if (!message.trim()) return;
        setIsSending(true);
        console.log(`(Private message simulation) From ${currentUser.name} to ${targetUser.name}: ${message}`);
        setTimeout(() => {
            setIsSending(false);
            setMessage("");
            // In a real app, you'd close the dialog, but here we just clear the message
        }, 1000);
    }

    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Private Message to {targetUser.name}</DialogTitle>
                <DialogDescription>
                    This message will only be visible to you and {targetUser.name}.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <Textarea 
                    placeholder={`Your private message...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                />
            </div>
            <DialogFooter>
                <Button onClick={handleSend} disabled={isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                    Send Privately
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default function PanelPage() {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const [seats, setSeats] = useState<Seat[]>(Array(NUM_SEATS).fill({ user: null }));
  const [spectators, setSpectators] = useState<Spectator[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [userState, setUserState] = useState<'unjoined' | 'panelist' | 'spectator'>('unjoined');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentUser = userProfile ? { 
    uid: userProfile.uid,
    name: userProfile.displayName || "Anonymous", 
    avatar: userProfile.selectedAvatar?.imageUrl || userProfile.photoURL || "" 
  } : null;

  const isUserOnPanel = seats.some(seat => seat.user?.uid === user?.uid);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100);
    }
  }, [messages]);

  const handleJoinPanel = () => {
    if (!currentUser || isUserOnPanel) return;
    const emptySeatIndex = seats.findIndex(seat => !seat.user);
    if (emptySeatIndex !== -1) {
      const newSeats = [...seats];
      newSeats[emptySeatIndex] = { user: currentUser };
      setSeats(newSeats);
      setUserState('panelist');
      addMessage(`${currentUser.name} joined the panel.`);
    }
  };
  
  const handleJoinAsSpectator = () => {
      if (!currentUser || userState !== 'unjoined') return;
      setSpectators(prev => [...prev, currentUser]);
      setUserState('spectator');
      addMessage(`${currentUser.name} is now watching.`);
  }

  const handleLeave = () => {
    if (!currentUser) return;
    
    if(userState === 'panelist') {
        const userSeatIndex = seats.findIndex(seat => seat.user?.uid === currentUser.uid);
        if (userSeatIndex !== -1) {
            const newSeats = [...seats];
            newSeats[userSeatIndex] = { user: null };
            setSeats(newSeats);
            addMessage(`${currentUser.name} left the panel.`);
        }
    } else if (userState === 'spectator') {
        setSpectators(prev => prev.filter(spec => spec.uid !== currentUser.uid));
        addMessage(`${currentUser.name} stopped watching.`);
    }

    setUserState('unjoined');
  };

  const addMessage = (text: string, isSystem = true) => {
       const newMessage: Message = {
        user: { name: isSystem ? "System" : currentUser!.name, avatar: "" },
        text,
      };
      setMessages(prev => [...prev, newMessage]);
  }

  const handleFileUpload = (type: string) => {
    toast({
        title: `Simulating ${type} Upload`,
        description: `In a real app, a file picker would open to upload a ${type}.`
    });
  }

  const handleStickerSend = () => {
    toast({
        title: `Simulating Sticker Send`,
        description: `In a real app, a sticker panel would open.`
    });
  }

  const handleSendMessage = () => {
    if (!input.trim() || !currentUser || (userState !== 'panelist')) return;

    setIsSending(true);
    const newMessage: Message = {
      user: { name: currentUser.name, avatar: currentUser.avatar },
      text: input.trim(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsSending(false);
  };

  const memberCheck = !user; // For now, just check if user is signed in

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Mic className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Welcome to the Conversation Panel!</AlertTitle>
        <AlertDescription>
          Take a seat to join the text-based conversation. To participate, you must be a member of one of the creator's apps (Hamraz, Afarinan, etc.). Spectators can watch the conversation without participating.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>The Panel</span>
                        {user && userState !== 'unjoined' && <Button variant="ghost" size="sm" onClick={handleLeave}><LogOut className="mr-2 h-4 w-4"/> Leave</Button>}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {seats.map((seat, index) => (
                        <Dialog key={index}>
                            <Card className={cn("text-center p-4 transition-all", 
                                seat.user ? "bg-card" : "bg-muted/50 border-dashed",
                                seat.user?.uid === user?.uid && "border-primary border-2"
                            )}>
                                <Avatar className="w-16 h-16 mx-auto border-2">
                                    {seat.user && <AvatarImage src={seat.user.avatar} alt={seat.user.name} />}
                                    <AvatarFallback>{seat.user ? seat.user.name.charAt(0) : <Sofa />}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold mt-2 truncate">{seat.user?.name || "Empty Seat"}</p>
                                {seat.user && seat.user.uid !== user?.uid && (
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="mt-2 text-xs"><Mail className="mr-1 h-3 w-3"/> Private</Button>
                                    </DialogTrigger>
                                )}
                            </Card>
                            {seat.user && seat.user.uid !== user?.uid && <PrivateMessageDialog targetUser={seat.user} currentUser={currentUser} />}
                        </Dialog>
                    ))}
                </CardContent>
                {userState === 'unjoined' && (
                    <CardFooter className="justify-center gap-4">
                        <Button onClick={handleJoinPanel} disabled={memberCheck || isUserOnPanel}><UserPlus className="mr-2"/> Join Panel</Button>
                        <Button onClick={handleJoinAsSpectator} variant="outline" disabled={memberCheck}><Eye className="mr-2"/> Watch as Spectator</Button>
                    </CardFooter>
                )}
            </Card>

            <div className="mt-4">
                 <h3 className="font-headline text-lg mb-2">Spectators ({spectators.length})</h3>
                 <div className="flex flex-wrap gap-2">
                    {spectators.map(spec => (
                        <div key={spec.uid} className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                           <Avatar className="w-6 h-6">
                             <AvatarImage src={spec.avatar} alt={spec.name} />
                             <AvatarFallback><Ghost className="w-4 h-4"/></AvatarFallback>
                           </Avatar>
                           <span className="text-sm font-medium">{spec.name}</span>
                        </div>
                    ))}
                    {spectators.length === 0 && <p className="text-sm text-muted-foreground">No one is watching right now.</p>}
                 </div>
            </div>
        </div>

        <Card className="shadow-lg flex flex-col h-[calc(100vh-14rem)] lg:col-span-1">
          <CardHeader className="border-b">
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start gap-2">
                     <Avatar className="w-8 h-8 border">
                        <AvatarImage src={msg.user.avatar} />
                        <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{msg.user.name}</p>
                        <div className="p-2 rounded-lg text-sm bg-muted">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <div className="flex w-full items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={userState !== 'panelist'}>
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleFileUpload('image')}><ImageIcon className="mr-2 h-4 w-4"/>Image</Button>
                            <Button variant="outline" size="sm" onClick={() => handleFileUpload('file')}><Paperclip className="mr-2 h-4 w-4"/>File</Button>
                            <Button variant="outline" size="sm" onClick={() => handleFileUpload('voice message')}><Mic className="mr-2 h-4 w-4"/>Voice</Button>
                            <Button variant="outline" size="sm" onClick={handleStickerSend}><Smile className="mr-2 h-4 w-4"/>Sticker</Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="relative w-full">
                <Input
                    placeholder={userState === 'panelist' ? "Type a message..." : "Join the panel to chat"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isSending || userState !== 'panelist'}
                />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleSendMessage} disabled={isSending || userState !== 'panelist'}>
                    <Send className="h-4 w-4" />
                </Button>
                </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
