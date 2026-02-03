"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TbGhost3 } from "react-icons/tb";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "site-assets";
const FILE_NAME = "meta_image.jpg";

export type WebsiteBasics = {
  site_title: string;
  site_description: string;
  meta_image: string | null;
  google_analytics: string;
  google_maps: string;
};

export function useWebsiteBasics() {
  const { toast } = useToast();
  const isGuest = useIsGuest();

  const [websiteBasics, setWebsiteBasics] = useState<WebsiteBasics>({
    site_title: "",
    site_description: "",
    meta_image: null,
    google_analytics: "",
    google_maps: "",
  });

  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function updateField<K extends keyof WebsiteBasics>(
    key: K,
    value: WebsiteBasics[K],
  ) {
    setWebsiteBasics((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleMetaImageChange(file: File | null) {
    setMetaImageFile(file);

    if (!file) {
      setWebsiteBasics((prev) => ({
        ...prev,
        meta_image: null,
      }));
    }
  }

  useEffect(() => {
    async function loadWebsiteBasics() {
      if (isGuest) {
        setWebsiteBasics({
          site_title: "",
          site_description: "",
          meta_image: null,
          google_analytics: "",
          google_maps: "",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast({
          title: "Failed to load",
          variant: "destructive",
          description: (
            <div className="flex items-center gap-2">
              <TbGhost3 className="h-5 w-5" />
              <span className="text-xs">
                Uh oh, something went wrong.
              </span>
            </div>
          ),
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        setWebsiteBasics({
          site_title: data.site_title ?? "",
          site_description: data.site_description ?? "",
          meta_image: data.meta_image ?? null,
          google_analytics: data.google_analytics ?? "",
          google_maps: data.google_maps ?? "",
        });
      }

      setIsLoading(false);
    }

    loadWebsiteBasics();
  }, [toast, isGuest]);

  async function saveWebsiteBasics() {
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

    let metaImageUrl = websiteBasics.meta_image;

    // Remove image
    if (!metaImageFile && websiteBasics.meta_image === null) {
      await supabase.storage.from(BUCKET).remove([FILE_NAME]);
      metaImageUrl = null;
    }

    // Upload new image
    if (metaImageFile) {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(FILE_NAME, metaImageFile, { upsert: true });

      if (uploadError) {
        setLoading(false);
        toast({
          title: "Image upload failed",
          variant: "destructive",
        });
        return;
      }

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(FILE_NAME);

      metaImageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("site_settings").upsert({
      id: SETTINGS_ID,
      ...websiteBasics,
      meta_image: metaImageUrl,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast({
        title: "Failed to save",
        variant: "destructive",
      });
      return;
    }

    setWebsiteBasics((prev) => ({
      ...prev,
      meta_image: metaImageUrl,
    }));
    setMetaImageFile(null);

    toast({
      title: "Settings saved",
      description: (
        <div className="flex items-center gap-2">
          <FaRegFloppyDisk className="h-5 w-5" />
          <span className="text-xs text-muted-foreground">
            Your changes were saved successfully.
          </span>
        </div>
      ),
    });
  }

  return {
    websiteBasics,
    updateWebsiteField: updateField,
    handleMetaImageChange,
    saveWebsiteBasics,
    metaImageFile,
    loading,
    isLoading,
  };
}
