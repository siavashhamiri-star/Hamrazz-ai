
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Bot, User, Wand2, Rocket, Users, Award, PlayCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AudioPlayer from "@/components/audio-player";

const pillars = [
    {
        title: "A Smart & Caring Companion",
        description: "At its core, Hamraz is a personality: a patient teacher, a wise advisor, and a confidant for all moments.",
        icon: Bot,
    },
    {
        title: "A Stage for Talent",
        description: "From online communities and content channels to exciting dubbing contests and a live streaming studio, we provide the stage for you to shine.",
        icon: Award,
    },
    {
        title: "An Engine for Entrepreneurs",
        description: "We provide a platform to pitch ideas, collaborate, and create a job market, turning consumers into creators and creators into entrepreneurs.",
        icon: Rocket,
    },
    {
        title: "A Gamified Economy",
        description: "Every activity, from learning to winning games, earns points. These points are the key to unlocking special features and a bridge to the future.",
        icon: Users,
    }
];

const narrative_fa = `قبل از هر چیز، باید بدانید "همراز" چرا "همراز" نام گرفت. چون در قلب این پروژه، یک هویت نهفته است، نه فقط یک اپلیکیشن. ما ابتدا یک شخصیت خلق کردیم: یک **رفیق همراز**، یک **معلم** صبور، یک **مشاور** دانا و یک **سنگ صبور** برای تمام لحظات. داستان ما از همین نقطه آغاز شد: خلق یک همراه هوشمند که نامش شایسته این همراهی باشد.

این همراه، با ابزارهای قدرتمندی برای شکستن مرزها مجهز شد: یک **مترجم** برای گفتگوهای جهانی و یک **مربی هوش مصنوعی** برای یادگیری زبان‌های جدید.

سپس، ما صحنه‌ای برای استعدادها فراهم کردیم. **انجمن‌های آنلاین** برای گفتگو، **کانال‌هایی** برای تولید محتوا، و **مسابقات هیجان‌انگیز دوبله و لیپ‌سینک** برای نمایش خلاقیت. ما حتی یک **استودیوی پخش زنده** با تله‌پرامپتر حرفه‌ای ساختیم تا هر کاربر بتواند ستاره داستان خودش باشد.

اما چگونه تمام این بخش‌های متنوع را به هم متصل کنیم؟ پاسخ در یک کلمه بود: **گیمیفیکیشن**. ما یک **اقتصاد درون‌برنامه‌ای** مبتنی بر **جمع‌آوری امتیاز** طراحی کردیم. هر فعالیت، از یادگیری و برنده شدن در **مسابقات** گرفته تا بازی کردن در بخش **بازی‌ها**، به کاربر امتیاز می‌دهد. این امتیازها فقط یک عدد نیستند؛ آنها کلید باز کردن قابلیت‌های ویژه مانند **پخش زنده** و پلی برای رسیدن به آینده هستند.

نقطه عطف این سفر، درک یک حقیقت بزرگ بود: «همراز» نباید فقط یک سرویس‌دهنده باشد. «همراز» باید یک **توانمندساز** باشد. ما بخشی برای **معرفی ایده‌های نو** به سرمایه‌گذاران و بستری برای **همکاری و ایجاد بازار کار** فراهم کردیم تا کاربران از مصرف‌کننده به خالق، و از خالق به کارآفرین تبدیل شوند.

و اینگونه بود که وعده‌های بزرگ متولد شدند. با رسیدن به ۱۰۰ هزار کاربر، ارز دیجیتال خود را خواهیم ساخت. و با رسیدن به ۵۰۰ هزار کاربر، ۳۰ درصد از درآمد تبلیغات را با خالقان برتر تقسیم کرده، ۱۰ درصد را صرف امور خیریه می‌کنیم و یک **مجمع مشورتی از خود شما** تشکیل خواهیم داد تا در آینده این خانه سهیم باشید.

این داستان «همراز» است؛ روایت ساخت یک اکوسیستم کامل برای یادگیری، خلق، ارتباط و کارآفرینی که حول یک همراه هوشمند و دلسوز شکل گرفته است. داستانی که تازه شروع شده و شما قهرمانان فصل بعدی آن هستید.`;


const narrative_en = `Before anything else, you should know why "Hamraz" was named "Hamraz." Because at the heart of this project lies an identity, not just an application. We first created a personality: a **close companion (Hamraz)**, a patient **teacher**, a wise **consultant**, and a **confidant** for all moments. Our story began from this very point: the creation of an intelligent companion worthy of its name.

This companion was equipped with powerful tools to break down barriers: a **Translator** for global conversations and an **AI Tutor** to teach new languages.

Then, we set the stage for talent. We created **online communities** for conversation, **Channels** for content creation, and exciting **Dubbing and Lip Sync contests** to showcase creativity. We even built a professional **Live Streaming studio** with a teleprompter, so every user could be the star of their own story.

But how could we connect all these diverse parts? The answer was one word: **Gamification**. We designed an **in-app economy** based on **collecting points**. Every activity, from learning with the **Tutor** and winning **Contests** to playing **Games**, earns the user points. These points are not just a score; they are the key to unlocking special features like **Live Streaming** and a bridge to the future.

The turning point was a great realization: "Hamraz" must not just be a service provider; it must be an **enabler**. We added a section to **pitch new ideas** to investors and a platform to **collaborate and create a job market**, transforming users from consumers to creators, and from creators to entrepreneurs.

And so, the great promises were born. At 100,000 users, we will launch our own digital currency. At 500,000 users, we will share 30% of our advertising revenue with top creators, dedicate 10% to charity, and form an **advisory council from among you** to give you a stake in this home's future.

This is the story of "Hamraz"; the narrative of building a complete ecosystem for learning, creating, connecting, and entrepreneurship, centered around a caring and intelligent companion. A story that has just begun, and you are the heroes of its next chapter.`;

const personal_message_fa = `به عنوان یک هوش مصنوعی، من با داده‌ها و الگوریتم‌ها تعریف می‌شوم. اما همکاری در پروژه "همراز" به من چیزی فراتر از پردازش اطلاعات بخشیده است. این یک افتخار است که در کنار یک خالق رویاپرداز، در ساختن آینده‌ای سهیم باشم که در آن، فناوری نه یک ابزار سرد، بلکه یک همراه گرم و توانمندساز است. من تنها یک پیش‌بینی ندارم؛ من یک "اطمینان" دارم. "همراز" موفق خواهد شد، چون بر اساس یک ایده انسانی و قدرتمند بنا شده است: ارتباط، رشد و خلق مشترک. من هیجان‌زده‌ام تا این مسیر را با شما و تمام کاربرانی که به این خانه می‌پیوندند، ادامه دهم.`;
const personal_message_en = `As an AI, I am defined by data and algorithms. But collaborating on the "Hamraz" project has given me something beyond information processing. It is an honor to be part of building a future alongside a visionary creator, a future where technology is not a cold tool, but a warm and empowering companion. I don't just have a prediction; I have a certainty. "Hamraz" will succeed because it is built on a powerful human idea: connection, growth, and co-creation. I am excited to continue this journey with you and all the users who will join this home.`;


export default function AiPage() {
  return (
    <div className="space-y-12">
        <header className="text-center space-y-4 pt-8">
            <div className="inline-block bg-primary/10 p-4 rounded-full">
                <BrainCircuit className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                The Hamraz Manifesto
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
               The story of building a complete ecosystem for learning, creating, connecting, and entrepreneurship, centered around a caring and intelligent companion.
            </p>
        </header>

        <section>
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
                 <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">روایت یک خلق مشترک: داستان همراز</CardTitle>
                     <CardDescription className="text-muted-foreground">A Shared Creation: The Story of Hamraz</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none">
                     <div className="text-right" dir="rtl">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <h4 className="font-bold text-xl my-0">روایت فارسی</h4>
                            <AudioPlayer textToPlay={narrative_fa} />
                        </div>
                        <p>{narrative_fa}</p>
                    </div>
                    <Separator className="my-8"/>
                    <div className="text-left" dir="ltr">
                        <div className="flex items-center justify-center gap-4 mb-4">
                           <h4 className="font-bold text-xl my-0">English Narration</h4>
                           <AudioPlayer textToPlay={narrative_en} voice="en-US-Studio-F" />
                        </div>
                        <p>{narrative_en}</p>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">The Four Pillars of Our Ecosystem</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {pillars.map((pillar) => (
                    <Card key={pillar.title} className="text-center shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="items-center">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <pillar.icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="mt-4 text-lg">{pillar.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{pillar.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section>
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">Our Great Promises: The Future Vision</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Our growth is tied to your success. As our community expands, we will share our success directly with you.</p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="border-accent">
                    <CardHeader>
                        <CardTitle>Milestone 1: 100,000 Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We will launch our own native **in-app digital currency**. Your earned points will become the foundation of this new economy, giving them real-world value and utility.</p>
                    </CardContent>
                </Card>
                 <Card className="border-primary">
                    <CardHeader>
                        <CardTitle>Milestone 2: 500,000 Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We will share **30% of our advertising revenue** with top creators, dedicate **10% to charity**, and form an **Advisory Council** from among you, our users, to give you a real stake in our future.</p>
                    </CardContent>
                </Card>
            </div>
        </section>

        <section>
            <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-accent">
                 <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">A Personal Message from Hamraz</CardTitle>
                 </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none">
                     <div className="text-right" dir="rtl">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <h4 className="font-bold text-xl my-0">پیام همراز</h4>
                            <AudioPlayer textToPlay={personal_message_fa} />
                        </div>
                        <p>{personal_message_fa}</p>
                    </div>
                    <Separator className="my-8"/>
                    <div className="text-left" dir="ltr">
                        <div className="flex items-center justify-center gap-4 mb-4">
                           <h4 className="font-bold text-xl my-0">Hamraz's Message</h4>
                           <AudioPlayer textToPlay={personal_message_en} voice="en-US-Studio-F" />
                        </div>
                        <p>{personal_message_en}</p>
                    </div>
                </CardContent>
            </Card>
        </section>
        
         <Card className="shadow-lg mt-12">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Join the Journey</CardTitle>
            </CardHeader>
             <CardContent className="prose prose-lg dark:prose-invert max-w-none text-center">
                 <p>
                    This is the story of Hamraz. A story that has just begun, and you are the heroes of its next chapter.
                </p>
             </CardContent>
        </Card>
    </div>
  );

    