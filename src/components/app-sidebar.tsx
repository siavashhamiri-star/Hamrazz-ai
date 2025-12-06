
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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Bot, LogIn, LogOut, Twitter, Instagram, Youtube, ShoppingBag, Twitch, Building, Linkedin } from 'lucide-react';
import { navLinks, bottomNavLinks, creatorLinks } from '@/lib/data';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase/config';
import { Button } from './ui/button';
import SoundcloudIcon from './icons/soundcloud-icon';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3v9h4v-9z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.32 8.56c.39 0 .7.32.7.71 0 .39-.31.71-.7.71s-.7-.32-.7-.71c0-.39.31-.71.7-.71zm-2.63 0c.39 0 .7.32.7.71 0 .39-.31.71-.7.71s-.7-.32-.7-.71c0-.39.31-.71.7-.71zM12 16.5c-1.81 0-3.32-1.03-4-2.5h8c-.68 1.47-2.19 2.5-4 2.5zm4.8-4.24c0-1.12-.59-2.1-1.48-2.61.08-.25.13-.51.13-.78 0-1.42-1.15-2.57-2.57-2.57H9.83c.03.22.05.44.05.67 0 .1-.01.2-.02.29h4.29c.47 0 .86.39.86.86 0 .47-.39.86-.86.86H9.72c-.53 0-1.01.21-1.36.56-.35.35-.56.83-.56 1.36 0 .36.1.7.28 1l1.75 3.51c.36.72 1.1 1.2 1.94 1.2h4.34c1.15 0 2.15-.9 2.15-2.07 0-.58-.25-1.1-.64-1.46.22-.22.36-.51.36-.83z"/>
  </svg>
);

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.32 7.8v3.12c-1.47.08-2.88.76-3.95 1.83-1.07 1.07-1.75 2.48-1.83 3.95h-3.12c.08-4.17 3.4-7.49 7.57-7.57l.33-.03zM12.9 2.1v15.75c0 1.98-1.62 3.6-3.6 3.6s-3.6-1.62-3.6-3.6V2.1h3.12v12.48c0 .26.21.48.48.48s.48-.21.48-.48V2.1H12.9z" />
    </svg>
);


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
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <FacebookIcon className="h-5 w-5" />
            </Button>
        </a>
         <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Linkedin className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://reddit.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <RedditIcon className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <TiktokIcon className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <Twitch className="h-5 w-5" />
            </Button>
        </a>
        <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <SoundcloudIcon className="h-5 w-5" />
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

  const firstCreatorLink = creatorLinks[0];
  const otherCreatorLinks = creatorLinks.slice(1);


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

         <SidebarGroup>
            <SidebarGroupLabel>From the Creator</SidebarGroupLabel>
             <SidebarMenu>
                <SidebarMenuItem key={firstCreatorLink.href}>
                    <SidebarMenuButton
                        asChild
                        tooltip={{
                            children: (
                                <>
                                    <div className="font-bold">{firstCreatorLink.label}</div>
                                    <div className="text-muted-foreground">{firstCreatorLink.description}</div>
                                </>
                            )
                        }}
                    >
                        <Link href={firstCreatorLink.href} target="_blank">
                        <Building />
                        <span>{firstCreatorLink.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarSeparator className="my-1"/>

                {otherCreatorLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                        asChild
                        tooltip={{
                            children: (
                                <>
                                    <div className="font-bold">{link.label}</div>
                                    <div className="text-muted-foreground">{link.description}</div>
                                </>
                            )
                        }}
                    >
                        <Link href={link.href} target="_blank">
                        <link.icon />
                        <span>{link.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

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
