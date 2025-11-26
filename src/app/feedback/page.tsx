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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { useUser } from "@/firebase";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, you would send this to your backend (e.g., a Firestore collection)
    console.log("Feedback submitted:", {
      userId: user?.uid || "anonymous",
      feedback,
      timestamp: new Date().toISOString(),
    });

    setIsLoading(false);
    setFeedback("");
    toast({
      title: "Thank you for your feedback!",
      description: "We appreciate you taking the time to share your thoughts.",
    });
  };

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Share Your Feedback
          </CardTitle>
          <CardDescription>
            Have an idea or found a bug? Let us know! We value your input to
            make Hamraz AI better for everyone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={
              user
                ? "Tell us what you think..."
                : "Please sign in to submit feedback."
            }
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[150px] text-base"
            disabled={!user || isLoading}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!user || isLoading || !feedback.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
