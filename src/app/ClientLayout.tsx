"use client";

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import AppSidebar from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';
import VoiceScroll from '@/components/voice-scroll';
import dynamic from 'next/dynamic';

// Dynamically import DeploymentGuide only on the client side
const DeploymentGuide = dynamic(() => import('@/components/deployment-guide'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <FirebaseErrorListener />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
            {children}
          </main>
          <VoiceScroll />
          <DeploymentGuide />
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
