
"use client";

import React, { useMemo } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Coins, Clock, LogIn, LogOut, PanelLeft } from "lucide-react";
import { navLinks } from "@/lib/data";
import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


export default function AppHeader() {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  
  const points = userProfile?.points || 0;

  const pageTitle = useMemo(() => {
    const currentLink = [...navLinks].find(link => link.href === pathname);
    return currentLink ? currentLink.label : "Profile";
  }, [pathname]);

  const remainingMinutes = useMemo(() => 30 + Math.floor(points * 0.2), [points]);

  const handleSignOut = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const isLoading = userLoading || profileLoading;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur">
      <div className="flex items-center gap-1 md:gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="flex items-center gap-2 md:p-2">
                <PanelLeft />
                <span className="md:hidden font-semibold">Menu</span>
                <span className="sr-only">Menu</span>
            </SidebarTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="hidden md:block">
            <p>Open App Menu</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <h1 className="flex-1 text-xl font-semibold font-headline">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        {user && !isLoading ? (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span>{points.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-5 w-5 text-primary" />
              <span>{remainingMinutes} min</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleSignOut} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
            </Button>
            <Button size="icon" variant="outline" onClick={handleSignOut} className="sm:hidden">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </>
        ) : (
          <Link href="/login" passHref>
            <Button size="sm" className="gap-2" disabled={isLoading}>
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
