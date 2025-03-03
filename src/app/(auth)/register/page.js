"use client";

import { SignupForm } from "@/components/signup-form";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";
import { Loading } from "@/components/ui/loading";

export default function RegisterPage() {
  const status = useAuthRedirect();

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignupForm />
    </div>
  );
}