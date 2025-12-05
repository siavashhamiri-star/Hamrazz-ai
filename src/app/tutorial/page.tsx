
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, HelpCircle, BookOpen, Wand2, Clapperboard, Rocket } from "lucide-react";
import { generateTutorial, GenerateTutorialOutput } from "@/ai/flows/generate-tutorial-flow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const features = [
    { name: "Magic Repo", icon: Wand2, description: "Learn how to build projects with simple commands." },
    { name: "Showcase", icon: Clapperboard, description: "Discover how to create cinematic promotional videos." },
    { name: "My Story", icon: BookOpen, description: "Generate a personal video about your creative journey." },
    { name: "Pitch an Idea", icon: Rocket, description: "Find out how to submit your project ideas to investors." },
]

export default function TutorialPage() {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [tutorial, setTutorial] = useState<GenerateTutorialOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateTutorial = async (featureName: string) => {
        if (selectedFeature === featureName && tutorial) {
             // Toggle off if the same feature is clicked again
             setSelectedFeature(null);
             setTutorial(null);
             return;
        }

        setSelectedFeature(featureName);
        setIsLoading(true);
        setError(null);
        setTutorial(null);

        try {
            const result = await generateTutorial({ featureName });
            setTutorial(result);
        } catch (e) {
            console.error("Failed to generate tutorial:", e);
            setError("Sorry, I couldn't generate the tutorial right now. Please try again in a moment.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">
             <Alert variant="default" className="bg-primary/10 border-primary/30">
                <HelpCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Welcome to the Hamraz Guide!</AlertTitle>
                <AlertDescription>
                   This is your interactive learning center. Select any feature below, and our AI will generate a personalized, step-by-step guide just for you. Learn at your own pace and master every corner of the Hamraz ecosystem.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map(feature => (
                     <Card 
                        key={feature.name}
                        onClick={() => handleGenerateTutorial(feature.name)}
                        className="cursor-pointer transition-all hover:shadow-primary/20 hover:-translate-y-1"
                     >
                        <CardHeader className="items-center text-center">
                             <div className="p-3 bg-primary/10 rounded-full">
                                <feature.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="mt-4">{feature.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-sm text-center text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {(isLoading || error || tutorial) && (
                 <Card className="shadow-lg animate-in fade-in-50">
                    <CardHeader>
                        {tutorial && <CardTitle className="text-2xl font-headline">{tutorial.title}</CardTitle>}
                         {selectedFeature && !tutorial && !isLoading && !error && <CardTitle className="text-2xl font-headline">Tutorial for {selectedFeature}</CardTitle>}
                         {isLoading && <CardTitle className="text-2xl font-headline">Generating Guide for {selectedFeature}...</CardTitle>}
                         {error && <CardTitle className="text-2xl font-headline text-destructive">An Error Occurred</CardTitle>}

                        {tutorial && <CardDescription>{tutorial.introduction}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="mt-4">Your personal guide is being crafted...</p>
                            </div>
                        )}
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Generation Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {tutorial && (
                             <Accordion type="single" collapsible className="w-full" defaultValue="step-0">
                                {tutorial.steps.map((step, index) => (
                                    <AccordionItem value={`step-${index}`} key={index}>
                                        <AccordionTrigger className="text-lg font-semibold">{index + 1}. {step.title}</AccordionTrigger>
                                        <AccordionContent className="text-base text-muted-foreground pl-2">
                                            {step.description}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                 </Card>
            )}
        </div>
    )
}
