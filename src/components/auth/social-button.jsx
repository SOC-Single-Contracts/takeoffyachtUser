"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { apple, fb, google } from "../../../public/assets/images";
import { useState } from "react";
import { authAPI } from "@/lib/api";

export function AuthSocialButton({ iconSrc, onClick, label, bgColor = "bg-white" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("Social auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F8F8] w-full rounded-2xl text-black hover:text-white shadow-md flex items-center justify-center">
      <Image
        src={iconSrc} 
        width={40}                       
        height={40}                     
        className={`${bgColor} rounded-full p-1.5 mr-4`} 
        alt={`${label} icon`}                      
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="bg-[#F8F8F8] w-full shadow-none rounded-2xl text-black hover:text-white flex items-center justify-center gap-2 p-2"
      >
        {isLoading ? "Loading..." : label}
      </Button>
    </div>
  );
}

export const SocialActions = [
  {
    iconSrc: google,
    label: "Continue with Google",
    bgColor: "bg-white",
    onClick: async () => {
      try {
        const redirectUrl = await authAPI.googleSignInRedirect();
        
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          console.error("No redirect URL received from backend");
        }
      } catch (error) {
        console.error("Google sign in error:", error);
        throw error;
      }
    }
  },
  {
    iconSrc: fb,
    label: "Continue with Facebook",
    bgColor: "bg-blue-500",
    onClick: async () => {
      try {
        const result = await signIn("facebook", { 
          callbackUrl: "/dashboard",
          redirect: true,
        });
        
        if (result?.error) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Facebook sign in error:", error);
        throw error;
      }
    }
  },
  {
    iconSrc: apple,
    label: "Continue with Apple",
    bgColor: "bg-black",
    onClick: async () => {
      try {
        const result = await signIn("apple", { 
          callbackUrl: "/dashboard",
          redirect: true,
        });
        
        if (result?.error) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Apple sign in error:", error);
        throw error;
      }
    }
  }
];