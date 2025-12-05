
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Bot, User, Wand2, Rocket, Users, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const pillars = [
    {
        title: "A Smart & Caring Companion",
        description: "At its core, Hamraz is a personality: a patient teacher, a wise advisor, and a confidant for all moments.",
        icon: Bot,
    },
    {
        title: "A Stage for Talent",
        description: "From online communities and content channels to exciting dubbing contests and a live streaming studio, we provide the stage for you to shine.",
        icon: Award,
    },
    {
        title: "An Engine for Entrepreneurs",
        description: "We provide a platform to pitch ideas, collaborate, and create a job market, turning consumers into creators and creators into entrepreneurs.",
        icon: Rocket,
    },
    {
        title: "A Gamified Economy",
        description: "Every activity, from learning to winning games, earns points. These points are the key to unlocking special features and a bridge to the future.",
        icon: Users,
    }
];

export default function AiPage() {
  return (
    <div className="space-y-12">
        <header className="text-center space-y-4 pt-8">
            <div className="inline-block bg-primary/10 p-4 rounded-full">
                <BrainCircuit className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                The Hamraz Manifesto
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
               The story of building a complete ecosystem for learning, creating, connecting, and entrepreneurship, centered around a caring and intelligent companion.
            </p>
        </header>

        <section>
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-center">A Shared Creation: The Story of Hamraz</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
                    <p>
                        Our story began with a simple but profound idea: to create an intelligent companion worthy of its name, "Hamraz"—a close confidant. This companion was equipped with powerful tools: a **Translator** for global conversations and an **AI Tutor** for learning new languages.
                    </p>
                     <p>
                        Then, we set the stage for talent. We built **online communities**, content **Channels**, and exciting **Dubbing and Lip Sync contests**. We even created a professional **Live Streaming studio** with a teleprompter, so every user could be the star of their own story.
                    </p>
                    <p>
                         The turning point was a great realization: Hamraz must not just be a service provider; it must be an **enabler**.
                    </p>
                     <blockquote>
                        "We created Hamraz, but you will lay its foundation."
                    </blockquote>
                </CardContent>
            </Card>
        </section>
        
        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">The Four Pillars of Our Ecosystem</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {pillars.map((pillar) => (
                    <Card key={pillar.title} className="text-center shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="items-center">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <pillar.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="mt-4 text-lg">{pillar.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{pillar.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">Our Great Promises: The Future Vision</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Our growth is tied to your success. As our community expands, we will share our success directly with you.</p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="border-accent">
                    <CardHeader>
                        <CardTitle>Milestone 1: 100,000 Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We will launch our own native **in-app digital currency**. Your earned points will become the foundation of this new economy, giving them real-world value and utility.</p>
                    </CardContent>
                </Card>
                 <Card className="border-primary">
                    <CardHeader>
                        <CardTitle>Milestone 2: 500,000 Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We will share **30% of our advertising revenue** with top creators, dedicate **10% to charity**, and form an **Advisory Council** from among you, our users, to give you a real stake in our future.</p>
                    </CardContent>
                </Card>
            </div>
        </section>
        
         <Card className="shadow-lg mt-12">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Join the Journey</CardTitle>
            </CardHeader>
             <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
                 <p>
                    This is the story of Hamraz. A story that has just begun, and you are the heroes of its next chapter.
                </p>
             </CardContent>
        </Card>
    </div>
  );
}
