import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { supabase } from "@/lib/supabase/client";

const geom = localFont({
  src: [
    {
      path: "../public/fonts/Geom-VariableFont_wght.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Geom-Italic-VariableFont_wght.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-neo",
  display: "swap",
});

/* ================= METADATA ================= */
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase
    .from("site_settings")
    .select("site_title, site_description, meta_image")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .maybeSingle();

  return {
    title: data?.site_title ?? "theGreek",
    description: data?.site_description ?? "",
    openGraph: {
      title: data?.site_title ?? "theGreek",
      description: data?.site_description ?? "",
      images: data?.meta_image ? [data.meta_image] : undefined,
    },
    twitter: {
      card: data?.meta_image ? "summary_large_image" : "summary",
      title: data?.site_title ?? "theGreek",
      description: data?.site_description ?? "",
      images: data?.meta_image ? [data.meta_image] : undefined,
    },
  };
}

/* ================= LAYOUT ================= */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await supabase
    .from("site_settings")
    .select("google_analytics")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .maybeSingle();
  const hasGoogleAnalytics = Boolean(data?.google_analytics?.trim());

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {hasGoogleAnalytics && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=XXX"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: data?.google_analytics ?? "",
              }}
            />
          </>
        )}
      </head>

      <body
        className={`${geom.variable} antialiased font-neo`}
      >
        {children}
      </body>
    </html>
  );
}
