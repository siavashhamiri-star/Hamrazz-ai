
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
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Gift, Share2, LandPlot, Coins, Trophy, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const socialPlatforms = [
  { name: 'Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' },
  { name: 'Twitter', url: 'https://twitter.com/intent/tweet?url=' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/shareArticle?mini=true&url=' },
  { name: 'Reddit', url: 'https://www.reddit.com/submit?url=' },
  { name: 'WhatsApp', url: 'https://api.whatsapp.com/send?text=' },
];


export default function ReferralsPage() {
    const { user } = useUser();
    const { userProfile } = useUserProfile(user?.uid);
    const { toast } = useToast();

    // In a real app, this would be a unique code generated for the user
    const referralCode = user ? `HAMRAZ-${user.uid.substring(0, 8).toUpperCase()}` : 'SIGN-IN-TO-GET-CODE';
    const appUrl = "https://hamraz.ai"; // Replace with your actual app URL
    const shareText = `Join me on Hamraz, the app that empowers creators! Use my code ${referralCode} to get started.`;
    const shareUrl = `${appUrl}?ref=${referralCode}`;

    const handleCopyCode = () => {
        if (!user) return;
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Code Copied!",
            description: "Your referral code has been copied to your clipboard.",
        });
    }

    const handleShare = (platformUrl: string) => {
        const url = platformUrl + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(shareText);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-8">
            <Alert variant="default" className="bg-primary/10 border-primary/30">
                <Gift className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Share & Earn: A Gift from the Creator</AlertTitle>
                <AlertDescription>
                    We believe our community is our greatest strength. To show our appreciation, we are rewarding users who help us grow. Introduce Hamraz to your friends and followers on social media and earn valuable rewards for your contributions. Your voice helps us build the future.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-accent/10 border-accent/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-accent"><Coins/> Points Reward</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">For every new user who signs up using your referral code, you'll receive <span className="font-bold text-accent-foreground">500 points</span>. These points help you unlock premium features and climb the leaderboards.</p>
                    </CardContent>
                </Card>
                 <Card className="bg-accent/10 border-accent/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-accent"><LandPlot/> Land Gift</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">For every 10 successful referrals, you will be gifted <span className="font-bold text-accent-foreground">1 square meter of land</span> in the Capable City, making you a true owner in our digital world.</p>
                    </CardContent>
                </Card>
            </div>

             <Alert variant="destructive">
                <Trophy className="h-4 w-4" />
                <AlertTitle>Premier Referral League</AlertTitle>
                <AlertDescription>
                    This is a special league for our top promoters with a clear path to governance and rewards.
                    <ul className="list-disc list-inside mt-2 space-y-2">
                        <li><strong>Qualification:</strong> Users who successfully refer at least **10 new members** will automatically qualify for the Premier Referral League.</li>
                        <li><strong>League Activation:</strong> The league officially begins once a minimum of **50 members** have qualified.</li>
                        <li><strong>Board of Trustees:</strong> Every **40 days**, the top two performers in the league will be elected to a Board of Trustees, which will be responsible for overseeing prize distribution and policy.</li>
                        <li><strong>Cash Prizes (Activates at 20,000 Downloads):</strong> Once the app reaches 20,000 downloads, valuable cash prizes will be awarded to the top 5 league members based on their rank. Additionally, one special prize will be raffled randomly among all other league participants to keep the excitement alive for everyone.</li>
                    </ul>
                </AlertDescription>
            </Alert>

            <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="font-bold text-yellow-600 dark:text-yellow-400">A Super Surprise is Coming!</AlertTitle>
                <AlertDescription>
                    Once Hamraz reaches **50,000 downloads**, a super surprise will be awarded to **all members of the Referral League** to thank them for their incredible efforts. We want you to help us decide what this prize should be! What amazing reward do you think is worthy of our top promoters? Share your ideas in the community chat!
                </AlertDescription>
            </Alert>

            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Your Referral Code</CardTitle>
                    <CardDescription>Share this code with your friends. They get a bonus, and you get rewarded!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 border-2 border-dashed p-4 rounded-lg w-full max-w-md justify-center">
                        <span className="text-2xl font-mono tracking-widest text-primary font-bold">{referralCode}</span>
                        <Button variant="ghost" size="icon" onClick={handleCopyCode} disabled={!user}>
                            <Copy className="h-5 w-5"/>
                        </Button>
                    </div>
                    {!user && <p className="text-sm text-destructive">Please sign in to view your referral code.</p>}
                </CardContent>
                <CardFooter className="flex-col items-center gap-4">
                     <p className="text-sm text-muted-foreground">Share directly on your favorite platforms:</p>
                     <div className="flex flex-wrap justify-center gap-2">
                        {socialPlatforms.map(platform => (
                            <Button key={platform.name} variant="outline" onClick={() => handleShare(platform.url)} disabled={!user}>
                                <Share2 className="mr-2 h-4 w-4"/> {platform.name}
                            </Button>
                        ))}
                     </div>
                </CardFooter>
            </Card>
        </div>
    );
}
