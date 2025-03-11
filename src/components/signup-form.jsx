"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AuthSocialButton, SocialActions } from "@/components/auth/social-button";
import Image from "next/image";
import { logo } from "../../public/assets/images";
import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  Username: z.string().min(2, { message: "Name must be at least 2 characters" }),
  Email: z.string().email({ message: "Invalid email address" }),
  Password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function SignupForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      signupSchema.parse(data);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/SignUp/`,
        {
          Username: data.Username,
          Email: data.Email,
          Password: data.Password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast({
        title: "Success! 🎉",
        description: "Your account has been created successfully.",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      });

      // Redirect to login page instead of signing in
      router.push("/login");

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const redirectRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/GoogleSignInRedirectView/`
      );

      const res = await signIn(provider, {
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6 w-full max-w-sm px-2", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
        //  src={logo}
        src={`/assets/images/logo.png`} 
          width={200} height={200} alt="Logo" />
        <h1 className="text-3xl font-bold my-5">Sign Up</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">
            Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
            <Input
              id="username"
              type="text"
              {...register("Username")}
              placeholder="Your name"
              disabled={isSubmitting}
              className="pl-10"
            />
          </div>
          {errors.Username && (
            <p className="text-red-500 text-sm">{errors.Username.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
            <Input
              id="Email"
              type="email"
              {...register("Email")}
              placeholder="Your email"
              disabled={isSubmitting}
              className="pl-10"
            />
          </div>
          {errors.Email && (
            <p className="text-red-500 text-sm">{errors.Email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
            <Input
              id="Password"
              type={showPassword ? "text" : "password"}
              {...register("Password")}
              placeholder="******"
              disabled={isSubmitting}
              className="pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <Eye className="font-extrabold text-black" size={15} /> : <EyeOff className="font-extrabold text-black" size={15} />}
            </button>
          </div>
          {errors.Password && (
            <p className="text-red-500 text-sm">{errors.Password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#BEA355] h-10 rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <> <Loader2 className="animate-spin" size={15} /> <span className="ml-2">Signing Up...</span> </> : "Sign Up"}
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#BEA355] hover:underline">
            Login
          </Link>
        </div>
        {errors.auth && (
          <p className="text-red-500 text-sm text-center">{errors.auth.message}</p>
        )}
        {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            OR
          </span>
        </div> */}
        {/* <div className="space-y-3">
          {SocialActions.map((action, index) => (
            <AuthSocialButton
              key={index}
              iconSrc={action.iconSrc}
              onClick={() => handleSocialLogin(action.provider)}
              label={action.label}
              bgColor={action.bgColor}
            />
          ))}
        </div> */}
      </div>
    </form>
  );
}