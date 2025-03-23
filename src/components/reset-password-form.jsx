"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { logo } from "../../public/assets/images";
import Image from "next/image";

const resetPasswordSchema = z
  .object({
    new_password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    reset_password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.new_password === data.reset_password, {
    message: "Passwords do not match",
    path: ["reset_password"],
  });

export function ResetPasswordForm({ token }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleSubmitForm = async (data) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/PasswordReset/${token}/`,
        { 
          new_password: data.new_password, 
          reset_password: data.reset_password 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      reset();
      router.push("/login?reset=success");
    } catch (error) {
        if (error.response) {
          const status = error.response.status;
          let message = "An error occurred. Please try again.";
  
          if (status === 400) {
            message = "Invalid token or password criteria not met.";
          } else if (status === 404) {
            message = "Token not found. Please request a new password reset.";
          }
  
          setError("auth", { type: "manual", message });
        } else if (error.request) {
          setError("auth", { type: "manual", message: "No response from server. Please try again later." });
        } else {
          setError("auth", { type: "manual", message: error.message });
        }
      }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
        <Image src={logo} width={200} height={50} alt="Logo" />
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        </div>
      <div className="mb-4">
        <Label className="text-black" htmlFor="newpassword">
          New Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
              id="new_password"
              type={showPassword ? "text" : "password"}
              {...register("new_password")}
              placeholder="******"
              disabled={isSubmitting}
              className="text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <Eye className="font-extrabold text-black" size={15} /> : <EyeOff className="font-extrabold text-black" size={15} />}
            </button>
          </div>
        {errors.new_password && (
          <p className="text-red-500 text-sm">{errors.new_password.message}</p>
        )}
      </div>
      <div className="mb-4">
        <Label className="text-black" htmlFor="resetpassword">
          Confirm New Password <span className=" text-red-500">*</span>
        </Label>
        <div className="relative">
        <Input
          id="reset_password"
          type={showConfirmPassword ? "text" : "password"}
          {...register("reset_password")}
          placeholder="******"
          required
          className=" text-black w-full px-3 py-2 border rounded "

        />
        <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showConfirmPassword ? <Eye className="font-extrabold text-black" size={15} /> : <EyeOff className="font-extrabold text-black" size={15} />}
            </button>
          </div>
        {errors.reset_password && (
          <p className="text-red-500 text-sm">{errors.reset_password.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-[#BEA355] dark:bg-[#BEA355] rounded-full text-white py-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>
      {errors.auth && <p className="text-red-500 text-sm text-center">{errors.auth.message}</p>}
    </form>
  );
}