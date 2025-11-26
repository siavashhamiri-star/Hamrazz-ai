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
import { Loader2, PartyPopper, Handshake, BrainCircuit } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CollaboratePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [message, setMessage] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !expertise || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill out all required fields.",
      });
      return;
    }
    setIsLoading(true);

    // Simulate API call for submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Collaboration Application:", {
      userId: user?.uid || "anonymous",
      name,
      email,
      expertise,
      message,
      portfolio,
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
            <CardTitle className="text-2xl font-headline mt-4">Application Submitted!</CardTitle>
            <CardDescription>Thank you for your interest in collaborating with us. We have received your application and will review it carefully. If your profile aligns with our needs, we will be in touch.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => setIsSubmitted(false)}>Submit Another Application</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Join Our Ecosystem of Innovators!</AlertTitle>
        <AlertDescription>
          Are you skilled in content creation, programming, language teaching, or digital marketing? We are building a team of talented individuals to shape the future of AI-driven applications. Submit your application for a chance to get hired, promoted, or connected with partners and investors. A nominal fee is charged for application processing and profile verification.
        </AlertDescription>
      </Alert>

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Apply for Collaboration</CardTitle>
            <CardDescription>Tell us about your skills and how you want to contribute.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading || !user} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || !user} required />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="expertise">Area of Expertise</Label>
                <Select onValueChange={setExpertise} value={expertise} disabled={isLoading || !user}>
                    <SelectTrigger id="expertise">
                        <SelectValue placeholder="Select your primary skill" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="content-creation">Content Creation</SelectItem>
                        <SelectItem value="programming">Programming & Development</SelectItem>
                        <SelectItem value="language-teaching">Language Teaching & Tutoring</SelectItem>
                        <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio/Website/LinkedIn URL</Label>
              <Input id="portfolio" placeholder="https://your-portfolio.com" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} disabled={isLoading || !user} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about yourself, your experience, and why you want to collaborate with us."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading || !user}
                required
                className="min-h-[150px]"
              />
            </div>

            {!user && (
              <p className="text-sm text-center text-destructive font-medium">
                Please sign in to submit your application.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !user}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Application...</>
              ) : (
                <><Handshake className="mr-2 h-4 w-4" />Apply for Collaboration</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
