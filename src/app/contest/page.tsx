
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
import { Loader2, PartyPopper, Upload, Gift, Star } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContestPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
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
    if (!name.trim() || !age.trim() || !file) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill out all fields and upload your drawing.",
      });
      return;
    }
    setIsLoading(true);

    // Simulate API call for submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, you would upload the file to Firebase Storage
    // and save the entry to Firestore.
    console.log("Contest Submission:", {
      userId: user?.uid || "anonymous",
      name,
      age,
      fileName: file.name,
      fileType: file.type,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
        <div className="flex justify-center items-start pt-8">
            <Card className="w-full max-w-2xl shadow-lg text-center animate-in fade-in-50">
                <CardHeader>
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <CardTitle className="text-2xl font-headline mt-4">Submission Successful!</CardTitle>
                    <CardDescription>Your beautiful drawing has been received. Wait for the prize draw results.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => {
                        setIsSubmitted(false);
                        setName("");
                        setAge("");
                        setFile(null);
                    }}>Submit Another Drawing</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }


  return (
    <div className="space-y-8">
         <Alert variant="default" className="bg-accent/20 border-accent/30">
          <Star className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent">Amazing Bi-Annual Prize!</AlertTitle>
          <AlertDescription>
            Every six months, an exceptional prize will be awarded to one of the top and most active users of the app. The winner's profile and picture will be announced in the app.
          </AlertDescription>
        </Alert>

        <Alert>
          <Gift className="h-4 w-4" />
          <AlertTitle>Seasonal Prize Draw!</AlertTitle>
          <AlertDescription>
            Active users who earn high points throughout the month will automatically be entered into our valuable prize draw, held every three months. So be active and collect points!
          </AlertDescription>
        </Alert>

        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">
                The Great Drawing Contest
                </CardTitle>
                <CardDescription>
                You can also participate in our contest by submitting a drawing and try your luck at winning exciting prizes!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || !user}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="age">Your Age</Label>
                <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isLoading || !user}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="drawing">Drawing File</Label>
                <Input
                    id="drawing"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading || !user}
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-xs text-muted-foreground pt-1">
                    Allowed formats: JPG, PNG, GIF
                </p>
                </div>
                {!user && (
                <p className="text-sm text-center text-destructive font-medium">
                    Please sign in to participate in the contest.
                </p>
                )}
            </CardContent>
            <CardFooter>
                <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !user}
                >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                    </>
                ) : (
                    <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Drawing & Enter Contest
                    </>
                )}
                </Button>
            </CardFooter>
            </form>
        </Card>
    </div>
  );
}
