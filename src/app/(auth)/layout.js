import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "../context/AuthContext";
import Image from "next/image";
import { authbg } from "../../../public/assets/images";
const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }) {
  return (
    <section
      className={cn("bg-background font-sans antialiased", inter.className)}
    >
      <div className="grid min-h-svh lg:grid-cols-2 w-full">
        <div className="flex flex-col w-full">
          <AuthProvider>{children}</AuthProvider>
        </div>
        <div className="relative hidden lg:block w-full">
          <Image
            src={authbg}
            alt="Authentication background"
            className="absolute inset-0 h-full w-full object-cover"
            quality={100}
          />
        </div>
      </div>
    </section>
  );
}
