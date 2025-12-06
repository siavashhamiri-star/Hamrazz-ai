
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
import { Send, Loader2, Users, Mic, Sofa, LogOut, Ghost, Mail, UserPlus, Eye, PlusCircle, ImageIcon, Paperclip, Smile, Gamepad2, Twitch, Youtube, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

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
  type?: 'system' | 'creator_warn' | 'creator_thanks';
};

type Spectator = {
    uid: string;
    name: string;
    avatar: string;
}

type GamingRoom = {
    id: string;
    name: string;
    game: string;
    owner: string;
    twitchUrl?: string;
    youtubeUrl?: string;
    seats: Seat[];
    spectators: Spectator[];
    messages: Message[];
}

const CreateGamingRoomDialog = ({ onRoomCreated }: { onRoomCreated: (room: GamingRoom) => void }) => {
    const [name, setName] = useState("");
    const [game, setGame] = useState("");
    const [twitch, setTwitch] = useState("");
    const [youtube, setYoutube] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useUser();
    const { userProfile } = useUserProfile(user?.uid);

    const handleCreate = () => {
        if (name.trim() && game.trim() && userProfile) {
            const newRoom: GamingRoom = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name,
                game,
                owner: userProfile.displayName || "Unknown",
                twitchUrl: twitch,
                youtubeUrl: youtube,
                seats: Array(NUM_SEATS).fill({ user: null }),
                spectators: [],
                messages: [],
            };
            onRoomCreated(newRoom);
            setName("");
            setGame("");
            setTwitch("");
            setYoutube("");
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Create Gaming Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Gaming Room</DialogTitle>
                    <DialogDescription>
                        Set up a space for your gaming community. Discuss strategies, watch streams, and host panels.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="room-name">Room Name</Label>
                        <Input id="room-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Apex Legends Pros" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="game-name">Game</Label>
                        <Input id="game-name" value={game} onChange={(e) => setGame(e.target.value)} placeholder="e.g., Apex Legends" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="twitch-url">Twitch Stream URL (Optional)</Label>
                        <Input id="twitch-url" value={twitch} onChange={(e) => setTwitch(e.target.value)} placeholder="https://twitch.tv/yourchannel" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="youtube-url">YouTube Stream URL (Optional)</Label>
                        <Input id="youtube-url" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/yourchannel/live" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const Room = ({ room, updateRoom }: { room: GamingRoom, updateRoom: (updatedRoom: GamingRoom) => void }) => {
    const { user } = useUser();
    const { userProfile } = useUserProfile(user?.uid);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [userState, setUserState] = useState<'unjoined' | 'panelist' | 'spectator' | 'ghost'>('unjoined');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const currentUser = userProfile ? { 
        uid: userProfile.uid,
        name: userProfile.displayName || "Anonymous", 
        avatar: userProfile.selectedAvatar?.imageUrl || userProfile.photoURL || "" 
    } : null;

    const isCreator = user?.uid === 'owner-the-creator';

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            setTimeout(() => {
                viewport.scrollTop = viewport.scrollHeight;
            }, 100);
        }
    }, [room.messages]);
    
    const addMessage = (text: string, fromUser?: { name: string, avatar: string }, type: Message['type'] = 'system') => {
        const newMessage: Message = {
            user: fromUser || { name: "System", avatar: "" },
            text,
            type,
        };
        updateRoom({ ...room, messages: [...room.messages, newMessage] });
    };

    const handleJoinPanel = () => {
        if (!currentUser) return;
        const emptySeatIndex = room.seats.findIndex(seat => !seat.user);
        if (emptySeatIndex !== -1) {
            const newSeats = [...room.seats];
            newSeats[emptySeatIndex] = { user: currentUser };
            updateRoom({ ...room, seats: newSeats });
            setUserState('panelist');
            addMessage(`${currentUser.name} joined the panel.`);
        }
    };

    const handleJoinAsSpectator = () => {
      if (!currentUser) return;
      if (isCreator) {
        setUserState('ghost');
        addMessage(`The Creator has entered the room in ghost mode.`, undefined, 'system');
      } else {
        updateRoom({ ...room, spectators: [...room.spectators, currentUser] });
        setUserState('spectator');
        addMessage(`${currentUser.name} is now watching.`);
      }
    };

    const handleLeave = () => {
        if (!currentUser) return;
        let updatedRoom = { ...room };
        if(userState === 'panelist') {
            const userSeatIndex = room.seats.findIndex(seat => seat.user?.uid === currentUser.uid);
            if (userSeatIndex !== -1) {
                const newSeats = [...room.seats];
                newSeats[userSeatIndex] = { user: null };
                updatedRoom.seats = newSeats;
                addMessage(`${currentUser.name} left the panel.`);
            }
        } else if (userState === 'spectator') {
            updatedRoom.spectators = room.spectators.filter(spec => spec.uid !== currentUser.uid);
            addMessage(`${currentUser.name} stopped watching.`);
        } else if (userState === 'ghost') {
             addMessage(`The Creator has left the room.`, undefined, 'system');
        }
        updateRoom(updatedRoom);
        setUserState('unjoined');
    };

    const handleSendMessage = () => {
        if (!input.trim() || !currentUser || userState !== 'panelist') return;
        addMessage(input.trim(), currentUser, undefined);
        setInput("");
    };

    const handleCreatorMessage = (type: 'creator_warn' | 'creator_thanks') => {
        const text = type === 'creator_warn' 
            ? "A friendly reminder from the Creator: Please maintain a respectful and positive atmosphere. Let's build a great community together."
            : "A message from the Creator: Thank you all for your positive contributions and for making this community special!";
        addMessage(text, { name: "Creator", avatar: ""}, type);
    }

    const getMessageStyle = (type?: Message['type']) => {
        switch(type) {
            case 'creator_warn': return 'bg-destructive/10 border-destructive text-destructive-foreground';
            case 'creator_thanks': return 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-300';
            default: return 'bg-muted';
        }
    }


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                         <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2"><Sofa/> The Panel</CardTitle>
                                {user && userState !== 'unjoined' && <Button variant="ghost" size="sm" onClick={handleLeave}><LogOut className="mr-2 h-4 w-4"/> Leave</Button>}
                            </div>
                            <CardDescription>Join the panel to participate in the live conversation.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {room.seats.map((seat, index) => (
                                <Card key={index} className={cn("text-center p-4 transition-all", seat.user ? "bg-card" : "bg-muted/50 border-dashed")}>
                                    <Avatar className="w-16 h-16 mx-auto border-2">
                                        {seat.user && <AvatarImage src={seat.user.avatar} alt={seat.user.name} />}
                                        <AvatarFallback>{seat.user ? seat.user.name.charAt(0) : <Sofa />}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold mt-2 truncate">{seat.user?.name || "Empty Seat"}</p>
                                </Card>
                            ))}
                        </CardContent>
                        {userState === 'unjoined' && (
                            <CardFooter className="justify-center gap-4">
                                <Button onClick={handleJoinPanel} disabled={!user}><UserPlus className="mr-2"/> Join Panel</Button>
                                <Button onClick={handleJoinAsSpectator} variant="outline" disabled={!user}>
                                    {isCreator ? <><Ghost className="mr-2"/> Join as Ghost</> : <><Eye className="mr-2"/> Watch</>}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {isCreator && userState === 'ghost' && (
                        <Card className="mt-6 bg-primary/10 border-primary/30">
                            <CardHeader>
                                <CardTitle className="text-primary">Creator Tools</CardTitle>
                                <CardDescription>Send administrative messages to the room.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-4">
                                <Button variant="destructive" onClick={() => handleCreatorMessage('creator_warn')}>
                                    <ShieldAlert className="mr-2"/> Send Warning
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleCreatorMessage('creator_thanks')}>
                                    <Users className="mr-2"/> Send Thanks
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <div className="mt-6 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                           <h3 className="font-headline text-lg">Spectators ({room.spectators.length})</h3>
                           {room.twitchUrl && <a href={room.twitchUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="gap-2"><Twitch className="w-4 h-4 text-purple-600"/>Twitch</Button></a>}
                           {room.youtubeUrl && <a href={room.youtubeUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="gap-2"><Youtube className="w-4 h-4 text-red-600"/>YouTube</Button></a>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {room.spectators.map(spec => (
                                <div key={spec.uid} className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={spec.avatar} alt={spec.name} />
                                        <AvatarFallback><Eye className="w-4 h-4"/></AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{spec.name}</span>
                                </div>
                            ))}
                            {room.spectators.length === 0 && <p className="text-sm text-muted-foreground">No one is watching right now.</p>}
                        </div>
                    </div>

                </div>

                <Card className="shadow-lg flex flex-col h-[calc(100vh-20rem)] lg:col-span-1">
                    <CardHeader className="border-b">
                        <CardTitle>Live Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {room.messages.map((msg, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Avatar className="w-8 h-8 border">
                                            <AvatarImage src={msg.user.avatar} />
                                            <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{msg.user.name}</p>
                                            <div className={cn("p-2 rounded-lg text-sm border", getMessageStyle(msg.type))}>{msg.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-2 border-t">
                        <div className="flex w-full items-center gap-2">
                            <Input
                                placeholder={userState === 'panelist' ? "Type a message..." : "Join the panel to chat"}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                disabled={isSending || userState !== 'panelist'}
                            />
                            <Button size="icon" onClick={handleSendMessage} disabled={isSending || userState !== 'panelist'}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default function GamersPage() {
    const [rooms, setRooms] = useState<GamingRoom[]>([]);
    const [activeTab, setActiveTab] = useState<string>("hub");

    const handleRoomCreated = (room: GamingRoom) => {
        setRooms(prev => [...prev, room]);
        setActiveTab(room.id);
    };

    const updateRoom = (updatedRoom: GamingRoom) => {
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    };
    
    return (
        <div className="space-y-6">
            <Alert variant="default" className="bg-primary/10 border-primary/30">
                <Gamepad2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Welcome to the Gamers Hub!</AlertTitle>
                <AlertDescription>
                   This is the central space for the Hamraz gaming community. Create your own rooms for specific games, host discussion panels with your friends, discuss live streams, and build your own community of gamers.
                </AlertDescription>
            </Alert>

             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-wrap items-center gap-2">
                     <TabsList>
                        <TabsTrigger value="hub">Hub</TabsTrigger>
                     </TabsList>
                     <div className="h-6 border-l border-border mx-2"></div>
                     <TabsList>
                         {rooms.map(room => (
                             <TabsTrigger key={room.id} value={room.id} className="flex items-center gap-2">
                                <Gamepad2 className="h-4 w-4"/>
                                <span>{room.name}</span>
                            </TabsTrigger>
                         ))}
                     </TabsList>
                     <CreateGamingRoomDialog onRoomCreated={handleRoomCreated} />
                </div>
                
                <TabsContent value="hub" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Gaming Rooms</CardTitle>
                            <CardDescription>Join a room or create your own to get started.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rooms.length === 0 ? (
                                <p className="text-muted-foreground">No gaming rooms created yet. Be the first!</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rooms.map(room => (
                                    <Card key={room.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle>{room.name}</CardTitle>
                                            <CardDescription>{room.game}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">Owner: {room.owner}</p>
                                            <p className="text-sm text-muted-foreground">Panelists: {room.seats.filter(s => s.user).length}/{NUM_SEATS}</p>
                                            <p className="text-sm text-muted-foreground">Spectators: {room.spectators.length}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" onClick={() => setActiveTab(room.id)}>Join Room</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {rooms.map(room => (
                    <TabsContent key={room.id} value={room.id} className="mt-4">
                        <Room room={room} updateRoom={updateRoom} />
                    </TabsContent>
                ))}
             </Tabs>
        </div>
    );
}
