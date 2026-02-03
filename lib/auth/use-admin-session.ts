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
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    if (isGuestMode()) {
      setStatus("guest");
      return;
    }

    let mounted = true;

    const syncSession = async () => {
      if (!mounted) return;
      setStatus("loading");

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

    syncSession();

    const { data } = supabase.auth.onAuthStateChange(() => {
      if (isGuestMode()) {
        setStatus("guest");
        setProfile(null);
        return;
      }
      syncSession();
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
