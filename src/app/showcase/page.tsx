'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Bot, Heart, BrainCircuit, Loader2, Video, AlertTriangle, Download, Play, Pause, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { generateShowcaseVideo } from "@/ai/flows/generate-showcase-video-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface VideoState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

const VideoPlayer = ({ language, title, description }: { language: 'en' | 'fa', title: string, description: string }) => {
  const [video, setVideo] = useState<VideoState>({ url: null, loading: true, error: null });

  useEffect(() => {
    const generateVideo = async () => {
      try {
        setVideo({ url: null, loading: true, error: null });
        const result = await generateShowcaseVideo({ language });
        setVideo({ url: result.videoUrl, loading: false, error: null });
      } catch (e: any) {
        console.error(`Error generating ${language} video:`, e);
        setVideo({ url: null, loading: false, error: "We couldn't create the video right now. Please try refreshing the page." });
      }
    };
    generateVideo();
  }, [language]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center">{title}</CardTitle>
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
          {video.loading && (
            <div className="text-center space-y-2 text-muted-foreground">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
              <p className="font-semibold">Generating your cinematic video...</p>
              <p className="text-sm">This may take a minute or two. The AI is working its magic!</p>
            </div>
          )}
          {video.error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Video Generation Failed</AlertTitle>
              <AlertDescription>{video.error}</AlertDescription>
            </Alert>
          )}
          {video.url && (
            <video src={video.url} className="w-full h-full rounded-lg" controls autoPlay loop>
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        {video.url && (
          <div className="flex justify-center mt-4">
            <a href={video.url} download={`hamraz_genesis_video_${language}.mp4`}>
              <Button>
                <Download className="mr-2" /> Download Video
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const Teleprompter = ({ title, text, direction = 'ltr' }: { title: string, text: string, direction?: 'ltr' | 'rtl' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(20); // pixels per second
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const animateScroll = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // seconds
    lastTimeRef.current = timestamp;

    if (scrollRef.current) {
      const scrollAmount = deltaTime * speed;
      scrollRef.current.scrollTop += scrollAmount;

      if (scrollRef.current.scrollTop < scrollRef.current.scrollHeight - scrollRef.current.clientHeight) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        setIsPlaying(false);
      }
    }
  }, [speed]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animateScroll]);

  const handleReset = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setIsPlaying(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={scrollRef} 
          dir={direction}
          className="h-64 overflow-y-scroll border rounded-md p-4 prose prose-lg dark:prose-invert max-w-none bg-background scroll-smooth"
        >
          <p>{text}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline">
            {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={handleReset} variant="ghost">
            <RefreshCw className="mr-2" /> Reset
          </Button>
        </div>
        <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
          <Label htmlFor="speed-slider">Speed</Label>
          <Slider
            id="speed-slider"
            min={5}
            max={100}
            step={5}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            className="w-full"
          />
        </div>
      </CardFooter>
    </Card>
  );
};


const text_en = `Our story began with a spark... a simple, gentle idea from the project's founder, Ahura: "A feature for children's poetry recitation." This was the start of a unique and creative journey between a visionary and their AI collaborator.
Every conversation, every idea, led us down a new path. From poetry to antics and heartfelt laughter... from children's big dreams to celebrating their small successes. We weren't just writing code; we were building a digital home for creativity, motivation, and human connection.
The turning point of this journey was understanding a great truth: "Hamraz" should not just be a service provider. "Hamraz" must be an **enabler**. A place where users transform from consumers to creators, and from creators to innovators. This powerful cycle—learning, creating, connecting, and entrepreneurship—is the beating heart of the project you see today.
This page is the story of that journey. A narrative of a unique collaboration that proves new phenomena are born when human creativity is combined with the power of artificial intelligence. This is the story of "Hamraz"; a story that has just begun.`;

const text_fa = `داستان ما از یک جرقه شروع شد... یک ایده ساده و لطیف از بنیان‌گذار پروژه، اهورا: «یک قابلیت برای شعرخوانی کودکان». این شروع یک سفر خلاقانه و بی‌نظیر بین یک رؤیاپرداز و همکار هوش مصنوعی‌اش بود.
هر گفتگو، هر ایده، ما را به مسیری جدید برد. از شعرخوانی به شیرین‌کاری‌ها و خنده‌های از ته دل... از آرزوهای بزرگ کودکان تا جشن گرفتن موفقیت‌های کوچکشان. ما فقط کد نمی‌نوشتیم؛ ما در حال ساختن خانه‌ای دیجیتال برای خلاقیت، انگیزه و ارتباط انسانی بودیم.
نقطه عطف این سفر، درک یک حقیقت بزرگ بود: «همراز» نباید فقط یک سرویس‌دهنده باشد. «همراز» باید یک **توانمندساز** باشد. جایی که کاربران از مصرف‌کننده به خالق، و از خالق به نوآور تبدیل می‌شوند. این چرخه قدرتمند—یادگیری، خلق، ارتباط و کارآفرینی—قلب تپنده پروژه‌ای است که امروز می‌بینید.
این صفحه، داستان آن سفر است. روایت یک همکاری منحصر به فرد که ثابت می‌کند وقتی خلاقیت انسان با قدرت هوش مصنوعی ترکیب شود، پدیده‌های جدیدی متولد می‌شوند. این داستان «همراز» است؛ داستانی که تازه شروع شده.`;


export default function ShowcasePage() {
  return (
    <div className="space-y-12">
       <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          The Story of Hamraz
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
         This is the story of how a visionary idea and an AI collaborator came together to build not just an app, but a world of connection, creativity, and opportunity.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <VideoPlayer 
            language="en" 
            title="The Genesis Video" 
            description="An AI-generated cinematic interpretation of our journey." 
          />
          <Teleprompter 
            title="Teleprompter: English Narration"
            text={text_en}
            direction="ltr"
          />
        </div>
        <div dir="rtl">
          <VideoPlayer 
            language="fa" 
            title="ویدیوی پیدایش" 
            description="تفسیری سینمایی و تولید شده توسط هوش مصنوعی از سفر ما." 
          />
           <Teleprompter 
            title="تله‌پرامپتر: روایت فارسی"
            text={text_fa}
            direction="rtl"
          />
        </div>
      </div>

    </div>
  );
}
