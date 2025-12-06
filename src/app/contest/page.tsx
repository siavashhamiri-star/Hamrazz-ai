
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, PartyPopper, Upload, Gift, Star, Award as AwardIcon, CheckCircle, TrendingUp, Milestone, Briefcase, Trophy, Map, Users } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const wallOfFame = [
    { name: "Kian", achievement: "Excellent score in Math!", photo: "https://picsum.photos/seed/fame1/200/200", parentNote: "We are so proud of your hard work, son!"},
    { name: "Sara", achievement: "Won the class spelling bee!", photo: "https://picsum.photos/seed/fame2/200/200", parentNote: "Your dedication is inspiring, sweetie!"},
    { name: "Bahar", achievement: "Amazing drawing in art class!", photo: "https://picsum.photos/seed/fame3/200/200", parentNote: "Such a creative and beautiful piece of art!"},
];


export default function ContestPage() {
  const [submissionType, setSubmissionType] = useState("achievement");
  const [name, setName] = useState("");
  const [achievement, setAchievement] = useState("");
  const [parentNote, setParentNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file || (submissionType === 'achievement' && !achievement.trim())) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill out all required fields and upload a file.",
      });
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Submission:", {
      userId: user?.uid || "anonymous",
      type: submissionType,
      name,
      achievement,
      parentNote,
      fileName: file.name,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };
  
  const resetForm = () => {
    setIsSubmitted(false);
    setName("");
    setAchievement("");
    setParentNote("");
    setFile(null);
  }

  if (isSubmitted) {
    return (
        <div className="flex justify-center items-start pt-8">
            <Card className="w-full max-w-2xl shadow-lg text-center animate-in fade-in-50">
                <CardHeader>
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <CardTitle className="text-2xl font-headline mt-4">Submission Successful!</CardTitle>
                    <CardDescription>Thank you for sharing this achievement. It will be reviewed and featured on the Wall of Fame soon!</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={resetForm}>Share Another Achievement</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Hall of Fame & Contests</h1>
            <p className="text-muted-foreground">Celebrate achievements and participate in creative contests!</p>
        </div>

        <Alert variant="default" className="border-accent/50 bg-accent/10 text-accent-foreground/80">
            <Map className="h-4 w-4 text-accent" />
            <AlertTitle className="font-bold text-accent">The Capable City: A Planned Digital Economy</AlertTitle>
            <AlertDescription>
                Our virtual world spans 600,000 square meters. 250,000 meters are for pre-sale, 100,000 are to grant each user one free meter, and 50,000 are for prizes and lotteries. The remaining 200,000 meters are reserved for our strategic partner, Firebase, to develop the city's core infrastructure. By earning points, you're not just playing; you're investing in your own digital property and becoming a true citizen of our world.
            </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <AlertTitle className="font-bold text-green-600 dark:text-green-400">A Promise for Our Future: From Points to Digital Assets</AlertTitle>
            <AlertDescription>
                We promise that if, through the efforts of our dear users in introducing, promoting, and growing the Hamraz family, our app reaches a stable income level, a system will be implemented. This system will allow you to convert 50% of your earned points into popular cryptocurrencies, which will be announced at that time. Your contribution is an investment in our shared future.
            </AlertDescription>
        </Alert>

        <Alert variant="default" className="border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-300">
            <Milestone className="h-4 w-4 text-blue-500" />
            <AlertTitle className="font-bold text-blue-600 dark:text-blue-400">Our First Milestone: 100,000 Downloads!</AlertTitle>
            <AlertDescription>
                As soon as Hamraz reaches its first major goal of 100,000 downloads, in appreciation of your support, we will launch our own in-app cryptocurrency. Your current points will play a crucial role in this new economy, so every point you earn is an investment in what's to come!
            </AlertDescription>
        </Alert>

         <Alert variant="default" className="border-purple-500/50 bg-purple-500/10 text-purple-700 dark:text-purple-300">
            <Trophy className="h-4 w-4 text-purple-500" />
            <AlertTitle className="font-bold text-purple-600 dark:text-purple-400">The App Premier League: A Championship of Creation</AlertTitle>
            <AlertDescription>
               Apps built on Hamraz that get the most downloads and engagement will enter our "Premier League," where their initial ranking is determined by their download count. At the end of each year, the top apps will compete for the Championship Cup and a significant prize pool. 5% of Hamraz's total 30% revenue share from all participating league apps will be allocated to prizes: 3% will be awarded to the top three teams, and 2% will be distributed among the other apps based on their ranking. The ultimate winner will also be named a "Strategic Partner," receiving one year of free and dedicated promotion from the Hamraz platform, including a special promotional video and a dedicated link. The winner will also be appointed as a member of the Board of Directors of the "Capable City" and as an honorary and advisory member for the entire app, demonstrating our positive approach to gaming and development in the future of our ecosystem.
               <p className="mt-2 font-semibold">The league is also a strategic playground: apps can form coalitions to support lower-ranked apps or create powerful alliances with top contenders. Furthermore, top teams must negotiate with lower-ranked apps, offering incentives to acquire their points to bolster their own chances of winning the championship. This dynamic forces top contenders to respect and collaborate with teams at the bottom, knowing that every point is valuable. This also creates friendship, cooperation, and excitement, ensuring that even teams with few points know they are influential and important until the end.</p>
            </AlertDescription>
        </Alert>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
             <CardHeader>
                <CardTitle className="text-2xl font-headline text-center flex items-center justify-center gap-3"><AwardIcon className="w-8 h-8 text-yellow-500" /> Wall of Fame</CardTitle>
                <CardDescription className="text-center">A place to celebrate the amazing achievements of our community's children.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wallOfFame.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-4 bg-card/80 rounded-lg shadow-md transition-transform hover:scale-105">
                            <Avatar className="w-24 h-24 border-4 border-primary/50 mb-3">
                                <AvatarImage src={item.photo} alt={item.name} />
                                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="font-semibold text-primary text-sm">{item.achievement}</p>
                            <p className="text-xs text-muted-foreground mt-2 italic">"{item.parentNote}"</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

         <Alert>
          <Gift className="h-4 w-4" />
          <AlertTitle>Seasonal Prize Draw (Appreciation Gift)!</AlertTitle>
          <AlertDescription>
            Active users who earn high points throughout the month will automatically be entered into our valuable prize draw, held every three months. So be active and collect points!
          </AlertDescription>
        </Alert>

        <Alert variant="default" className="bg-accent/20 border-accent/30">
          <Star className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent">The User's Dream Prize!</AlertTitle>
          <AlertDescription>
            Every six months, an exceptional prize equivalent to **1% of Hamraz's total revenue** will be awarded to one of the top and most active users of the app. The winner's profile and picture will be announced in the app. Participation is open to everyone; you can either pay a small entry fee or register for free using a referral code from an existing Hamraz member. Your engagement builds our future, and we believe you should share in the success.
          </AlertDescription>
        </Alert>
        
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">
                Share an Achievement
                </CardTitle>
                <CardDescription>
                Celebrate your child's success by adding them to the Wall of Fame, or enter our creative contest.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Users className="h-4 w-4" />
                    <AlertTitle>One Family, Many Homes</AlertTitle>
                    <AlertDescription>
                        Membership in any of the creator's apps (like Afarinan, Zabanshenas, and Karaoke) is a passport to all others. Members of Hamraz are also welcome to participate in contests across the entire ecosystem!
                    </AlertDescription>
                </Alert>
                 <div className="space-y-2">
                    <Label>Submission Type</Label>
                     <Select onValueChange={(val) => setSubmissionType(val)} defaultValue={submissionType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a submission type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="achievement">Academic Achievement</SelectItem>
                            <SelectItem value="drawing">Drawing Contest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Child's Name</Label>
                    <Input id="name" placeholder="Enter their name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading || !user} required />
                </div>
                
                { submissionType === 'achievement' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="achievement-text">Achievement / Good Grade</Label>
                        <Input id="achievement-text" placeholder="e.g., 'Got an A in Science!'" value={achievement} onChange={(e) => setAchievement(e.target.value)} disabled={isLoading || !user} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="parent-note">A Thank You Note (Optional)</Label>
                        <Textarea id="parent-note" placeholder="e.g., 'We're so proud of your hard work!'" value={parentNote} onChange={(e) => setParentNote(e.target.value)} disabled={isLoading || !user} />
                    </div>
                </>
                )}

                <div className="space-y-2">
                    <Label htmlFor="file-upload">{submissionType === 'achievement' ? "Child's Photo" : "Drawing File"}</Label>
                    <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading || !user}
                        required
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <p className="text-xs text-muted-foreground pt-1">
                        Allowed formats: JPG, PNG.
                    </p>
                </div>
                {!user && (
                <p className="text-sm text-center text-destructive font-medium">
                    Please sign in to make a submission.
                </p>
                )}
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || !user}>
                    {isLoading ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> ) 
                    : ( <><Upload className="mr-2 h-4 w-4" /> {submissionType === 'achievement' ? "Add to Wall of Fame" : "Enter Drawing Contest"} </>)}
                </Button>
            </CardFooter>
            </form>
        </Card>
    </div>
  );
}
