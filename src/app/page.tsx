
"use client";

import ChatInterface from "@/components/chat-interface";

/**
 * صفحه اصلی اپلیکیشن همراز
 * این فایل به عنوان نقطه ورود اصلی (Root Route) تثبیت شده است.
 * وظیفه این صفحه نمایش رابط چت زنده و هوشمند همراز است.
 */
export default function Home() {
  return (
    <div className="h-full flex flex-col bg-background">
       <ChatInterface />
    </div>
  );
}
