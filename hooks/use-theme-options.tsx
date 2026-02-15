"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TbGhost3 } from "react-icons/tb";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "site-assets";
const LOGO_BASE_NAME = "site-logo";

export type ThemeOptions = {
  site_logo: string | null;
  layout_style: string;
  font_family: string;
  main_language: string;
  secondary_language: string;
  brand_color: string;
  background_color: string;
  text_color: string;
  heading_color: string;
  animations_enabled: boolean;
};

const DEFAULT_THEME: ThemeOptions = {
  site_logo: null,
  layout_style: "rounded",
  font_family: "Geom",
  main_language: "en",
  secondary_language: "sv",
  brand_color: "#151a3f",
  background_color: "#f5f3f0",
  text_color: "#e2e8f0",
  heading_color: "#151a3f",
  animations_enabled: true,
};

export function useThemeOptions() {
  const isGuest = useIsGuest();

  const [themeOptions, setThemeOptions] =
    useState<ThemeOptions>(DEFAULT_THEME);
  const [persistedOptions, setPersistedOptions] =
    useState<ThemeOptions>(DEFAULT_THEME);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function updateField<K extends keyof ThemeOptions>(
    key: K,
    value: ThemeOptions[K],
  ) {
    setThemeOptions((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoChange(file: File | null) {
    setLogoFile(file);

    if (!file) {
      setThemeOptions((prev) => ({ ...prev, site_logo: null }));
    }
  }

  useEffect(() => {
    async function loadThemeOptions() {
      if (isGuest) {
        setThemeOptions(DEFAULT_THEME);
        setPersistedOptions(DEFAULT_THEME);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("theme_options")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Failed to load settings", {
          description: "Uh oh, something went wrong.",
          icon: <TbGhost3 className="h-5 w-5" />,
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        const nextTheme: ThemeOptions = {
          site_logo: data.site_logo ?? DEFAULT_THEME.site_logo,
          layout_style: data.layout_style ?? DEFAULT_THEME.layout_style,
          font_family: data.font_family ?? DEFAULT_THEME.font_family,
          main_language: data.main_language ?? DEFAULT_THEME.main_language,
          secondary_language:
            data.secondary_language ?? DEFAULT_THEME.secondary_language,
          brand_color: data.brand_color ?? DEFAULT_THEME.brand_color,
          background_color:
            data.background_color ?? DEFAULT_THEME.background_color,
          text_color: data.text_color ?? DEFAULT_THEME.text_color,
          heading_color: data.heading_color ?? DEFAULT_THEME.heading_color,
          animations_enabled:
            data.animations_enabled ?? DEFAULT_THEME.animations_enabled,
        };
        setThemeOptions(nextTheme);
        setPersistedOptions(nextTheme);
      } else {
        setThemeOptions(DEFAULT_THEME);
        setPersistedOptions(DEFAULT_THEME);
      }

      setIsLoading(false);
    }

    loadThemeOptions();
  }, [isGuest]);

  async function saveThemeOptions() {
    if (isGuest) {
      toast("Guest mode", {
        description: "Saving is disabled for guest users.",
        icon: <TbGhost3 className="h-5 w-5" />,
      });
      return;
    }

    setLoading(true);
    const version = Date.now().toString();

    let logoUrl = themeOptions.site_logo;

    if (!logoFile && themeOptions.site_logo === null && persistedOptions.site_logo) {
      const previousName = persistedOptions.site_logo.split("/").pop()?.split("?")[0];
      if (previousName) {
        await supabase.storage.from(BUCKET).remove([previousName]);
      }
      logoUrl = null;
    }

    if (logoFile) {
      const extension =
        logoFile.name.split(".").pop()?.toLowerCase() ?? "png";
      const fileName = `${LOGO_BASE_NAME}.${extension}`;
      const previousName = persistedOptions.site_logo?.split("/").pop()?.split("?")[0];

      if (previousName && previousName !== fileName) {
        await supabase.storage.from(BUCKET).remove([previousName]);
      }

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, logoFile, { upsert: true, cacheControl: "31536000" });

      if (uploadError) {
        setLoading(false);
        toast.error("Logo upload failed", {
          icon: <TbGhost3 className="h-5 w-5" />,
        });
        return;
      }

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      logoUrl = `${data.publicUrl}?v=${version}`;
    }

    const { error } = await supabase.from("theme_options").upsert({
      id: SETTINGS_ID,
      ...themeOptions,
      site_logo: logoUrl,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Failed to save", {
        icon: <TbGhost3 className="h-5 w-5" />,
      });
      return;
    }

    const nextTheme = { ...themeOptions, site_logo: logoUrl };
    setThemeOptions(nextTheme);
    setPersistedOptions(nextTheme);
    setLogoFile(null);

    toast("Settings saved", {
      description: "Your changes were saved successfully.",
      icon: <FaRegFloppyDisk className="h-5 w-5" />,
    });
  }

  return {
    themeOptions,
    updateField,
    saveThemeOptions,
    handleLogoChange,
    logoFile,
    loading,
    isLoading,
  };
}
