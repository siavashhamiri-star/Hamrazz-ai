
"use client";

import ChatInterface from "@/components/chat-interface";

/**
 * صفحه اصلی اپلیکیشن همراز
 * این فایل نقطه شروع اصلی برنامه است.
 * بازنویسی شده برای رفع قطعی ارور ۴۰۴ و اطمینان از بارگذاری ChatInterface.
 */
export default function Home() {
  return (
    <div className="h-full flex flex-col bg-background">
       <ChatInterface />
    </div>
  );
}
