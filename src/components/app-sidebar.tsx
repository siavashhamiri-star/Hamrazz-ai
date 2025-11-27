
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
import { Bot, LogIn, LogOut, Twitter, Instagram, Youtube, ShoppingBag, Twitch } from 'lucide-react';
import { navLinks, bottomNavLinks } from '@/lib/data';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getAuth, signOut } from 'firebase/auth';
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
        <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Twitch className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.624 13.612a.75.75 0 0 1-1.06.195c-1.801-1.09-4.09-1.34-6.8-.734a.75.75 0 0 1-.84-.62.75.75 0 0 1 .62-.84c3.003-.666 5.588-.378 7.644.864a.75.75 0 0 1-.564 1.135m1.34-3.14a.938.938 0 0 1-1.325.244c-2.086-1.267-5.232-1.63-7.653-.895a.937.937 0 0 1-1.05-.774.937.937 0 0 1 .774-1.05c2.788-.84 6.27-.432 8.653 1.025a.937.937 0 0 1-.4 1.45m.09-3.243c-2.48-1.47-6.52-1.61-8.98-.887a1.125 1.125 0 0 1-1.25-1.012 1.125 1.125 0 0 1 1.012-1.25c2.86-.825 7.27-.645 10.125 1.05a1.125 1.125 0 0 1-.607 2.099" />
                </svg>
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
                <Link href="/login">
                    <Button className="w-full gap-2">
                        <LogIn />
                        <span>Sign In</span>
                    </Button>
                </Link>
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
