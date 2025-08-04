import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Geist_Mono,Inter } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ConvexClientProvider, SyncClerkToConvex } from "@/features/auth";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: 'var(--color-discord-blurple)',
              colorSuccess: 'var(--color-discord-green)',
              colorWarning: 'var(--color-discord-red)',
              colorShimmer: 'var(--color-discord-blurple-hover)',
              colorText: "white",
              colorInputBackground: 'white',
              colorTextSecondary: "var(--color-discord-text)",
              colorInputText: 'white',
              colorBackground: 'var(--color-discord-darker)',
              fontFamily: 'minecraft',
              colorInput: 'white',
              colorNeutral: 'white',
            },
          }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              {children} <SyncClerkToConvex />
            </ConvexClientProvider>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
