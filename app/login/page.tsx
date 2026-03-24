"use client";

"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login-form"
import { Providers } from "@/app/providers"
import ThemeToggle from "@/components/admin/ThemeToggle"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TbGhost3 } from "react-icons/tb";

function LoginPageContent() {
  const params = useSearchParams();

  useEffect(() => {
    const error = params.get("error");
    if (!error) return;

    if (error === "unauthorized") {
      toast.error("Access denied", {
        description: "Your email is not on the admin allow list.",
        icon: <TbGhost3 className="h-5 w-5" />,
      });
    }

    if (error === "oauth") {
      toast.error("Login failed", {
        description: "Google sign-in failed. Please try again.",
        icon: <TbGhost3 className="h-5 w-5" />,
      });
    }

    if (error === "idle") {
      toast("Session expired", {
        description: "You were logged out after inactivity.",
        duration: Infinity,
        closeButton: true,
        icon: <TbGhost3 className="h-5 w-5" />,
      });
    }
  }, [params]);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background text-foreground p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="inline-block m-auto">
          <strong className="font-bold w-auto px-2.5 py-1.5 rounded-md text-sm tracking-tighter bg-primary text-secondary">
            Admin Panel
          </strong>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Providers>
      <Suspense fallback={<div className="min-h-svh bg-background" />}>
        <LoginPageContent />
      </Suspense>
      <Toaster />
    </Providers>
  )
}
