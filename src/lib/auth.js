import { signOut } from "next-auth/react";

  export const handleLogoutGlobal = () => {
    console.log("Logging out...");
    signOut({
      callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL || "/",
      redirect: true,
    }).then(() => {
      window.location.href = process.env.NEXT_PUBLIC_NEXTAUTH_URL || "/"; 
    }).catch(err => console.error("Logout Error:", err));
  };
    