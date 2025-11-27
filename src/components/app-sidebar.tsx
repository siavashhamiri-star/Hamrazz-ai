'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Bot, LogIn, LogOut, Twitter, Instagram, Youtube, Spotify, ShoppingBag } from 'lucide-react';
import { navLinks, bottomNavLinks } from '@/lib/data';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '@/firebase/config';
import { Button } from './ui/button';
import SoundcloudIcon from './icons/soundcloud-icon';

const SocialLinks = () => (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 py-2">
         <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Youtube className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Instagram className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Twitter className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Spotify className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <SoundcloudIcon className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://amazon.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <ShoppingBag className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://alibaba.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <ShoppingBag className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://digikala.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <ShoppingBag className="h-5 w-5" />
            </Button>
        </a>
    </div>
);

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Bot className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-bold font-headline text-foreground">
            Hamraz AI
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
       <SidebarFooter>
         <SocialLinks />
         <SidebarSeparator />
         {user ? (
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold">{user.displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                 <SidebarMenuButton size="icon" className="h-8 w-8" onClick={handleSignOut} tooltip="Sign Out">
                    <LogOut />
                </SidebarMenuButton>
            </div>
        ) : (
             <div className="p-2">
                <Button className="w-full gap-2" onClick={handleSignIn}>
                    <LogIn />
                    <span>Sign In</span>
                </Button>
            </div>
        )}
        <SidebarMenu>
          {bottomNavLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
