"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAllowedAdminEmail, upsertAdminUser } from "@/lib/auth/admin";
import { supabase } from "@/lib/supabase/client";
import { clearGuestMode } from "@/lib/auth/guest";
import { Providers } from "@/app/providers";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      let user = sessionData.session?.user ?? null;

      if (!user) {
        await new Promise<void>((resolve) => {
          const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              user = session.user;
              data.subscription.unsubscribe();
              resolve();
            }
          });

          setTimeout(() => {
            data.subscription.unsubscribe();
            resolve();
          }, 3000);
        });
      }

      if (!user) {
        router.replace("/login?error=oauth");
        return;
      }

      if (!isAllowedAdminEmail(user.email)) {
        await supabase.auth.signOut();
        router.replace("/login?error=unauthorized");
        return;
      }

      clearGuestMode();
      await upsertAdminUser(user);
      router.replace("/admin");
    };

    handleCallback();
  }, [router]);

  return (
    <Providers>
      <div className="min-h-svh flex items-center justify-center bg-background text-sm text-muted-foreground">
        Signing you in…
      </div>
    </Providers>
  );
}
