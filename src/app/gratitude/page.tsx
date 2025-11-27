
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
import { Loader2, Upload, Sunrise, Smile, Heart } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sampleSubmissions = {
    happy: [
        { id: 1, title: "Scored a goal in my match!", author: "Kian", type: "video", url: "https://videos.pexels.com/video-files/5494391/5494391-hd_1280_720_25fps.mp4"},
    ],
    grateful: [
        { id: 2, title: "My family's support", author: "Bahar", type: "audio", url: ""},
        { id: 3, title: "A beautiful sunset", author: "Sara", type: "video", url: "https://videos.pexels.com/video-files/854341/854341-hd_1280_720_25fps.mp4"},
    ]
}

const SubmissionForm = ({ category }: { category: 'happy' | 'grateful' }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();
    const categoryText = category === 'happy' ? 'happiness' : 'gratitude';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !file) {
            toast({ variant: "destructive", title: "Incomplete", description: `Please provide a title and a file for your message of ${categoryText}.` });
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Submission:", { userId: user?.uid, title, file: file.name, category });
        setIsLoading(false);
        setIsSubmitted(true);
        toast({ title: "Shared Successfully!", description: `Thank you for sharing your message of ${categoryText}.` });
    }

    if(isSubmitted){
        return (
            <Card className="shadow-lg text-center p-6">
                <CardTitle>Thank You for Sharing!</CardTitle>
                <CardDescription className="mt-2">Your positive message contributes to our community's well-being.</CardDescription>
                <Button className="mt-4" onClick={() => setIsSubmitted(false)}>Share Another</Button>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Share Your {category === 'happy' ? "Happiness" : "Gratitude"}</CardTitle>
                    <CardDescription>Record or upload a short video/audio message explaining why you're {category}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor={`${category}-title`}>Title</Label>
                        <Input id={`${category}-title`} placeholder={`e.g., "A walk in the park", "My family's love"`} value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading || !user} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${category}-file`}>Audio or Video File</Label>
                        <Input
                            id={`${category}-file`}
                            type="file"
                            accept="video/*,audio/*"
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            disabled={isLoading || !user}
                            required
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                         {file && <p className="text-xs text-muted-foreground pt-1">Selected: {file.name}</p>}
                    </div>
                     {!user && <p className="text-sm text-center text-destructive font-medium">Please sign in to share.</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || !user}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sharing...</> : <><Upload className="mr-2 h-4 w-4" />Share My Message</>}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

const SubmissionGallery = ({ submissions }: { submissions: typeof sampleSubmissions.happy | typeof sampleSubmissions.grateful }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {submissions.map(sub => (
            <Card key={sub.id} className="shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                {sub.type === 'video' ? (
                     <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <video src={sub.url} className="w-full h-full object-cover" controls />
                     </div>
                ) : (
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                         <audio controls className="w-full px-4"/>
                    </div>
                )}
                <CardHeader>
                    <CardTitle className="text-lg">{sub.title}</CardTitle>
                    <CardDescription>Shared by {sub.author}</CardDescription>
                </CardHeader>
            </Card>
        ))}
    </div>
);


export default function GratitudePage() {
  return (
    <div className="space-y-8">
       <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Sunrise className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Hope for Tomorrow</AlertTitle>
        <AlertDescription>
          Share the positive moments and blessings in your life. Your voice of happiness and gratitude can inspire and bring hope to others in the community.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="happy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="happy"><Smile className="mr-2"/>I'm So Happy</TabsTrigger>
          <TabsTrigger value="grateful"><Heart className="mr-2"/>I'm So Grateful</TabsTrigger>
        </TabsList>
        <TabsContent value="happy" className="mt-6">
            <SubmissionForm category="happy" />
            <SubmissionGallery submissions={sampleSubmissions.happy} />
        </TabsContent>
        <TabsContent value="grateful" className="mt-6">
            <SubmissionForm category="grateful" />
            <SubmissionGallery submissions={sampleSubmissions.grateful} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
