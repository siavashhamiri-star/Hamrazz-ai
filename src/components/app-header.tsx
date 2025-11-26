"use client";

import { useState, useMemo } from 'react';
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Coins, Clock, Sparkles } from "lucide-react";
import { navLinks } from "@/lib/data";

export default function AppHeader() {
  const pathname = usePathname();
  const [points, setPoints] = useState(1250);

  const pageTitle = useMemo(() => {
    const currentLink = [...navLinks].find(link => link.href === pathname);
    return currentLink ? currentLink.label : "Profile";
  }, [pathname]);

  const remainingMinutes = useMemo(() => Math.floor(points * 0.2), [points]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-semibold font-headline">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span>{points.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-5 w-5 text-primary" />
          <span>{remainingMinutes} min</span>
        </div>
        <Button size="sm" className="gap-2 hidden sm:flex">
          <Sparkles className="h-4 w-4" />
          <span>Earn Points</span>
        </Button>
      </div>
    </header>
  );
}
