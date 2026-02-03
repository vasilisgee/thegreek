"use client";

import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { clearGuestMode } from "@/lib/auth/guest";

export type AdminProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
};

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function buildProfileFromUser(user: User): AdminProfile {
  const meta = user.user_metadata ?? {};
  const fullName =
    meta.full_name ||
    meta.name ||
    `${meta.given_name ?? ""} ${meta.family_name ?? ""}`.trim();

  const firstName =
    meta.first_name ||
    meta.given_name ||
    (fullName ? fullName.split(" ")[0] : "");

  const lastName =
    meta.last_name ||
    meta.family_name ||
    (fullName ? fullName.split(" ").slice(1).join(" ") : "");

  const avatarUrl = meta.avatar_url || meta.picture || null;

  return {
    id: user.id,
    email: user.email ?? "",
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    avatar_url: avatarUrl,
  };
}

export async function upsertAdminUser(user: User) {
  const profile = buildProfileFromUser(user);

  const { data, error } = await supabase
    .from("admin_users")
    .upsert(profile, { onConflict: "email" })
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    return profile;
  }

  return data ?? profile;
}

export async function signOutAdmin() {
  clearGuestMode();
  await supabase.auth.signOut();
}
