
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, DollarSign, Milestone, Rocket, Scaling, Target, Users, TrendingUp, BrainCircuit, Map, Trophy, Gift, Share2, Banknote } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const keyFeatures = [
    {
        icon: BrainCircuit,
        title: "Human Potential Engine",
        description: "Hamraz's primary goal is to unlock human creativity, turning users from knowledge consumers into knowledge creators through encouragement and support."
    },
    {
        icon: Rocket,
        title: "A Complete Ecosystem",
        description: "Hamraz is not just an app; it's a self-reinforcing world of learning, creativity, community, and entrepreneurship."
    },
    {
        icon: Scaling,
        title: "Scalable Business Model",
        description: "With a gamified economy and a 70/30 revenue share with developers who promote Hamraz, we have a clear path to profitability and viral growth."
    },
    {
        icon: Users,
        title: "Community-Driven Growth",
        description: "Top app creators and land buyers join our Honorary Board and Policy Council with voting rights, ensuring our growth is aligned with the community's success."
    }
];

const roadmap = [
    {
        icon: Target,
        milestone: "100,000 Downloads",
        reward: "Launch of Hamraz's native in-app digital currency, giving real value to user-earned points."
    },
    {
        icon: Milestone,
        milestone: "500,000 Downloads",
        reward: "Implementation of a revenue-sharing model (30% of ad revenue) with top creators and loyal users, and formation of a community-led Advisory Council."
    },
     {
        icon: Banknote,
        milestone: "Native Currency Launch",
        reward: "Once 69% of the city's 1,300,000 m² of land is sold, the 'Capable City' will officially launch its own native currency ('Toman'), solidifying its independent economy."
    },
    {
        icon: Briefcase,
        milestone: "1 Million+ Downloads",
        reward: "Expansion of the job market and collaboration platform, positioning Hamraz as a key hub for creative and tech talent."
    }
];

const chartData = [
  { month: "Today", users: 1000 },
  { month: "6 Mo", users: 250000 },
  { month: "1 Year", users: 1000000 },
  { month: "2 Years", users: 5000000 },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--primary))",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

export default function InvestorsPage() {
  return (
    <div className="space-y-12">
        <header className="text-center space-y-4 pt-8">
            <div className="inline-block bg-primary/10 p-4 rounded-full">
                <DollarSign className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                Invest in the Future of Connection
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Hamraz is a strategic masterpiece designed for exponential growth. We are building a complete, self-sustaining digital ecosystem that empowers users and creates unprecedented value. We are seeking partners who share our vision.
            </p>
        </header>

        <section>
             <Card className="border-accent">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Map className="w-10 h-10 text-accent"/>
                        <div>
                             <CardTitle className="text-2xl font-headline text-accent">The Capable City: A Planned Digital Economy</CardTitle>
                             <CardDescription>An investment in a 1,300,000 m² virtual world with a well-defined economic structure designed for sustainable growth.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                   <p>
                        This is more than an investment in an app; it's an opportunity to own a piece of a new digital world. The Capable City is designed with a clear economic plan:
                   </p>
                   <ul>
                        <li><strong>Pre-Sale Land:</strong> 250,000 m² available for visionary investors.</li>
                        <li><strong>Strategic Partnership:</strong> 200,000 m² reserved for our key strategic partner, Firebase, to develop and expand the city's core infrastructure.</li>
                        <li><strong>User Empowerment:</strong> 100,000 m² allocated to give every new user a free plot of land, making them instant stakeholders in our world.</li>
                        <li><strong>Community Prizes:</strong> 50,000 m² reserved for high-value prizes and community lotteries to drive engagement.</li>
                        <li><strong>Grand Prize for Top Investors:</strong> An incredible **100,000 m²** to be distributed among the **top 10 land purchasers** in the first three months, creating a powerful incentive for initial investment.</li>
                         <li><strong>Referral Rewards:</strong> Every land buyer receives a unique referral code. For every new user who purchases land using their code, the referrer receives a special land bonus, promoting viral, community-driven growth.</li>
                         <li><strong>Remaining Land:</strong> 600,000 m² is reserved for public infrastructure, parks, commercial zones, and future development by the city's governing council.</li>
                   </ul>
                   <p>
                        This model transforms users into active landowners, motivated to build and enrich our shared world, creating a powerful and self-sustaining growth loop.
                   </p>
                </CardContent>
            </Card>
        </section>

        <Alert variant="default" className="border-primary/30 bg-primary/10">
            <Banknote className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">Accepted Currencies for Land Purchase</AlertTitle>
            <AlertDescription>
                All land purchases within the Capable City can only be made using Bitcoin, Tether (USDT), and other major cryptocurrencies. This ensures a secure, decentralized, and global transaction process for all our citizens.
            </AlertDescription>
        </Alert>

        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {keyFeatures.map((feature) => (
                    <Card key={feature.title} className="text-center shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="items-center">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <feature.icon className="w-8 h-8 text-primary" />
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
                <h2 className="text-3xl font-bold font-headline">Market Opportunity</h2>
                <p className="text-muted-foreground">The global market for social and educational apps is expanding rapidly. Hamraz is uniquely positioned to capture a significant share.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Projected User Growth</CardTitle>
                    <CardDescription>Based on our ecosystem model, we project exponential user acquisition and engagement.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                              tickFormatter={(value) => (value as number / 1000) + 'k'}
                            />
                            <Tooltip 
                                cursor={false} 
                                content={<ChartTooltipContent 
                                    formatter={(value) => value.toLocaleString()} 
                                    indicator="dot"
                                />} 
                            />
                            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </section>

        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">Our Strategic Roadmap</h2>
                <p className="text-muted-foreground">We have a clear, milestone-driven plan for growth and profitability.</p>
            </div>
             <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-1/2 before:w-0.5 before:bg-border before:-translate-x-1/2">
                 {roadmap.map((item, index) => (
                    <div key={item.milestone} className="relative">
                        <div className="flex items-center justify-center">
                             <div className="z-10 bg-background p-2 rounded-full border-2 border-primary">
                                <item.icon className="w-6 h-6 text-primary"/>
                            </div>
                        </div>
                        <Card className="max-w-md mx-auto mt-4">
                             <CardHeader>
                                <CardTitle>{item.milestone}</CardTitle>
                             </CardHeader>
                             <CardContent>
                                <p className="text-muted-foreground">{item.reward}</p>
                             </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </section>

        <section className="text-center">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">Meet the Visionaries</h2>
                <p className="text-muted-foreground">Our project is guided by a team of experts in technology, ethics, and education.</p>
            </div>
            <Link href="/board">
                <Button size="lg" variant="outline">
                    View Our Honorary Board <ArrowRight className="ml-2"/>
                </Button>
            </Link>
        </section>

        <section>
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                 <CardHeader className="text-center items-center">
                    <CardTitle className="text-3xl font-headline">Let's Build Together</CardTitle>
                    <CardDescription className="max-w-xl mx-auto">
                        Hamraz presents a rare opportunity to invest in a platform with a clear path to market leadership, a passionate user base, and a robust, diversified revenue model.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     <Link href="/collaborate">
                        <Button size="lg">
                            Contact Us for Partnership <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </section>

    </div>
  )
}
