"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
