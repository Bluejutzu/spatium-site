import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClientProvider, SyncClerkToConvex } from "@/features/auth";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

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
              colorText: "var(--color-discord-text)",
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
