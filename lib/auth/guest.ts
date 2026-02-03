"use client";

import { useEffect, useState } from "react";

const GUEST_KEY = "admin_guest";

export function setGuestMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem(GUEST_KEY, "1");
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}

export function clearGuestMode() {
  setGuestMode(false);
}

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_KEY) === "1";
}

export function useIsGuest() {
  const [isGuest, setIsGuest] = useState<boolean>(isGuestMode());

  useEffect(() => {
    const sync = () => setIsGuest(isGuestMode());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return isGuest;
}
