
"use client";

import ChatInterface from "@/components/chat-interface";

/**
 * صفحه اصلی اپلیکیشن همراز
 * این فایل نقطه شروع برنامه است و رابط چت زنده را رندر می‌کند.
 * رفع ارور ۴۰۴ با اطمینان از وجود این فایل در مسیر صحیح.
 */
export default function Home() {
  return (
    <div className="h-full flex flex-col bg-background">
       <ChatInterface />
    </div>
  );
}
