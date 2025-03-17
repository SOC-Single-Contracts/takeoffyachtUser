"use client";
import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { GlobalLoading } from "./global-loading";
import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { initialFilterGlobal } from "@/helper/filterData";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial']
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial']
});

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [appStatWwalletContext, setAppStatWwalletContext] = useState({});

  // const appStatWwalletContext = JSON.parse(localStorage.getItem("walletContext")) || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("SearchfilterData");
  
    if (!storedData) { 
      const initialData = initialFilterGlobal();
      localStorage.setItem("SearchfilterData", JSON.stringify(initialData));
    }
  }, []);
  useEffect(() => {
    const storedData = localStorage.getItem("walletContext");
    if (storedData) {
      setAppStatWwalletContext(JSON.parse(storedData));
    }
  }, []);

  // useEffect(()=>{
  //   console.log("appStatWwalletContext",appStatWwalletContext)
  // },[appStatWwalletContext])
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
