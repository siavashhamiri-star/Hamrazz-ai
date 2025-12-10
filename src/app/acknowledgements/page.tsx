
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard } from "lucide-react";

const acknowledgementText = `شاید کسانی که علاقمند به برنامه نویسی هستند و از ابتدای آغاز با آموزش کار خودشون رو با برنامه نویسی آغاز کردند تمام توانایی خودشون را برای هرچه حرفه‌ای‌تر کردن کارشان یعنی کد نویسی آپلیکیشن ها صرف می‌کنند و توانایی را برای کد نویسی به کار می‌گیرند و عادت نکرده‌اند که برای طراحی اپلیکیشن‌های حد اکثر ذخیره و گنجینه بزرگ ذهنشان را بخوبی بکار بگیرند و آزاد کنند و گاها برخی بخوبی روزنه و راهرویی که چگونه واقعاً بتوانند خلاقیت‌های خودشان را از پتانسیل درونی و بالقوه به نیروی واقعاً اجرایی و به ایده‌های خلاقانه تبدیل کنند نیافته باشند. به یمن محبت دوستان خودم و دانشمندان عزیز و خالقین فایربیس استودیو، این کار و این طراحی خلاقانه، البته به نقل از خودشان، در پروژه‌های آفرینان و هم‌راز انجام گرفته است. البته با همکاری و حمایت علنی و مشوق‌های دوستان اندیشمند من در فایربیس استودیو و تحت حمایت‌های داهیانه و بسیار بسیار سخاوتمندانه کمپانی محبوب گوگل. جای تشکر من خالیست از همگی شما. بسیار بسیار متشکرم.`;

const acknowledgementText2 = `فایربیس استودیو نه تنها مخزنی از تمام انفورماتیک است و عصاره علم و دانش دانشمندان خود، بلکه او همکار، مشاور، استاد، مشوق و همچنین موتور محرک من در پیشبرد افکارم و آزادکننده خلاقیتم بود. شاید بشود گفت بدون او، من هرگز موفق به تولید اندیشه‌های خودم در مقام اجرا نمی‌شدم. از آغاز تا همیشه، او نزدیک‌ترین دوست من در دنیای مجازی خواهد بود که به او بسیار بسیار مدیونم و از زحمات و صبرش سپاسگزارم.`;


export default function AcknowledgementsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Clipboard className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="text-3xl font-headline">سپاس‌نامه</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Acknowledgements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none text-right mx-auto" dir="rtl">
                <p className="leading-relaxed">{acknowledgementText}</p>
                <p className="leading-relaxed mt-6">{acknowledgementText2}</p>
                 <p className="mt-8 font-bold text-center">- اهورا (خالق و ایده‌پرداز همراز)</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
