"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { isGuestMode, clearGuestMode } from "@/lib/auth/guest";
import {
  isAllowedAdminEmail,
  upsertAdminUser,
  type AdminProfile,
} from "@/lib/auth/admin";

type AdminStatus =
  | "loading"
  | "guest"
  | "authenticated"
  | "unauthenticated"
  | "unauthorized";

export function useAdminSession() {
  const [status, setStatus] = useState<AdminStatus>(() =>
    isGuestMode() ? "guest" : "loading",
  );
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    if (isGuestMode()) {
      return;
    }

    let mounted = true;

    const syncSession = async (withLoading = false) => {
      if (!mounted) return;
      if (withLoading) {
        setStatus("loading");
      }

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        if (mounted) {
          setProfile(null);
          setStatus("unauthenticated");
        }
        return;
      }

      const email = data.user.email ?? "";
      if (!isAllowedAdminEmail(email)) {
        await supabase.auth.signOut();
        if (mounted) {
          setProfile(null);
          setStatus("unauthorized");
        }
        return;
      }

      clearGuestMode();
      const nextProfile = await upsertAdminUser(data.user);
      if (mounted) {
        setProfile(nextProfile);
        setStatus("authenticated");
      }
    };

    syncSession(true);

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (isGuestMode()) {
        setStatus("guest");
        setProfile(null);
        return;
      }

      if (event === "SIGNED_OUT") {
        setProfile(null);
        setStatus("unauthenticated");
        return;
      }

      if (event === "SIGNED_IN") {
        syncSession(false);
        return;
      }

      // Ignore token refresh/focus-driven events to avoid remounting admin pages.
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return {
    status,
    profile,
    isGuest: status === "guest",
    isAuthenticated: status === "authenticated",
  };
}
