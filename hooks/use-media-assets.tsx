"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TbGhost3 } from "react-icons/tb";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "site-assets";

export type MediaAssets = {
  hero_image: string | null;
  hero_video: string | null;
  menu_pdf_en: string | null;
  menu_pdf_sv: string | null;

  thumb_gallery_1: string | null;
  thumb_gallery_2: string | null;
  thumb_gallery_3: string | null;
  thumb_gallery_4: string | null;

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

type FileMap = Partial<Record<keyof MediaAssets, File | null>>;

const EMPTY_MEDIA: MediaAssets = {
  hero_image: null,
  hero_video: null,
  menu_pdf_en: null,
  menu_pdf_sv: null,

  thumb_gallery_1: null,
  thumb_gallery_2: null,
  thumb_gallery_3: null,
  thumb_gallery_4: null,

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

export function useMediaAssets() {
  const { toast } = useToast();
  const isGuest = useIsGuest();

  const [media, setMedia] = useState<MediaAssets>(EMPTY_MEDIA);
  const [persistedMedia, setPersistedMedia] =
    useState<MediaAssets>(EMPTY_MEDIA);
  const [files, setFiles] = useState<FileMap>({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function updateField<K extends keyof MediaAssets>(
    key: K,
    value: MediaAssets[K],
  ) {
    setMedia((prev) => ({ ...prev, [key]: value }));
  }

  function setFile(field: keyof MediaAssets, file: File | null) {
    setFiles((prev) => ({ ...prev, [field]: file }));

    if (!file) {
      setMedia((prev) => ({ ...prev, [field]: null }));
    }
  }

  /* ---------- LOAD ---------- */

  useEffect(() => {
    async function load() {
      if (isGuest) {
        setMedia(EMPTY_MEDIA);
        setPersistedMedia(EMPTY_MEDIA);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        toast({
          title: "Failed to load media",
          variant: "destructive",
          description: (
            <div className="flex items-center gap-2">
              <TbGhost3 className="h-5 w-5" />
              <span className="text-xs">Something went wrong.</span>
            </div>
          ),
        });
        setIsLoading(false);
        return;
      }

      const nextMedia = data ?? EMPTY_MEDIA;
      setMedia(nextMedia);
      setPersistedMedia(nextMedia);
      setIsLoading(false);
    }

    load();
  }, [toast, isGuest]);

  /* ---------- SAVE ---------- */

  async function save() {
      if (isGuest) {
        toast({
          title: "Guest mode",
          description: (
            <div className="flex items-center gap-2">
              <TbGhost3 className="h-5 w-5" />
              <span className="text-xs text-muted-foreground">
                Saving is disabled for guest users.
              </span>
            </div>
          ),
        });
        return;
      }

    setLoading(true);

    const updates: Partial<MediaAssets> = {};

    for (const key of Object.keys(media) as (keyof MediaAssets)[]) {
      const file = files[key];
      const currentValue = media[key];
      const previousValue = persistedMedia[key];
      const touched = key in files || currentValue !== previousValue;

      if (touched && currentValue === null && previousValue && !file) {
        const previousFileName = previousValue.split("/").pop();
        if (previousFileName) {
          await supabase.storage.from(BUCKET).remove([previousFileName]);
        }
        updates[key] = null;
      }

      if (file instanceof File) {
        const fileName = `${key}.${file.name.split(".").pop()}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, file, { upsert: true });

        if (error) {
          setLoading(false);
          toast({ title: "Upload failed", variant: "destructive" });
          return;
        }

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(fileName);

        updates[key] = data.publicUrl;
      }
    }

    const { error } = await supabase.from("media_assets").upsert({
      id: SETTINGS_ID,
      ...updates,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast({ title: "Save failed", variant: "destructive" });
      return;
    }

    const nextMedia = { ...media, ...updates };
    setFiles({});
    setMedia(nextMedia);
    setPersistedMedia(nextMedia);

    toast({
      title: "Media saved",
      description: (
        <div className="flex items-center gap-2">
          <FaRegFloppyDisk className="h-5 w-5" />
          <span className="text-xs text-muted-foreground">
            Changes saved successfully.
          </span>
        </div>
      ),
    });
  }

  return {
    media,
    files,
    updateField,
    setFile,
    save,
    loading,
    isLoading,
  };
}
