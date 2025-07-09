import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ConvexClientProvider, SyncClerkToConvex } from '@/features/auth';
import { Toaster } from '@/components/ui/sonner';

import './styles/globals.css';
import './styles/clerk-pricing.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spatium',
  description: "The only bot you'll ever need",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning={true}>
        <body className={inter.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              {children} <SyncClerkToConvex />
            </ConvexClientProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
