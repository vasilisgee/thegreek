"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { TbGhost3 } from "react-icons/tb";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "site-assets";

export type ThumbGallery = {
  thumb_gallery_1: string | null;
  thumb_gallery_2: string | null;
  thumb_gallery_3: string | null;
  thumb_gallery_4: string | null;
};

const EMPTY: ThumbGallery = {
  thumb_gallery_1: null,
  thumb_gallery_2: null,
  thumb_gallery_3: null,
  thumb_gallery_4: null,
};

type FileMap = Partial<Record<keyof ThumbGallery, File | null>>;

export function useThumbGallery() {
  const { toast } = useToast();
  const isGuest = useIsGuest();

  const [gallery, setGallery] = useState<ThumbGallery>(EMPTY);
  const [persistedGallery, setPersistedGallery] =
    useState<ThumbGallery>(EMPTY);
  const [thumbs, setFiles] = useState<FileMap>({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- read ---------- */
  useEffect(() => {
    async function load() {
      if (isGuest) {
        setGallery(EMPTY);
        setPersistedGallery(EMPTY);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("media_assets")
        .select(
          "thumb_gallery_1, thumb_gallery_2, thumb_gallery_3, thumb_gallery_4",
        )
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        toast({ title: "Failed to load gallery", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const nextGallery = data ?? EMPTY;
      setGallery(nextGallery);
      setPersistedGallery(nextGallery);
      setIsLoading(false);
    }

    load();
  }, [toast, isGuest]);

  /* ---------- image change ---------- */
  function setImage(
    key: keyof ThumbGallery,
    file: File | null,
  ) {
    setFiles((prev) => ({ ...prev, [key]: file }));

    if (!file) {
      setGallery((prev) => ({ ...prev, [key]: null }));
    }
  }

  /* ---------- save ---------- */
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
    const updates: Partial<ThumbGallery> = {};

    for (const key of Object.keys(gallery) as (keyof ThumbGallery)[]) {
      const file = thumbs[key];
      const currentValue = gallery[key];
      const previousValue = persistedGallery[key];
      const touched = key in thumbs || currentValue !== previousValue;

      // remove
      if (touched && currentValue === null && previousValue && !file) {
        const previousFileName = previousValue.split("/").pop();
        if (previousFileName) {
          await supabase.storage.from(BUCKET).remove([previousFileName]);
        }
        updates[key] = null;
      }

      // upload
      if (file instanceof File) {
        const ext = file.name.split(".").pop();
        const fileName = `${key}.${ext}`;

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

    if (Object.keys(updates).length === 0) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("media_assets").upsert({
      id: SETTINGS_ID,
      ...updates,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      toast({ title: "Save failed", variant: "destructive" });
      return;
    }

    setFiles({});
    const nextGallery = { ...gallery, ...updates };
    setGallery(nextGallery);
    setPersistedGallery(nextGallery);

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
    gallery,
    thumbs,
    setImage,
    save,
    loading,
    isLoading,
  };
}
