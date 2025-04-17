"use client";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
// import 'mapbox-gl/dist/mapbox-gl.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { GlobalLoading } from "./global-loading";
import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { initialFilterGlobal } from "@/helper/filterData";
import { initialBookingGlobal } from "@/helper/bookingData";
import { GlobalStateProvider } from "@/context/GlobalStateContext";
import { useParams } from "next/navigation";

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
    const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  const handleInitializeLocalStorage = () => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("SearchfilterData");

      if (!storedData) {
        const initialData = initialFilterGlobal();
        localStorage.setItem("SearchfilterData", JSON.stringify(initialData));
      }
    }

    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("walletContext");

      if (!storedData) {
        const initialData = {};
        localStorage.setItem("walletContext", JSON.stringify(initialData));
      }
    }
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("bookingContextUser");

      if (!storedData) {
        const initialData = initialBookingGlobal();
        localStorage.setItem("bookingContextUser", JSON.stringify(initialData));
      }
    }

  }
  useEffect(() => {
    handleInitializeLocalStorage()
  }, []);

  // useEffect(()=>{
  //   console.log("appStatWwalletContext",appStatWwalletContext)
  // },[appStatWwalletContext])
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased bg-[#E2E2E2] text-black dark:bg-gray-900 dark:text-white`}
      >
        <GlobalStateProvider>
          <Providers>
            <ThemeProvider>
              {isLoading && <GlobalLoading />}
              {children}
              {!id && <WhatsAppButton /> }
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
