"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login-form"
import { Providers } from "@/app/providers"
import ThemeToggle from "@/components/admin/ThemeToggle"
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const params = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const error = params.get("error");
    if (!error) return;

    if (error === "unauthorized") {
      toast({
        title: "Access denied",
        variant: "destructive",
        description: "Your email is not on the admin allow list.",
      });
    }

    if (error === "oauth") {
      toast({
        title: "Login failed",
        variant: "destructive",
        description: "Google sign-in failed. Please try again.",
      });
    }

    if (error === "idle") {
      toast({
        title: "Session expired",
        description: "You were logged out after inactivity.",
      });
    }
  }, [params, toast]);

  return (
    <Providers>
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background text-foreground p-6 md:p-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6">
          <strong className="font-extrabold w-auto mx-auto bg-brand-primary text-white px-2 py-1 rounded-lg text-lg">
            theGreek
          </strong>
          <LoginForm />
        </div>
      </div>
      <Toaster />
    </Providers>
  )
}
