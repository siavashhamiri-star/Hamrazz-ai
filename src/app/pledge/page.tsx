
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake } from "lucide-react";

const pledge_fa = `
ما، تیم «همراز»، در برابر تمام کاربران و اعضای خانواده بزرگ خود پیمان می‌بندیم که در مسیر پیشبرد اهداف این اپلیکیشن و تبدیل آن به یک مرجع برای تولید و خلاقیت، و همچنین برای ساخت و ساز «شهر توانا»، تا جای ممکن منافع مالی حاصل از این پروژه را با جامعه خود به اشتراک بگذاریم.

ما عمیقاً باور داریم که رشد واقعی از همکاری و سود همگانی حاصل می‌شود. از این رو، صمیمانه از تمام متخصصان، کارآفرینان و ایده‌پردازان دعوت می‌کنیم تا پیشنهادات خود را برای طراحی مدل‌های اقتصادی نوآورانه که منافع آن به تمام اکوسیستم بازگردد، با ما در میان بگذارند.

«همراز» متعلق به همه ماست و آینده آن را با هم خواهیم ساخت.
`;

const pledge_en = `
We, the "Hamraz" team, pledge to all users and members of our large family that on the path to advancing the goals of this application, turning it into a reference for production and creativity, and for the construction of the "Capable City," we will share the financial benefits of this project with our community as much as possible.

We deeply believe that true growth comes from collaboration and mutual benefit. Therefore, we cordially invite all experts, entrepreneurs, and visionaries to share their proposals for designing innovative economic models whose benefits will return to the entire ecosystem.

"Hamraz" belongs to all of us, and we will build its future together.
`;

export default function PledgePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Card className="shadow-lg text-center bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <Handshake className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="text-3xl font-headline">پیمان‌نامه همراز</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                The Hamraz Pledge
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-right">متن فارسی</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none text-right" dir="rtl">
            <p className="whitespace-pre-wrap">{pledge_fa}</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">English Text</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{pledge_en}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
