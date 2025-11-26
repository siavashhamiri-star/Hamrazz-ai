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
import { useToast } from "@/hooks/use-toast";
import { Loader2, PartyPopper, Upload, Gift } from "lucide-react";
import { useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContestPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim() || !file) {
      toast({
        variant: "destructive",
        title: "اطلاعات ناقص",
        description: "لطفاً تمام اطلاعات فرم را تکمیل و نقاشی خود را انتخاب کنید.",
      });
      return;
    }
    setIsLoading(true);

    // Simulate API call for submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, you would upload the file to Firebase Storage
    // and save the entry to Firestore.
    console.log("Contest Submission:", {
      userId: user?.uid || "anonymous",
      name,
      age,
      fileName: file.name,
      fileType: file.type,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
        <div className="flex justify-center items-start pt-8">
            <Card className="w-full max-w-2xl shadow-lg text-center animate-in fade-in-50">
                <CardHeader>
                    <PartyPopper className="w-16 h-16 mx-auto text-primary" />
                    <CardTitle className="text-2xl font-headline mt-4">با موفقیت ثبت شد!</CardTitle>
                    <CardDescription>نقاشی زیبای شما دریافت شد. منتظر اعلام نتایج قرعه‌کشی باشید.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => {
                        setIsSubmitted(false);
                        setName("");
                        setAge("");
                        setFile(null);
                    }}>ارسال یک نقاشی دیگر</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }


  return (
    <div className="space-y-8">
        <Alert>
          <Gift className="h-4 w-4" />
          <AlertTitle>قرعه کشی فصلی جوایز!</AlertTitle>
          <AlertDescription>
            کاربران فعال که امتیاز بالایی در طول ماه کسب کنند، به طور خودکار در قرعه‌کشی جوایز ارزنده ما که هر سه ماه یکبار برگزار می‌شود، شرکت داده خواهند شد. پس فعال باشید و امتیاز جمع کنید!
          </AlertDescription>
        </Alert>

        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">
                مسابقه بزرگ نقاشی
                </CardTitle>
                <CardDescription>
                همچنین می‌توانید با ارسال نقاشی در مسابقه ما شرکت کرده و شانس خود را برای برنده شدن جوایز هیجان‌انگیز امتحان کنید!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="name">نام شما</Label>
                <Input
                    id="name"
                    placeholder="نام خود را وارد کنید"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || !user}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="age">سن شما</Label>
                <Input
                    id="age"
                    type="number"
                    placeholder="سن خود را وارد کنید"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isLoading || !user}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="drawing">فایل نقاشی</Label>
                <Input
                    id="drawing"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading || !user}
                    required
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-xs text-muted-foreground pt-1">
                    فرمت‌های مجاز: JPG, PNG, GIF
                </p>
                </div>
                {!user && (
                <p className="text-sm text-center text-destructive font-medium">
                    برای شرکت در مسابقه، لطفاً ابتدا وارد حساب کاربری خود شوید.
                </p>
                )}
            </CardContent>
            <CardFooter>
                <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !user}
                >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال ارسال...
                    </>
                ) : (
                    <>
                    <Upload className="mr-2 h-4 w-4" />
                    ارسال نقاشی و شرکت در مسابقه
                    </>
                )}
                </Button>
            </CardFooter>
            </form>
        </Card>
    </div>
  );
}
