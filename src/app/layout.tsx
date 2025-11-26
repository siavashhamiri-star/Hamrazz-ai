import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import AppSidebar from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  title: 'Hamraz AI',
  description: 'Your AI companion for connection and learning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                {children}
              </main>
            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
