
"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, BookOpen, Smile, Languages, House, Award } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const channels = [
    { 
        id: "stories", 
        title: "Kids Stories", 
        icon: BookOpen,
        description: "Share captivating stories for children.",
        videos: [
            { title: "The Little Bear's Adventure", author: "Aria G.", url: "https://videos.pexels.com/video-files/854341/854341-hd_1280_720_25fps.mp4" },
            { title: "The Magical Treehouse", author: "Kian N.", url: "https://videos.pexels.com/video-files/853874/853874-hd_1280_720_25fps.mp4" },
        ]
    },
    { 
        id: "humor", 
        title: "Humor & Fun", 
        icon: Smile,
        description: "Post your funny clips and stand-up bits.",
         videos: [
            { title: "My Cat is a Comedian", author: "Sara K.", url: "https://videos.pexels.com/video-files/5494391/5494391-hd_1280_720_25fps.mp4" },
        ]
    },
    { 
        id: "language", 
        title: "Language Learning", 
        icon: Languages,
        description: "Share tips and lessons for learning new languages.",
         videos: [
            { title: "5 English Phrases You Need", author: "Parsa F.", url: "https://videos.pexels.com/video-files/2882112/2882112-hd_1280_720_30fps.mp4" },
        ]
    },
    { 
        id: "homemaking", 
        title: "Home & Family", 
        icon: House,
        description: "For women to share tips on family and home matters.",
         videos: [
            { title: "Quick & Healthy Recipes", author: "Bahar Z.", url: "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_30fps.mp4" },
        ]
    },
];

const VideoGallery = ({ videos }: { videos: { title: string; author: string; url: string }[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
                <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <video src={video.url} className="w-full h-full object-cover" controls />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <CardDescription>by {video.author}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};


const UploadVideoForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [channel, setChannel] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !channel || !description.trim() || !videoFile) {
            toast({
                variant: "destructive",
                title: "Incomplete Form",
                description: "Please fill out all fields and upload a video.",
            });
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Video Upload:", { userId: user?.uid, title, description, channel, fileName: videoFile.name });
        setIsLoading(false);
        setIsSubmitted(true);
    };
    
    if (isSubmitted) {
        return (
            <Card className="w-full shadow-lg text-center animate-in fade-in-50 mt-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline mt-4">Video Submitted!</CardTitle>
                    <CardDescription>Thank you for your contribution! Your video is now under review and will be published shortly.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => setIsSubmitted(false)}>Upload Another Video</Button>
                </CardFooter>
            </Card>
        );
    }
    
    return (
        <Card className="w-full shadow-lg mt-8">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Share Your Content</CardTitle>
                    <CardDescription>Upload a 2-minute video to one of our channels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="video-title">Video Title</Label>
                            <Input id="video-title" placeholder="e.g., The Best Chocolate Chip Cookie Recipe" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading || !user} required />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="channel-select">Channel</Label>
                            <Select onValueChange={setChannel} value={channel} disabled={isLoading || !user}>
                                <SelectTrigger id="channel-select">
                                    <SelectValue placeholder="Select a channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {channels.map(ch => (
                                        <SelectItem key={ch.id} value={ch.id}>{ch.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="video-description">Description</Label>
                        <Textarea id="video-description" placeholder="Briefly describe what your video is about." value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading || !user} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="video-upload">Upload Your 2-Minute Video</Label>
                        <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                            disabled={isLoading || !user}
                            required
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                         {videoFile && <p className="text-xs text-muted-foreground pt-1">Selected: {videoFile.name}</p>}
                    </div>

                    {!user && <p className="text-sm text-center text-destructive font-medium">Please sign in to upload a video.</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || !user}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : <><Upload className="mr-2 h-4 w-4" />Publish Video</>}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};


export default function ChannelsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline mb-2">Channels</h1>
                <p className="text-muted-foreground">Watch, create, and share videos with the community.</p>
            </div>
             <Alert variant="default" className="bg-primary/10 border-primary/30">
                <Award className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Get Featured!</AlertTitle>
                <AlertDescription>
                    Selected videos will be published on Hamraz's official social media channels. The condition for publication is your membership in the Hamraz channel on that platform.
                </AlertDescription>
            </Alert>


            <Tabs defaultValue={channels[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    {channels.map(channel => (
                        <TabsTrigger key={channel.id} value={channel.id} className="gap-2">
                            <channel.icon className="h-4 w-4"/> {channel.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {channels.map(channel => (
                    <TabsContent key={channel.id} value={channel.id} className="mt-6">
                        <Alert className="mb-6">
                            <channel.icon className="h-4 w-4" />
                            <AlertTitle>{channel.title}</AlertTitle>
                            <AlertDescription>{channel.description}</AlertDescription>
                        </Alert>
                        <VideoGallery videos={channel.videos} />
                    </TabsContent>
                ))}
            </Tabs>
            
            <UploadVideoForm />
        </div>
    );
}
