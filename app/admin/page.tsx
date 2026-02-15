"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { TbPhotoEdit } from "react-icons/tb";
import { LuTextSearch } from "react-icons/lu";
import { BiPaint } from "react-icons/bi";
import { ChevronRight } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { formatShortDate } from "@/lib/format-date";
import { useEffect, useState } from "react";
import { useAdminSession } from "@/lib/auth/use-admin-session";

const WELCOME_EMOJIS = [
  { code: "1f44b", label: "Waving hand" },
  { code: "1f680", label: "Rocket" }
];

type DashboardUpdates = {
  texts: string | null;
  media: string | null;
  basics: string | null;
  catalogue: string | null;
  theme: string | null;
};

const EMPTY: DashboardUpdates = {
  texts: null,
  media: null,
  basics: null,
  catalogue: null,
  theme: null,
};

export default function AdminDashboardPage() {
  const { profile, isGuest } = useAdminSession();
  const username = isGuest
    ? "Guest"
    : profile?.first_name || "Admin";
  const isNameReady = isGuest || Boolean(profile);
  const [isLoading, setIsLoading] = useState(true);
  const [updates, setUpdates] = useState<DashboardUpdates>(EMPTY);
  const [welcomeEmoji] = useState(
    () => WELCOME_EMOJIS[Math.floor(Math.random() * WELCOME_EMOJIS.length)]
  );
  const lastUpdatedLabel = (value: string | null) =>
    isLoading || !value
      ? "Last updated · —"
      : `Last updated · ${formatShortDate(value)}`;

  useEffect(() => {
    async function loadUpdates() {
      if (isGuest) {
        setUpdates(EMPTY);
        setIsLoading(false);
        return;
      }

      const [texts, media, basics, theme, catalogue] = await Promise.all([
        supabase
          .from("website_texts")
          .select("updated_at")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .maybeSingle(),

        supabase
          .from("media_assets")
          .select("updated_at")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .maybeSingle(),

        supabase
          .from("site_settings")
          .select("updated_at")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .maybeSingle(),

        supabase
          .from("theme_options")
          .select("updated_at")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .maybeSingle(),

        supabase
          .from("catalogue")
          .select("updated_at")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .maybeSingle(),
      ]);

      setUpdates({
        texts: texts.data?.updated_at ?? null,
        media: media.data?.updated_at ?? null,
        basics: basics.data?.updated_at ?? null,
        catalogue: catalogue.data?.updated_at ?? null,
        theme: theme.data?.updated_at ?? null,
      });

      setIsLoading(false);
    }

    loadUpdates();
  }, [isGuest]);

  return (
    <div className="min-h-[calc(100vh-164px)] flex items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center space-y-10 mt-10 md:mt-0 mb-10 md:mb-0 md:-translate-y-[30px] ">
        {/* Header */}
        <div className="space-y-2">
          <h1
            className={`text-3xl font-bold tracking-tight flex items-center justify-center gap-2 transition-opacity duration-300 ease-out ${
              isNameReady ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome {username}
            <picture className="inline-flex">
              <source
                srcSet={`https://fonts.gstatic.com/s/e/notoemoji/latest/${welcomeEmoji.code}/512.webp`}
                type="image/webp"
              />
              <img
                src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${welcomeEmoji.code}/512.gif`}
                alt={`${welcomeEmoji.label} emoji`}
                className="h-7 w-7"
              />
            </picture>
          </h1>
          <p
            className={`text-muted-foreground text-md transition-opacity duration-300 ease-out ${
              isNameReady ? "opacity-100" : "opacity-0"
            }`}
          >
            What do you want to do today?
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 */}
          <Link href="/admin/texts" className="block">
            <Card
              className={`group rounded-2xl border bg-muted/40 hover:bg-muted/60 shadow-xs transition-opacity duration-300 ease-out ${
                isNameReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "120ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <HiOutlineDocumentText className="h-5 w-5" />
                </div>
                <div className="relative flex-1 text-left">
                  <div className="text-md font-semibold transition-transform duration-200 group-hover:-translate-y-2.5">Edit website texts</div>
                  <div className="absolute left-0 bottom-[-9px] h-0 overflow-hidden transition-[height] duration-200 group-hover:h-6">
                    <span className="inline-flex h-5 items-center rounded-sm text-[11px] text-muted-foreground">
                      {lastUpdatedLabel(updates.theme)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 2 */}
          <Link href="/admin/photos" className="block">
            <Card
              className={`group rounded-2xl border bg-muted/40 hover:bg-muted/60 shadow-xs transition-opacity duration-300 ease-out ${
                isNameReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "180ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <TbPhotoEdit className="h-5 w-5" />
                </div>
                <div className="relative flex-1 text-left">
                  <div className="text-md font-semibold transition-transform duration-200 group-hover:-translate-y-2.5">Upload photos & media</div>
                  <div className="absolute left-0 bottom-[-9px] h-0 overflow-hidden transition-[height] duration-200 group-hover:h-6">
                    <span className="inline-flex h-5 items-center rounded-sm text-[11px] text-muted-foreground">
                      {lastUpdatedLabel(updates.media)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 3 */}
          <Link href="/admin/general" className="block">
            <Card
              className={`group rounded-2xl border bg-muted/40 hover:bg-muted/60 shadow-xs transition-opacity duration-300 ease-out ${
                isNameReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "240ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <LuTextSearch className="h-5 w-5" />
                </div>
                <div className="relative flex-1 text-left">
                  <div className="text-md font-semibold transition-transform duration-200 group-hover:-translate-y-2.5">Edit contact information</div>
                  <div className="absolute left-0 bottom-[-9px] h-0 overflow-hidden transition-[height] duration-200 group-hover:h-6">
                    <span className="inline-flex h-5 items-center rounded-sm text-[11px] text-muted-foreground">
                      {lastUpdatedLabel(updates.basics)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          </Link>

          {/* Card 4 */}
          <Link href="/admin/catalogue" className="block">
            <Card
              className={`group rounded-2xl border bg-muted/40 hover:bg-muted/60 shadow-xs transition-opacity duration-300 ease-out ${
                isNameReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <BiPaint className="h-5 w-5" />
                </div>
                <div className="relative flex-1 text-left">
                  <div className="text-md font-semibold transition-transform duration-200 group-hover:-translate-y-2.5">Manage restaurant menu</div>
                  <div className="absolute left-0 bottom-[-9px] h-0 overflow-hidden transition-[height] duration-200 group-hover:h-6">
                    <span className="inline-flex h-5 items-center rounded-sm text-[11px] text-muted-foreground">
                      {lastUpdatedLabel(updates.catalogue)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          </Link>

            {/* Card 5 */}
          <Link href="/admin/general?SEO" className="block">
            <Card
              className={`group rounded-2xl border bg-muted/40 hover:bg-muted/60 shadow-xs transition-opacity duration-300 ease-out ${
                isNameReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "360ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <BiPaint className="h-5 w-5" />
                </div>
                <div className="relative flex-1 text-left">
                  <div className="text-md font-semibold transition-transform duration-200 group-hover:-translate-y-2.5">Edit SEO options</div>
                  <div className="absolute left-0 bottom-[-9px] h-0 overflow-hidden transition-[height] duration-200 group-hover:h-6">
                    <span className="inline-flex h-5 items-center rounded-sm text-[11px] text-muted-foreground">
                      {lastUpdatedLabel(updates.basics)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          </Link>

            {/* Card 6 */}
          <Link href="/admin/appearance" className="block">
            <Card
              className={`group rounded-2xl border bg-muted/40 hover:bg-muted/60 shadow-xs transition-opacity duration-300 ease-out ${
                isNameReady ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "420ms" }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <BiPaint className="h-5 w-5" />
                </div>
                <div className="relative flex-1 text-left">
                  <div className="text-md font-semibold transition-transform duration-200 group-hover:-translate-y-2.5">Change appearance settings</div>
                  <div className="absolute left-0 bottom-[-9px] h-0 overflow-hidden transition-[height] duration-200 group-hover:h-6">
                    <span className="inline-flex h-5 items-center rounded-sm text-[11px] text-muted-foreground">
                      {lastUpdatedLabel(updates.texts)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
