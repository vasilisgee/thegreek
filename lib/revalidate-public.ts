"use client";

import { supabase } from "@/lib/supabase/client";

export async function revalidatePublicSite() {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (!accessToken) {
    return false;
  }

  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
