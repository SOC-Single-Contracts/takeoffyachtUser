"use client";

import { LoginForm } from "@/components/login-form";
import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";
import { Loading } from "@/components/ui/loading";

export default function LoginPage() {
  const status = useAuthRedirect();

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <LoginForm />
    </div>
  );
}
