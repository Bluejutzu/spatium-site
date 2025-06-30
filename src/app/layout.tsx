import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme/theme-provider';
import ConvexClientProvider from '@/components/Clerk/ConvexClientProvider';
import SyncClerkToConvex from '@/components/Clerk/SyncClerkToConvex';

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
      <html lang='en' suppressHydrationWarning>
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
