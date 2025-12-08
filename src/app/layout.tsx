import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import ClientLayout from './ClientLayout'; // Import the new client component

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
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
