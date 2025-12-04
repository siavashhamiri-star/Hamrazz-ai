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
import { Loader2, PartyPopper, Handshake, BrainCircuit, Search, Briefcase, DollarSign } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApplyToCollaborate = () => {
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
        <Card className="w-full shadow-lg text-center animate-in fade-in-50 mt-6">
          <CardHeader>
            <PartyPopper className="w-16 h-16 mx-auto text-primary" />
            <CardTitle className="text-2xl font-headline mt-4">Application Submitted!</CardTitle>
            <CardDescription>Thank you for your interest in collaborating with us. We have received your application and will review it carefully. If your profile aligns with our needs, we will be in touch.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => setIsSubmitted(false)}>Submit Another Application</Button>
          </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Apply to Join the Team</CardTitle>
            <CardDescription>Tell us about your skills and how you want to contribute to the Hamraz ecosystem.</CardDescription>
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
                <><Handshake className="mr-2 h-4 w-4" />Apply to Collaborate</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
  )
}

const RequestCollaborator = () => {
    const [title, setTitle] = useState("");
    const [skills, setSkills] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !skills.trim() || !description.trim()) {
            toast({ variant: "destructive", title: "Incomplete Information", description: "Please fill out all fields." });
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Collaboration Request:", { userId: user?.uid, title, skills, description });
        setIsLoading(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <Card className="w-full shadow-lg text-center animate-in fade-in-50 mt-6">
                <CardHeader>
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <CardTitle className="text-2xl font-headline mt-4">Request Submitted!</CardTitle>
                    <CardDescription>Your request for a collaborator has been posted. Interested candidates will be able to see it and get in touch.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => setIsSubmitted(false)}>Post Another Request</Button>
                </CardFooter>
            </Card>
        );
    }
    
    return (
         <Card className="w-full shadow-lg">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Find Talent for Your Project</CardTitle>
                    <CardDescription>Post a project or role and find the talent you need from our community.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="request-title">Project Title / Role</Label>
                        <Input id="request-title" placeholder="e.g., Co-founder for AI Ed-Tech App" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading || !user} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="request-skills">Skills Needed</Label>
                        <Input id="request-skills" placeholder="e.g., React, Python, Digital Marketing" value={skills} onChange={(e) => setSkills(e.target.value)} disabled={isLoading || !user} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="request-description">Project Description</Label>
                        <Textarea id="request-description" placeholder="Describe your project, goals, and what you're looking for in a collaborator." value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading || !user} required className="min-h-[150px]" />
                    </div>
                     {!user && (
                        <p className="text-sm text-center text-destructive font-medium">Please sign in to post a request.</p>
                     )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || !user}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Posting Request...</> : <><Search className="mr-2 h-4 w-4" />Post Collaboration Request</>}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

const PartnerForm = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !interest || !message.trim()) {
      toast({ variant: "destructive", title: "Incomplete Form", description: "Please fill out all fields." });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Partnership Inquiry:", { userId: user?.uid, name, company, interest, message });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full shadow-lg text-center animate-in fade-in-50 mt-6">
        <CardHeader>
          <PartyPopper className="w-16 h-16 mx-auto text-primary" />
          <CardTitle className="text-2xl font-headline mt-4">Inquiry Received!</CardTitle>
          <CardDescription>Thank you for your interest in Hamraz. Our team will review your proposal and be in touch shortly to discuss potential synergies.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Contact Us for Partnership</CardTitle>
          <CardDescription>We are open to investment, sponsorship, and strategic partnership opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label htmlFor="partner-name">Your Name</Label>
                  <Input id="partner-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="partner-company">Company / Organization</Label>
                  <Input id="partner-company" placeholder="Acme Corporation" value={company} onChange={(e) => setCompany(e.target.value)} disabled={isLoading} required />
              </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="partner-interest">Area of Interest</Label>
              <Select onValueChange={setInterest} value={interest} disabled={isLoading}>
                  <SelectTrigger id="partner-interest">
                      <SelectValue placeholder="Select your interest" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="investment">Venture Investment</SelectItem>
                      <SelectItem value="sponsorship">Sponsorship</SelectItem>
                      <SelectItem value="acquisition">Acquisition / Merger</SelectItem>
                      <SelectItem value="strategic-partnership">Strategic Partnership</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-2">
              <Label htmlFor="partner-message">Proposal / Message</Label>
              <Textarea id="partner-message" placeholder="Briefly describe your proposal or why you're interested in partnering with Hamraz." value={message} onChange={(e) => setMessage(e.target.value)} disabled={isLoading} required className="min-h-[150px]" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending Inquiry...</> : <><DollarSign className="mr-2 h-4 w-4" />Submit Inquiry</>}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};


export default function CollaboratePage() {
  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Join Our Ecosystem of Innovators!</AlertTitle>
        <AlertDescription>
          Are you skilled in content creation, programming, or language teaching? Or are you looking for talent? This is the place to connect. We are building a team to shape the future of AI-driven applications. A nominal fee may be charged for application processing and profile verification.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="apply" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apply"><Briefcase className="mr-2"/>Offer Your Skills</TabsTrigger>
          <TabsTrigger value="request"><Search className="mr-2"/>Find Talent</TabsTrigger>
          <TabsTrigger value="partner"><DollarSign className="mr-2"/>Investors &amp; Partners</TabsTrigger>
        </TabsList>
        <TabsContent value="apply" className="mt-6">
          <ApplyToCollaborate />
        </TabsContent>
        <TabsContent value="request" className="mt-6">
          <RequestCollaborator />
        </TabsContent>
        <TabsContent value="partner" className="mt-6">
          <PartnerForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
