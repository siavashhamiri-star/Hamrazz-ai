
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
        <SidebarTrigger asChild>
          <div>
            <PanelLeft />
          </div>
        </SidebarTrigger>
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
            <Button asChild size="sm" variant="outline" onClick={handleSignOut} className="gap-2 hidden sm:flex">
              <React.Fragment>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </React.Fragment>
            </Button>
            <Button asChild size="icon" variant="outline" onClick={handleSignOut} className="sm:hidden">
              <div>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </div>
            </Button>
          </>
        ) : (
          <Link href="/login" legacyBehavior passHref>
            <Button asChild size="sm" className="gap-2" disabled={isLoading}>
              <a>
                <React.Fragment>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </React.Fragment>
              </a>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
