"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { Loading } from "@/components/ui/loading";
import { useParams } from "next/navigation";

const ResetPasswordPage = () => {
  const params = useParams();
  const userID = params.id;

  if (!userID) {
    return (
      <Loading />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded w-full max-w-md">
        <ResetPasswordForm token={userID} />
        <div className="mt-4 text-center">
          <Link href="/login" className="hover:underline">
            <Button variant="outline" className="rounded-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;