
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, DollarSign, Milestone, Rocket, Scaling, Target, Users, TrendingUp, BrainCircuit, Map, Trophy, Gift, Share2, Banknote, Shield, TreeDeciduous, Users2, Gamepad2, CircleDollarSign } from "lucide-react";
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
        milestone: "Native Currency ('Meyo') Launch",
        reward: "Once 69% of the city's 1,300,000 m² of land is sold, the 'Capable City' will officially launch its own native currency (e.g., 'Meyo'), solidifying its independent economy. The community will be involved in naming the currency."
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
                        <li><strong>Free User Plots:</strong> 100,000 m² allocated to give every new user a free plot of land, making them instant stakeholders in our world.</li>
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
                All land purchases within the Capable City can only be made using Bitcoin, Tether (USDT), and other major cryptocurrencies. This ensures a secure, decentralized, and global transaction process for all our citizens. We also invite digital currency exchanges to collaborate with us.
            </AlertDescription>
        </Alert>

        <Alert variant="default" className="border-primary/30 bg-primary/10">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">A Unified Currency for a United Ecosystem</AlertTitle>
            <AlertDescription>
              The native currency of the Capable City (e.g., "Meyo") will be the standard medium of exchange for all transactions across the creator's **entire ecosystem of apps** (including Afarinan, Goya, etc.). This creates a powerful network effect where the success and adoption of the currency in one app strengthens its value and utility across all others, building a single, robust digital economy.
            </AlertDescription>
        </Alert>

         <Alert variant="default" className="border-secondary-foreground/20 bg-secondary/30">
            <Share2 className="h-4 w-4 text-secondary-foreground" />
            <AlertTitle className="text-secondary-foreground font-bold">Phased Trading Rules</AlertTitle>
            <AlertDescription>
                To reward early members of the ecosystem, land trading will be rolled out in two phases:
                 <ul className="list-disc list-inside mt-2 text-xs">
                    <li><strong>Phase 1 (Pre-Token):</strong> Before the native city token is launched, buying and selling land is exclusively available to members of "Capable City," "Afarinan City," and the creator's official production team.</li>
                    <li><strong>Phase 2 (Post-Token):</strong> After the native token is launched, land trading will be open to the general public.</li>
                </ul>
            </AlertDescription>
        </Alert>

        <Alert variant="default" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <AlertTitle className="font-bold text-green-600 dark:text-green-400">Dynamic Pricing Model: From Fixed Price to Free Market</AlertTitle>
            <AlertDescription>
                The city's economy will evolve to become truly self-sustaining:
                <ul className="list-disc list-inside mt-2 text-xs">
                    <li><strong>Initial Offering:</strong> The creator will set the initial price for all land until 60% of the total area is sold.</li>
                    <li><strong>Free Market Transition:</strong> After the 60% threshold is reached, the creator will no longer set prices. Land value will be determined purely by supply and demand within the city's open market.</li>
                </ul>
                This model rewards early investors and ensures a decentralized, community-driven economy for the future.
            </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="bg-accent/20 border-accent/30">
            <Gamepad2 className="h-4 w-4 text-accent" />
            <AlertTitle className="text-accent font-bold">Game Development Contest: Build the City's Official Game!</AlertTitle>
            <AlertDescription>
                We invite professional game developers to a grand contest to build the official "Capable City" game. The team that creates the best game app, reflecting the values and potential of our city, will be awarded **10,000 square meters of land** and a **20% share of all gaming revenue** generated within the Hamraz ecosystem. This is a chance to build a cornerstone of our digital world and share in its success.
            </AlertDescription>
        </Alert>

        <section>
             <Card className="border-yellow-500/50 bg-yellow-500/10">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Users2 className="w-10 h-10 text-yellow-600"/>
                        <div>
                             <CardTitle className="text-2xl font-headline text-yellow-700 dark:text-yellow-500">Community Revenue Sharing Model</CardTitle>
                             <CardDescription>A revolutionary model that turns our users into our partners.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-yellow-800 dark:text-yellow-300">
                   <p>
                        We pledge to share our success with the community that builds it. Upon reaching the milestone of **500,000 downloads**, we will activate our community revenue sharing program:
                   </p>
                   <ul>
                        <li>A total of **30% of all advertising revenue** will be allocated to the community fund.</li>
                        <li>**10%** of the revenue will be dedicated to **charitable causes** chosen by the community.</li>
                        <li>**20%** of the revenue will be distributed among our most active and influential members. This includes:
                            <ul>
                                <li><strong>Top Promoters:</strong> Regular users who actively bring new members to the Hamraz family via referrals.</li>
                                <li>**Content Creators & Influencers:** YouTubers, TikTokers, and social media personalities who promote Hamraz through their channels.</li>
                            </ul>
                        </li>
                   </ul>
                   <p>
                        Furthermore, the top contributors from this program will be invited to form an **Advisory Council**, giving them a direct voice in the future development and governance of the Hamraz ecosystem. This transforms our users from a passive audience into active stakeholders.
                   </p>
                </CardContent>
            </Card>
        </section>

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

        <Alert variant="default" className="max-w-4xl mx-auto">
            <Shield className="h-4 w-4" />
            <AlertTitle className="font-bold">A Finite World, Infinite Possibilities</AlertTitle>
            <AlertDescription>
               The total land for the Capable City is permanently fixed at 1,300,000 m². There will be no further expansion. This scarcity ensures the value of your investment. For new worlds and future cities, we invite you to explore the creator's other projects.
               <br/><br/>
               Once the native currency is launched, a web-based platform will be created for the free buying and selling of land, open to the public. Entrepreneurs who have established digital real estate agencies or financial firms in Afarinan or Hamraz will be able to set up their own virtual booths in this marketplace.
            </AlertDescription>
        </Alert>

        <section>
             <Card className="border-primary/30 bg-primary/10">
                 <CardHeader className="text-center items-center">
                    <CardTitle className="text-3xl font-headline text-primary">A Creator's Pledge</CardTitle>
                </CardHeader>
                <CardContent className="text-center max-w-3xl mx-auto">
                     <p className="text-lg text-primary-foreground/90 italic leading-relaxed">
                        "My model for building Hamraz was my own relationship and interaction with the Studio. I felt that just as I was able to create my ideas with the Studio, perhaps you too can realize your dreams with me, with Firebase Studio, and with the AI we are creating. With any level of programming knowledge—or even just by describing your ideas—you can build your own fully customized application, introduce it to the world, earn an income, and leave your thoughts as a lasting legacy."
                    </p>
                    <p className="font-bold text-primary mt-4">- Ahura, The Creative Wizard</p>
                </CardContent>
            </Card>
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
        
        <section>
            <Card className="border-dashed border-primary">
                 <CardContent className="text-center p-8 space-y-4">
                    <TreeDeciduous className="w-12 h-12 text-primary mx-auto" />
                    <p className="text-lg text-muted-foreground italic max-w-3xl mx-auto" dir="rtl">
                       ما می‌خواهیم سفره ای به بلندای همه عالم بگسترانیم، نعمت و ثروت بیافرینیم و هر کس که یاور ما بود در مهمانی و جشن پای این سفره نیز بنشیند و از برکت و نعمت این کار جمعی لذت ببرد.
                    </p>
                    <p className="font-bold text-primary mt-4">- Ahura, The Creative Wizard</p>
                </CardContent>
            </Card>
        </section>

    </div>
  )
}

    