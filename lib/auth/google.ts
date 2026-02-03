"use client";

import { supabase } from "@/lib/supabase/client";

export async function loginWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}

export async function exchangeCodeForSession() {
  return supabase.auth.exchangeCodeForSession(window.location.href);
}
