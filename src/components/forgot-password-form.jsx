"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { logo } from "../../public/assets/images";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define Zod schema
const forgotPasswordSchema = z.object({
  Email: z.string().email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm({ className, ...props }) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/ForgetPassword/`,
        { Email: data.Email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data?.details?.user_id) {
        reset();
        toast({
          title: "Check your email! 📧",
          description: "Password reset link has been sent to your email.",
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        router.push(`/reset-password/${response.data.details.user_id}`);
      } else {
        throw new Error("User ID not found in response");
      }
    } catch (error) {
      setError("auth", { type: "manual", message: error.response?.data?.detail || error.message });
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
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
        <Image src={logo} width={200} height={50} alt="Logo" />
        <h1 className="text-3xl font-bold my-5">Forgot Password</h1>
        <p className="text-center text-sm text-muted-foreground text-balance">
          Enter your email below to receive password reset instructions.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="Email"
            type="email"
            {...register("Email")}
            placeholder="Your email"
            disabled={isSubmitting}
            required
          />
          {errors.Email && (
            <p className="text-red-500 text-sm">{errors.Email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#BEA355] rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <> <Loader2 className="animate-spin" size={15} /> <span className="ml-2">Sending...</span> </> : "Send Reset Link"}
        </Button>
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-[#BEA355] hover:underline">
            Login
          </Link>
        </div>
        {errors.auth && (
          <p className="text-red-500 text-sm text-center">{errors.auth.message}</p>
        )}
      </div>
    </form>
  );
}