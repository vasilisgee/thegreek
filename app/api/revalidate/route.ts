import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { isAllowedAdminEmail } from "@/lib/auth/admin-emails";

export const dynamic = "force-dynamic";

function createAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAuthClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/sv", "page");

  return NextResponse.json(
    {
      revalidated: true,
      paths: ["/", "/sv"],
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
