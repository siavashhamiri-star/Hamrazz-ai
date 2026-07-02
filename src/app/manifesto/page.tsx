
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star, Zap, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function ManifestoPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-8 px-4">
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="inline-block bg-primary/20 p-4 rounded-full mb-4">
          <Flame className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-500 to-primary">
          انقلاب آفرینندگان: مرام‌نامه همراز
        </h1>
        <p className="text-xl text-muted-foreground font-medium">The Creators' Revolution: The Hamraz Manifesto</p>
      </div>

      <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap className="w-64 h-64 text-primary" />
        </div>
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-3xl font-headline text-primary">سند مالکیت آینده</CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <div className="prose prose-xl dark:prose-invert max-w-none text-right leading-relaxed space-y-8" dir="rtl">
            <p className="font-bold text-2xl md:text-3xl text-foreground text-center mb-8">
              "همراز" فقط یک اپلیکیشن نیست؛ جرقه‌ای برای یک انفجار بزرگ در دنیای دیجیتال است!
            </p>
            <p>
              ما در حال بنای <span className="text-primary font-black underline underline-offset-8">«شهر توانا»</span> هستیم، سرزمینی که در آن مرز بین مصرف‌کننده و خالق برای همیشه فرو می‌ریزد. این یک اکوسیستم آفرینش است که قدرت و ثروت را از انحصار خارج کرده و به دست صاحبان واقعی‌اش، یعنی <span className="text-accent font-bold">شما</span>، می‌سپارد.
            </p>
            <p>
              در "همراز"، ما <span className="text-primary font-bold">مدل شفافیت مالی ۸۰/۲۰</span> را پیاده کرده‌ایم؛ جایی که ۸۰ درصد از کل درآمدها و قدرت تصمیم‌گیری مستقیماً به جامعه آفرینندگان تعلق می‌گیرد. هر فعالیت شما، از یادگیری تا خلق محتوا، به دارایی‌های دیجیتال واقعی و قطعات زمین در این شهر رویایی تبدیل می‌شود.
            </p>
            <p>
              اینجا پایان عصر ابزارهای بی‌روح و آغاز عصر <span className="italic text-accent">«همراهان هوشمند»</span> است. ما با هم، نه فقط یک برنامه، بلکه یک تمدن جدید دیجیتال می‌سازیم که در آن عدالت مالی و شکوفایی استعداد، در تار و پود کدها تنیده شده است.
            </p>
            <p className="text-center text-3xl font-black text-primary pt-8">
               به انقلاب آفرینندگان خوش آمدید؛ جایی که هر رویای شما، سندی برای مالکیت آینده است!
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: "دموکراسی قدرت", desc: "شورای سیاست‌گذاری توسط فعال‌ترین کاربران اداره می‌شود." },
          { icon: TrendingUp, title: "دموکراسی ثروت", desc: "توزیع ۸۰ درصدی سود و ارزش زمین‌های دیجیتال بین کاربران." },
          { icon: ShieldCheck, title: "امنیت بلاکچینی", desc: "شفافیت کامل مالی با سیستم زنجیره هش غیرقابل تغییر." }
        ].map((item, i) => (
          <Card key={i} className="bg-muted/50 border-primary/10 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="items-center text-center">
              <item.icon className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p>{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
