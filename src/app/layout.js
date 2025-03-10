"use client";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { GlobalLoading } from "./global-loading";
import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased bg-[#E2E2E2] text-black dark:bg-gray-900 dark:text-white`}
      >
        <Providers>
            <ThemeProvider>
                {isLoading && <GlobalLoading />}
                {children}
                <WhatsAppButton />
                <Toaster />
            </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
