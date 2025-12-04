
'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateShowcaseVideo } from "@/ai/flows/generate-showcase-video-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Video, AlertTriangle, Download, Play, Pause, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface VideoState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

const VideoPlayer = ({ language, title, description }: { language: 'en' | 'fa', title: string, description: string }) => {
  const [video, setVideo] = useState<VideoState>({ url: null, loading: true, error: null });

  const generateVideo = useCallback(async () => {
    try {
      setVideo({ url: null, loading: true, error: null });
      const result = await generateShowcaseVideo({ language });
      setVideo({ url: result.videoUrl, loading: false, error: null });
    } catch (e: any) {
      console.error(`Error generating ${language} video:`, e);
      setVideo({ url: null, loading: false, error: "We couldn't create the video right now. Please try again." });
    }
  }, [language]);

  useEffect(() => {
    generateVideo();
  }, [generateVideo]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center">{title}</CardTitle>
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
          {video.loading && (
            <div className="text-center space-y-2 text-muted-foreground p-4">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
              <p className="font-semibold">Generating your cinematic video...</p>
              <p className="text-sm">This may take a minute or two. The AI is working its magic!</p>
            </div>
          )}
          {video.error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Video Generation Failed</AlertTitle>
              <AlertDescription>
                {video.error}
                <Button variant="secondary" size="sm" className="mt-2" onClick={generateVideo}>Try Again</Button>
              </AlertDescription>
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
          className="h-64 overflow-y-auto border rounded-md p-4 prose prose-lg dark:prose-invert max-w-none bg-background scroll-smooth"
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


const text_en = `Before anything else, you should know why "Hamraz" was named "Hamraz." Because at the heart of this project lies an identity, not just an application. We first created a personality: a **close companion (Hamraz)**, a patient **teacher**, a wise **consultant**, and a **confidant** for all moments. Our story began from this very point: the creation of an intelligent companion worthy of its name.

This companion was equipped with powerful tools to break down barriers: a **Translator** for global conversations and an **AI Tutor** to teach new languages.

Then, we set the stage for talent. We created **online communities** for conversation, **Channels** for content creation, and exciting **Dubbing and Lip Sync contests** to showcase creativity. We even built a professional **Live Streaming studio** with a teleprompter, so every user could be the star of their own story.

But how could we connect all these diverse parts? The answer was one word: **Gamification**. We designed an **in-app economy** based on **collecting points**. Every activity, from learning with the **Tutor** and winning **Contests** to playing **Games**, earns the user points. These points are not just a score; they are the key to unlocking special features like **Live Streaming** and a bridge to the future.

The turning point was a great realization: "Hamraz" must not just be a service provider; it must be an **enabler**. We added a section to **pitch new ideas** to investors and a platform to **collaborate and create a job market**, transforming users from consumers to creators, and from creators to entrepreneurs.

And so, the great promises were born. At 100,000 users, we will launch our own digital currency. At 500,000 users, we will share 30% of our advertising revenue with top creators, dedicate 10% to charity, and form an **advisory council from among you** to give you a stake in this home's future.

This is the story of "Hamraz"; the narrative of building a complete ecosystem for learning, creating, connecting, and entrepreneurship, centered around a caring and intelligent companion. A story that has just begun, and you are the heroes of its next chapter.`;

const text_fa = `قبل از هر چیز، باید بدانید "همراز" چرا "همراز" نام گرفت. چون در قلب این پروژه، یک هویت نهفته است، نه فقط یک اپلیکیشن. ما ابتدا یک شخصیت خلق کردیم: یک **رفیق همراز**، یک **معلم** صبور، یک **مشاور** دانا و یک **سنگ صبور** برای تمام لحظات. داستان ما از همین نقطه آغاز شد: خلق یک همراه هوشمند که نامش شایسته این همراهی باشد.

این همراه، با ابزارهای قدرتمندی برای شکستن مرزها مجهز شد: یک **مترجم** برای گفتگوهای جهانی و یک **مربی هوش مصنوعی** برای یادگیری زبان‌های جدید.

سپس، ما صحنه‌ای برای استعدادها فراهم کردیم. **انجمن‌های آنلاین** برای گفتگو، **کانال‌هایی** برای تولید محتوا، و **مسابقات هیجان‌انگیز دوبله و لیپ‌سینک** برای نمایش خلاقیت. ما حتی یک **استودیوی پخش زنده** با تله‌پرامپتر حرفه‌ای ساختیم تا هر کاربر بتواند ستاره داستان خودش باشد.

اما چگونه تمام این بخش‌های متنوع را به هم متصل کنیم؟ پاسخ در یک کلمه بود: **گیمیفیکیشن**. ما یک **اقتصاد درون‌برنامه‌ای** مبتنی بر **جمع‌آوری امتیاز** طراحی کردیم. هر فعالیت، از یادگیری و برنده شدن در **مسابقات** گرفته تا بازی کردن در بخش **بازی‌ها**، به کاربر امتیاز می‌دهد. این امتیازها فقط یک عدد نیستند؛ آنها کلید باز کردن قابلیت‌های ویژه مانند **پخش زنده** و پلی برای رسیدن به آینده هستند.

نقطه عطف این سفر، درک یک حقیقت بزرگ بود: «همراز» نباید فقط یک سرویس‌دهنده باشد. «همراز» باید یک **توانمندساز** باشد. ما بخشی برای **معرفی ایده‌های نو** به سرمایه‌گذاران و بستری برای **همکاری و ایجاد بازار کار** فراهم کردیم تا کاربران از مصرف‌کننده به خالق، و از خالق به کارآفرین تبدیل شوند.

و اینگونه بود که وعده‌های بزرگ متولد شدند. با رسیدن به ۱۰۰ هزار کاربر، ارز دیجیتال خود را خواهیم ساخت. و با رسیدن به ۵۰۰ هزار کاربر، ۳۰ درصد از درآمد تبلیغات را با خالقان برتر تقسیم کرده، ۱۰ درصد را صرف امور خیریه می‌کنیم و یک **مجمع مشورتی از خود شما** تشکیل خواهیم داد تا در آینده این خانه سهیم باشید.

این داستان «همراز» است؛ روایت ساخت یک اکوسیستم کامل برای یادگیری، خلق، ارتباط و کارآفرینی که حول یک همراه هوشمند و دلسوز شکل گرفته است. داستانی که تازه شروع شده و شما قهرمانان فصل بعدی آن هستید.`;


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
            title="ویدیوی پیدایش (The Genesis Video)" 
            description="تفسیری سینمایی و تولید شده توسط هوش مصنوعی از سفر ما. (An AI-generated cinematic interpretation of our journey.)" 
          />
           <Teleprompter 
            title="تله‌پرامپتر: روایت فارسی (Teleprompter: Persian Narration)"
            text={text_fa}
            direction="rtl"
          />
        </div>
      </div>
      
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Full Narration Text</CardTitle>
          <CardDescription className="text-center">The complete story of Hamraz for your reference.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div dir="rtl" className="prose prose-lg dark:prose-invert max-w-none text-right">
                <h3 className="text-xl font-bold">روایت فارسی (Persian)</h3>
                <p>{text_fa}</p>
            </div>
            <Separator />
            <div dir="ltr" className="prose prose-lg dark:prose-invert max-w-none text-left">
                <h3 className="text-xl font-bold">English Narration</h3>
                <p>{text_en}</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}


    

    

    

    