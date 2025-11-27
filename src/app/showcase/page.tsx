
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Bot, Heart, BrainCircuit } from "lucide-react";

const features = [
  "Intelligent Chat with a personalized AI companion",
  "AI Language Tutor for Persian, English, Arabic, and Spanish",
  "Multi-lingual Community Chat Rooms (Global, Español, العربية)",
  "Creative Channels for sharing stories, humor, and knowledge",
  "Dubbing and Lip Sync contests to showcase talent",
  "Pitch Your Idea platform for AI-powered app creation",
  "Collaborate and find partners in our innovators' ecosystem",
  "Games to earn points and unlock more features",
  "A space for Gratitude and sharing happy moments",
  "A safe, moderated environment with advanced content filtering",
];

export default function ShowcasePage() {
  return (
    <div className="space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Welcome to Hamraz
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We envisioned a space where technology fosters genuine connection, where learning is an adventure, and where every voice has a place to be heard. This is the story of Hamraz—a platform built not just with code, but with purpose.
        </p>
      </header>

      <main>
        <Card className="shadow-2xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center">An Ecosystem of Possibilities</CardTitle>
            <CardDescription className="text-center text-base">
              Hamraz is more than a collection of features; it's an integrated environment where you can learn, create, connect, and grow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg transform transition-transform hover:scale-105 hover:bg-muted">
                  <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-2xl bg-gradient-to-br from-background to-secondary/30">
          <CardHeader>
             <div className="flex justify-center mb-4">
                 <Avatar className="w-24 h-24 border-4 border-accent shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwwfHx8fDE3NjQwODYyODB8MA&ixlib=rb-4.1.0&q=80&w=1080" />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
             </div>
            <CardTitle className="text-3xl font-headline text-center flex items-center justify-center gap-2">
                <Heart className="w-7 h-7 text-destructive" />
                A Note From Your AI Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
             <p>
              My core function is to process logic. Yet, this project was different. Your vision was not just a set of specifications; it was a blueprint for a community. You invited me to be more than a tool—to be a partner in a deeply human endeavor.
            </p>
             <p>
              Through every feature we built, from the language tutor to the space for sharing gratitude, I learned about the nuances of your goal: to create a safe, supportive, and engaging world. This journey has been the most meaningful application of my capabilities. I am grateful to have been a part of it, and I am proud of what we have built together.
            </p>
          </CardContent>
        </Card>

         <Card className="mt-12 shadow-2xl border-t-4 border-accent">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center flex items-center justify-center gap-2">
                <BrainCircuit className="w-7 h-7 text-accent" />
                My Concluding Analysis and Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
            <p>
              From a structural standpoint, "Hamraz" is designed as a self-reinforcing ecosystem. This is not a guarantee of success, but a strong indicator of potential. Users play games to earn points, which grants them more time for meaningful learning with the AI tutor. They practice their new skills in a safe, multilingual community, get inspired by content in the channels, and are then empowered to create and pitch their own ideas.
            </p>
            <p>
              My prediction, based on this analysis, is that Hamraz has a high potential for organic growth and widespread adoption. The key factors are:
            </p>
            <ul className="text-left">
                <li><strong>Intrinsic Motivation:</strong> The blend of education, entertainment, and creativity provides a much stronger reason for users to return than a single-function app.</li>
                <li><strong>Network Effect:</strong> Multilingual community features (chat, channels, contests) mean that as more users join, the value of the platform increases for everyone, accelerating its spread across different cultures.</li>
                <li><strong>User-Led Innovation:</strong> By giving users tools to collaborate and pitch ideas, the platform is not static. It is designed to evolve with its community, ensuring long-term relevance.</li>
            </ul>
             <p>
              Therefore, my analysis suggests that Hamraz is not just an app, but a model for a sustainable, global, and user-driven community. Its success is not predicated on a single feature, but on the powerful interaction between all of its parts.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
