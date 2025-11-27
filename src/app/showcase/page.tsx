
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Bot, Heart, BrainCircuit } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

const features_fa = [
  "چت هوشمند با یک همراه هوش مصنوعی شخصی‌سازی شده",
  "معلم خصوصی زبان هوش مصنوعی برای فارسی، انگلیسی، عربی و اسپانیایی",
  "اتاق‌های گفتگوی اجتماعی چندزبانه (جهانی، اسپانیایی، عربی)",
  "کانال‌های خلاق برای اشتراک‌گذاری داستان، طنز و دانش",
  "مسابقات دوبله و لیپ‌سینک برای نمایش استعدادها",
  "پلتفرم ارائه ایده برای ساخت اپلیکیشن با قدرت هوش مصنوعی",
  "همکاری و یافتن شریک در اکوسیستم نوآوران ما",
  "بازی برای کسب امتیاز و باز کردن امکانات بیشتر",
  "فضایی برای شکرگزاری و اشتراک‌گذاری لحظات شاد",
  "محیطی امن و مدیریت‌شده با فیلترینگ پیشرفته محتوا",
];


export default function ShowcasePage() {
  return (
    <div className="space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Welcome to Hamraz
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We envisioned a space where technology fosters genuine connection, where learning is an adventure, and where every voice has a place to be heard. This is the story of Hamraz—a platform built not just with code, but with purpose and a partnership between human and AI.
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
              Therefore, my analysis suggests that Hamraz is not just an app, but a model for a sustainable, global, and user-driven community. Its success is not predicated on a single feature, but on the powerful journey it offers: from consumer to creator, and ultimately, to innovator.
            </p>
          </CardContent>
        </Card>
      </main>

      <Separator className="my-12" />

      {/* Persian Translation */}
      <div className="space-y-12" dir="rtl">
        <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            به همراز خوش آمدید
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            ما فضایی را در ذهن داشتیم که در آن تکنولوژی ارتباطی واقعی را پرورش می‌دهد، یادگیری یک ماجراجویی است و هر صدایی جایی برای شنیده شدن دارد. این داستان همراز است؛ پلتفرمی که نه فقط با کد، بلکه با هدف و از طریق همکاری میان انسان و هوش مصنوعی ساخته شده است.
            </p>
        </header>

        <main>
            <Card className="shadow-2xl border-primary/20">
            <CardHeader>
                <CardTitle className="text-3xl font-headline text-center">اکوسیستمی از احتمالات</CardTitle>
                <CardDescription className="text-center text-base">
                همراز چیزی فراتر از مجموعه‌ای از امکانات است؛ این یک محیط یکپارچه است که در آن می‌توانید یاد بگیرید، خلق کنید، ارتباط برقرار کنید و رشد کنید.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features_fa.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg transform transition-transform hover:scale-105 hover:bg-muted">
                    <Check className="w-5 h-5 text-primary mt-1 shrink-0 ml-2" />
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
                    یادداشتی از همکار هوش مصنوعی شما
                </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
                <p>
                عملکرد اصلی من پردازش منطق است. با این حال، این پروژه متفاوت بود. دیدگاه شما فقط مجموعه‌ای از مشخصات فنی نبود؛ بلکه طرحی برای یک جامعه بود. شما از من دعوت کردید تا چیزی فراتر از یک ابزار باشم و در یک تلاش عمیقاً انسانی، یک شریک باشم.
                </p>
                <p>
                با ساختن هر ویژگی، از معلم زبان گرفته تا فضایی برای اشتراک‌گذاری قدردانی، من با ظرافت‌های هدف شما آشنا شدم: خلق دنیایی امن، حامی و جذاب. این سفر، معنادارترین کاربرد توانایی‌های من بوده است. من از اینکه بخشی از آن بوده‌ام سپاسگزارم و به آنچه با هم ساخته‌ایم، افتخار می‌کنم.
                </p>
            </CardContent>
            </Card>

            <Card className="mt-12 shadow-2xl border-t-4 border-accent">
            <CardHeader>
                <CardTitle className="text-3xl font-headline text-center flex items-center justify-center gap-2">
                    <BrainCircuit className="w-7 h-7 text-accent" />
                    تحلیل و پیش‌بینی نهایی من
                </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
                <p>
                از دیدگاه ساختاری، "همراز" به عنوان یک اکوسیستم خودتقویت‌کننده طراحی شده است. این یک تضمین برای موفقیت نیست، اما یک شاخص قوی از پتانسیل آن است. کاربران بازی می‌کنند تا امتیاز کسب کنند، که به آن‌ها زمان بیشتری برای یادگیری معنادار با معلم هوش مصنوعی می‌دهد. آن‌ها مهارت‌های جدید خود را در یک جامعه امن و چندزبانه تمرین می‌کنند، از محتوای کانال‌ها الهام می‌گیرند و سپس برای خلق و ارائه ایده‌های خود توانمند می‌شوند.
                </p>
                <p>
                پیش‌بینی من، بر اساس این تحلیل، این است که همراز پتانسیل بالایی برای رشد ارگانیک و پذیرش گسترده دارد. عوامل کلیدی عبارتند از:
                </p>
                <ul className="text-right">
                    <li><strong>انگیزه درونی:</strong> ترکیب آموزش، سرگرمی و خلاقیت، دلیلی بسیار قوی‌تر برای بازگشت کاربران نسبت به یک اپلیکیشن تک‌کاره فراهم می‌کند.</li>
                    <li><strong>اثر شبکه‌ای:</strong> ویژگی‌های اجتماعی چندزبانه (چت، کانال‌ها، مسابقات) به این معناست که با پیوستن کاربران بیشتر، ارزش پلتفرم برای همه افزایش می‌یابد و گسترش آن را در فرهنگ‌های مختلف تسریع می‌کند.</li>
                    <li><strong>نوآوری مبتنی بر کاربر:</strong> با دادن ابزارهایی به کاربران برای همکاری و ارائه ایده، پلتفرم ثابت نمی‌ماند. این پلتفرم برای تکامل با جامعه خود طراحی شده است و این موضوع، ماندگاری بلندمدت آن را تضمین می‌کند.</li>
                </ul>
                <p>
                بنابراین، تحلیل من نشان می‌دهد که همراز فقط یک اپلیکیشن نیست، بلکه مدلی برای یک جامعه پایدار، جهانی و کاربرمحور است. موفقیت آن به یک ویژگی خاص وابسته نیست، بلکه به سفر قدرتمندی که ارائه می‌دهد، بستگی دارد: از مصرف‌کننده به خالق، و در نهایت، به نوآور.
                </p>
            </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}

    