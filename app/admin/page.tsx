"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  RiSettings3Line,
  RiImageLine,
  RiFileTextLine,
  RiBarChart2Line,
} from "react-icons/ri";
import { MdRestaurantMenu } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { TbPhotoEdit } from "react-icons/tb";
import { LuTextSearch } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";

import { supabase } from "@/lib/supabase/client";
import { formatShortDate } from "@/lib/format-date";
import { useEffect, useState } from "react";
import { useAdminSession } from "@/lib/auth/use-admin-session";

type DashboardUpdates = {
  texts: string | null;
  media: string | null;
  menu: string | null;
  basics: string | null;
};

const EMPTY: DashboardUpdates = {
  texts: null,
  media: null,
  menu: null,
  basics: null,
};

export default function AdminDashboardPage() {
  const { profile, isGuest } = useAdminSession();
  const username = isGuest
    ? "Guest"
    : profile?.first_name || "Admin";
  const [isLoading, setIsLoading] = useState(true);
  const [updates, setUpdates] = useState<DashboardUpdates>(EMPTY);

  useEffect(() => {
    async function loadUpdates() {
      if (isGuest) {
        setUpdates(EMPTY);
        setIsLoading(false);
        return;
      }

      const [texts, media, basics] = await Promise.all([
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
      ]);

      setUpdates({
        texts: texts.data?.updated_at ?? null,
        media: media.data?.updated_at ?? null,
        menu: media.data?.updated_at ?? null, // menu PDFs live in media_assets
        basics: basics.data?.updated_at ?? null,
      });

      setIsLoading(false);
    }

    loadUpdates();
  }, [isGuest]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl text-center space-y-10 mt-10 md:mt-0 mb-10 md:mb-0 md:-translate-y-[60px] ">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome {username}
          </h1>
          <p className="text-muted-foreground text-md">
            What do you want to do today?
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {/* Card 1 */}
          <a href="/admin/texts">
            <Card className="h-full group hover:shadow-lg transition cursor-pointer">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">Edit Texts</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4">
                <HiOutlineDocumentText className="text-4xl text-muted-foreground transition-colors group-hover:text-primary" />

                <Separator />

                {isLoading ? (
                  <Skeleton className="h-6 w-40 rounded-full" />
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    Updated · {formatShortDate(updates.texts)}
                  </span>
                )}
              </CardContent>
            </Card>
          </a>

          {/* Card 2 */}
          <a href="/admin/photos">
            <Card className="group h-full hover:shadow-lg transition cursor-pointer">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">Upload Menu</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4">
                <MdRestaurantMenu className="text-4xl text-muted-foreground transition-colors group-hover:text-primary" />

                <Separator />
                {isLoading ? (
                  <Skeleton className="h-6 w-40 rounded-full" />
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    Updated · {formatShortDate(updates.menu)}
                  </span>
                )}
              </CardContent>
            </Card>
          </a>

          {/* Card 3 */}
          <a href="/admin/photos">
            <Card className="group h-full hover:shadow-lg transition cursor-pointer">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">Edit Photos</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4">
                <TbPhotoEdit className="text-4xl text-muted-foreground transition-colors group-hover:text-primary" />

                <Separator />
                {isLoading ? (
                  <Skeleton className="h-6 w-40 rounded-full" />
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    Updated · {formatShortDate(updates.media)}
                  </span>
                )}
              </CardContent>
            </Card>
          </a>

          {/* Card 4 */}
          <a href="/admin/general">
            <Card className="h-full group hover:shadow-lg transition cursor-pointer">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">Edit Basics & SEO</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4">
                <LuTextSearch className="text-4xl text-muted-foreground transition-colors group-hover:text-primary" />

                <Separator />
                {isLoading ? (
                  <Skeleton className="h-6 w-40 rounded-full" />
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    Updated · {formatShortDate(updates.basics)}
                  </span>
                )}
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
