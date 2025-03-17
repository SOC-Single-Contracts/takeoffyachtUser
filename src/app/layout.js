"use client";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { GlobalLoading } from "./global-loading";
import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { initialFilterGlobal } from "@/helper/filterData";

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
  const appStatWwalletContext = 
  typeof window !== "undefined" && localStorage.getItem("walletContext") 
    ? JSON.parse(localStorage.getItem("walletContext")) 
    : {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("SearchfilterData");
  
      if (!storedData) { 
        const initialData = initialFilterGlobal();
        localStorage.setItem("SearchfilterData", JSON.stringify(initialData));
      }
    }
 
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("walletContext");
  
      if (!storedData) { 
        const initialData = {};
        localStorage.setItem("walletContext", JSON.stringify(initialData));
      }
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
