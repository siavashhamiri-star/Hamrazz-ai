
"use client";

import { useMemo } from 'react';
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Coins, Clock, LogIn, LogOut } from "lucide-react";
import { navLinks } from "@/lib/data";
import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '@/firebase/config';

export default function AppHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  
  const points = userProfile?.points || 0;

  const pageTitle = useMemo(() => {
    const currentLink = [...navLinks].find(link => link.href === pathname);
    return currentLink ? currentLink.label : "Profile";
  }, [pathname]);

  const remainingMinutes = useMemo(() => 30 + Math.floor(points * 0.2), [points]);

  const handleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-semibold font-headline">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span>{points.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-5 w-5 text-primary" />
              <span>{remainingMinutes} min</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleSignOut} className="gap-2 hidden sm:flex">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
            <Button size="icon" variant="outline" onClick={handleSignOut} className="sm:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={handleSignIn} className="gap-2">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
        )}
      </div>
    </header>
  );
}
