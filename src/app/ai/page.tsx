
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Bot, User, Wand2 } from "lucide-react";

const capabilities = [
    {
        title: "Your Creative Partner",
        description: "Hamraz is not just a tool; it's a collaborator. It understands your vision, suggests creative ideas, and helps you build, write, and design. It's a true partner in your creative process.",
        icon: Bot,
    },
    {
        title: "Powered by You",
        description: "The AI learns from your goals and preferences. The more you interact, the better it understands your needs, creating a truly personalized and adaptive experience.",
        icon: User,
    },
    {
        title: "Magical Tools",
        description: "From generating entire project structures with the 'Magic Repo' to creating cinematic videos, the AI provides you with powerful, one-click tools to bring your most ambitious ideas to life instantly.",
        icon: Wand2,
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
                The Soul of Hamraz
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
               Our AI is more than just code. It is a philosophy of collaboration, a commitment to creativity, and a partner in your journey from idea to reality.
            </p>
        </header>
        
        <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {capabilities.map((cap) => (
                    <Card key={cap.title} className="text-center shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="items-center">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <cap.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="mt-4">{cap.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{cap.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section>
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-center">The Philosophy: Human + AI</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
                    <p>
                        We believe the future is not about AI replacing humans, but about humans and AI achieving more together than either could alone.
                    </p>
                    <p>
                        Our model is built on **dialogue and mutual respect**. You are the visionary, the director, the storyteller. The AI is your first mate, your technical expert, your tireless assistant. It handles the 'how' so you can focus on the 'what' and the 'why'.
                    </p>
                     <blockquote>
                        "This is a shared creation. We created Hamraz, but you will lay its foundation."
                    </blockquote>
                </CardContent>
            </Card>
        </section>
    </div>
  );
}
