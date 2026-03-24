"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useIsGuest } from "@/lib/auth/guest";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { TbGhost3 } from "react-icons/tb";
import { revalidatePublicSite } from "@/lib/revalidate-public";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "site-assets";

export type SliderGallery = {
  slider_gallery_1: string | null;
  slider_gallery_2: string | null;
  slider_gallery_3: string | null;
  slider_gallery_4: string | null;

  slider_gallery_1_title_en: string | null;
  slider_gallery_1_title_sv: string | null;
  slider_gallery_2_title_en: string | null;
  slider_gallery_2_title_sv: string | null;
  slider_gallery_3_title_en: string | null;
  slider_gallery_3_title_sv: string | null;
  slider_gallery_4_title_en: string | null;
  slider_gallery_4_title_sv: string | null;
};

const EMPTY: SliderGallery = {
  slider_gallery_1: null,
  slider_gallery_2: null,
  slider_gallery_3: null,
  slider_gallery_4: null,

  slider_gallery_1_title_en: null,
  slider_gallery_1_title_sv: null,
  slider_gallery_2_title_en: null,
  slider_gallery_2_title_sv: null,
  slider_gallery_3_title_en: null,
  slider_gallery_3_title_sv: null,
  slider_gallery_4_title_en: null,
  slider_gallery_4_title_sv: null,
};

type SliderFiles = Record<string, File | null>;

export function useSliderGallery() {
  const isGuest = useIsGuest();

  const [sliderGallery, setSliderGallery] = useState<SliderGallery>(EMPTY);
  const [persistedSliderGallery, setPersistedSliderGallery] =
    useState<SliderGallery>(EMPTY);
  const [sliderFiles, setSliderFiles] = useState<SliderFiles>({});
  const [sliderLoading, setSliderLoading] = useState(false);
  const [sliderIsLoading, setSliderIsLoading] = useState(true);

  /* ---------- helpers ---------- */

  function setSliderField<K extends keyof SliderGallery>(
    key: K,
    value: SliderGallery[K],
  ) {
    setSliderGallery((prev) => ({ ...prev, [key]: value }));
  }

  function setSliderImage(field: keyof SliderGallery, file: File | null) {
    setSliderFiles((prev) => ({ ...prev, [field]: file }));

    if (!file) {
      setSliderGallery((prev) => ({ ...prev, [field]: null }));
    }
  }

  /* ---------- load ---------- */

  useEffect(() => {
    async function load() {
      if (isGuest) {
        setSliderGallery(EMPTY);
        setPersistedSliderGallery(EMPTY);
        setSliderIsLoading(false);
        return;
      }

      setSliderIsLoading(true);

      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load slider", {
          icon: <TbGhost3 className="h-5 w-5" />,
        });
        setSliderIsLoading(false);
        return;
      }

      const nextGallery = data ?? EMPTY;
      setSliderGallery(nextGallery);
      setPersistedSliderGallery(nextGallery);
      setSliderIsLoading(false);
    }

    load();
  }, [isGuest]);

  /* ---------- save ---------- */

  async function saveSliderGallery() {
      if (isGuest) {
        toast("Guest mode", {
          description: "Saving is disabled for guest users.",
          icon: <TbGhost3 className="h-5 w-5" />,
        });
        return;
      }

    setSliderLoading(true);
    const version = Date.now().toString();

    const updates: Partial<SliderGallery> = {};

    for (const key of Object.keys(sliderGallery) as (keyof SliderGallery)[]) {
      const file = sliderFiles[key];
      const currentValue = sliderGallery[key];
      const previousValue = persistedSliderGallery[key];
      const touched = key in sliderFiles || currentValue !== previousValue;
      const isTitle = key.includes("_title_");

      if (isTitle) {
        if (currentValue !== previousValue) {
          updates[key] = currentValue;
        }
        continue;
      }

      if (touched && currentValue === null && previousValue && !file) {
        const previousFileName = previousValue.split("/").pop()?.split("?")[0];
        if (previousFileName) {
          await supabase.storage.from(BUCKET).remove([previousFileName]);
        }
        updates[key] = null;
      }

      if (file instanceof File) {
        const ext = file.name.split(".").pop();
        const fileName = `${key}.${ext}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, file, { upsert: true, cacheControl: "31536000" });

        if (error) {
          toast.error("Upload failed", {
            icon: <TbGhost3 className="h-5 w-5" />,
          });
          setSliderLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(fileName);

        updates[key] = `${data.publicUrl}?v=${version}`;
      }
    }

    if (Object.keys(updates).length === 0) {
      setSliderLoading(false);
      return;
    }

    const { error } = await supabase.from("media_assets").upsert({
      id: SETTINGS_ID,
      ...updates,
      updated_at: new Date().toISOString(),
    });

    setSliderLoading(false);

    if (error) {
      toast.error("Save failed", {
        icon: <TbGhost3 className="h-5 w-5" />,
      });
      return;
    }

    setSliderFiles({});
    const nextGallery = { ...sliderGallery, ...updates };
    setSliderGallery(nextGallery);
    setPersistedSliderGallery(nextGallery);
    const didRevalidate = await revalidatePublicSite();

    toast("Settings saved", {
      description: didRevalidate
        ? "Your changes were saved successfully."
        : "Saved, but the public page may take up to a minute to refresh.",
      icon: <FaRegFloppyDisk className="h-5 w-5" />,
    });
  }

  return {
    sliderGallery,
    sliderFiles,
    sliderIsLoading,
    sliderLoading,
    setSliderField,
    setSliderImage,
    saveSliderGallery,
  };
}
