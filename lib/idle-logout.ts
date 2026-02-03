"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { clearGuestMode } from "@/lib/auth/guest";

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;

export function useIdleLogout(enabled: boolean, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(async () => {
        clearGuestMode();
        await supabase.auth.signOut();
        router.replace("/login?error=idle");
      }, timeoutMs);
    };

    reset();

    const events = [
      "mousemove",
      "keydown",
      "scroll",
      "click",
      "touchstart",
    ] as const;

    events.forEach((event) => window.addEventListener(event, reset));

    return () => {
      events.forEach((event) => window.removeEventListener(event, reset));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled, timeoutMs, router]);
}
