import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geom:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        {data?.google_analytics && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=XXX"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: data.google_analytics,
              }}
            />
          </>
        )}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-neo frontend-theme`}
      >
        {children}
      </body>
    </html>
  );
}
