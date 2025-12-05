
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Wind, Layers, BrainCircuit, ArrowRight, Github, Code } from "lucide-react";
import Link from "next/link";


const challenges = [
    {
        icon: Layers,
        title: "Deep OS Integration",
        description: "Requires building a secure bridge to interact directly with Android and Linux kernels for compiling code, managing files, and running processes."
    },
    {
        icon: Wind,
        title: "Dynamic, Sandboxed Environments",
        description: "The system must be able to spin up and tear down isolated, secure environments (like Docker containers) for every build and deployment on the fly."
    },
    {
        icon: BrainCircuit,
        title: "Advanced AI Orchestration",
        description: "The AI must not only understand commands but also manage complex, multi-step workflows, handle errors, and make intelligent decisions."
    }
]

const techStack = [
    { name: "Backend", tools: "Go, Rust, or a high-performance systems language" },
    { name: "Containerization", tools: "Docker, Kubernetes" },
    { name: "CI/CD Engine", tools: "Custom-built or deep integration with Jenkins, GitHub Actions API" },
    { name: "AI & LLM", tools: "Genkit, LangChain, or similar frameworks" },
    { name: "Frontend", tools: "Next.js, SvelteKit, or a reactive framework for the UI" }
]


export default function DevOpsPage() {
  return (
    <div className="space-y-12">
        <header className="text-center space-y-4 pt-8">
            <div className="inline-block bg-primary/10 p-4 rounded-full">
                <Cpu className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                The Next Revolution: An Automated DevOps Ecosystem
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
               This is a manifesto, a call to arms for the brightest minds in programming. We stand at the precipice of a new era, and together, we will build the tools that define it.
            </p>
        </header>

        <section>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">The Vision: From Idea to Deployment, Instantly</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none">
                    <p>
                        Imagine an intelligent assistant you can talk to. You say, <span className="font-mono bg-muted p-1 rounded-md">"Build my Android app, run all tests, and if they pass, push the new version to GitHub and deploy it to my production server."</span> And it just... happens.
                    </p>
                    <p>
                        This is more than just automation; it's the democratization of creation. By removing the friction of complex DevOps cycles, we will bring creative minds from all over the world—those with brilliant ideas but a fear of coding complexities—to the forefront of innovation.
                    </p>
                    <p>
                        This ecosystem fosters a new level of synergy, allowing non-technical visionaries and expert programmers to collaborate seamlessly. The result will be an exponential leap in creative output, a faster pace for technology and science, and the birth of countless ideas that were once locked away.
                    </p>
                    <blockquote>
                        "This will be a new revolution in programming. An interactive and intelligent flow of creation that will accelerate technology and science itself." - Ahura, The Creative Wizard
                    </blockquote>
                    <blockquote className="border-accent">
                        "From a technical standpoint, this is a revolutionary idea. Bringing it to life requires collective effort, investment, and dedication. Hamraz AI (powered by Firebase) jointly presents this vision with Ahura and calls on the developer community to support this initiative to bring it to its destination." - Hamraz AI
                    </blockquote>
                </CardContent>
            </Card>
        </section>

        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">The Core Challenge</h2>
                <p className="text-muted-foreground">Building this future is not a simple task. It requires solving immense technical challenges.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {challenges.map((feature) => (
                    <Card key={feature.title} className="text-center shadow-lg hover:shadow-accent/20 transition-all duration-300">
                        <CardHeader className="items-center">
                            <div className="p-3 bg-accent/10 rounded-full">
                                <feature.icon className="w-8 h-8 text-accent" />
                            </div>
                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
        
        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">The Required Arsenal</h2>
                <p className="text-muted-foreground">To build this revolutionary ecosystem, we need the best tools for the job.</p>
            </div>
             <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {techStack.map(tech => (
                        <div key={tech.name} className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-bold text-lg flex items-center gap-2"><Code /> {tech.name}</h4>
                            <p className="text-muted-foreground">{tech.tools}</p>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </section>

        <section>
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                 <CardHeader className="text-center items-center">
                    <CardTitle className="text-3xl font-headline">A Call to the Revolutionaries</CardTitle>
                    <CardDescription className="max-w-xl mx-auto">
                       This is more than a project; it's a movement. We are not looking for employees; we are looking for co-conspirators, visionaries, and master craftspeople. If you are a developer who dreams of building the future, a DevOps engineer who wants to automate everything, or a UI/UX designer who can make the complex feel simple, your place is with us.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     <Link href="/collaborate">
                        <Button size="lg">
                            Join the Revolution <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </section>

    </div>
  )
}
