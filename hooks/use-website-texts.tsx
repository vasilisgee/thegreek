"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TbGhost3 } from "react-icons/tb";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
type Lang = "en" | "sv";

export type WebsiteTexts = {
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;

  gallery_title: string;
  gallery_button_text: string;
  gallery_button_url: string;

  about_title: string;
  about_subtitle: string;
  about_text: string;

  contact_title: string;
  footer_title: string;
};

const emptyTexts: WebsiteTexts = {
  hero_title: "",
  hero_subtitle: "",
  hero_button_text: "",

  gallery_title: "",
  gallery_button_text: "",
  gallery_button_url: "",

  about_title: "",
  about_subtitle: "",
  about_text: "",

  contact_title: "",
  footer_title: "",
};

export function useWebsiteTexts() {
  const { toast } = useToast();
  const isGuest = useIsGuest();

  const [texts, setTexts] = useState<Record<Lang, WebsiteTexts>>({
    en: emptyTexts,
    sv: emptyTexts,
  });

  const [activeLang, setActiveLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function updateField<K extends keyof WebsiteTexts>(
    key: K,
    value: WebsiteTexts[K],
    lang: Lang = activeLang,
  ) {
    setTexts((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value,
      },
    }));
  }

  useEffect(() => {
    async function loadTexts() {
      if (isGuest) {
        setTexts({
          en: emptyTexts,
          sv: emptyTexts,
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("website_texts")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast({
          title: "Failed to load texts",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        setTexts({
          en: {
            hero_title: data.hero_title_en ?? "",
            hero_subtitle: data.hero_subtitle_en ?? "",
            hero_button_text: data.hero_button_text_en ?? "",

            gallery_title: data.gallery_title_en ?? "",
            gallery_button_text: data.gallery_button_text_en ?? "",
            gallery_button_url: data.gallery_button_url_en ?? "",

            about_title: data.about_title_en ?? "",
            about_subtitle: data.about_subtitle_en ?? "",
            about_text: data.about_text_en ?? "",

            contact_title: data.contact_title_en ?? "",
            footer_title: data.footer_title_en ?? "",
          },
          sv: {
            hero_title: data.hero_title_sv ?? "",
            hero_subtitle: data.hero_subtitle_sv ?? "",
            hero_button_text: data.hero_button_text_sv ?? "",

            gallery_title: data.gallery_title_sv ?? "",
            gallery_button_text: data.gallery_button_text_sv ?? "",
            gallery_button_url: data.gallery_button_url_sv ?? "",

            about_title: data.about_title_sv ?? "",
            about_subtitle: data.about_subtitle_sv ?? "",
            about_text: data.about_text_sv ?? "",

            contact_title: data.contact_title_sv ?? "",
            footer_title: data.footer_title_sv ?? "",
          },
        });
      }

      setIsLoading(false);
    }

    loadTexts();
  }, [toast, isGuest]);

  async function saveTexts() {
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

    const payload = {
      id: SETTINGS_ID,

      hero_title_en: texts.en.hero_title,
      hero_subtitle_en: texts.en.hero_subtitle,
      hero_button_text_en: texts.en.hero_button_text,

      gallery_title_en: texts.en.gallery_title,
      gallery_button_text_en: texts.en.gallery_button_text,
      gallery_button_url_en: texts.en.gallery_button_url,

      about_title_en: texts.en.about_title,
      about_subtitle_en: texts.en.about_subtitle,
      about_text_en: texts.en.about_text,

      contact_title_en: texts.en.contact_title,
      footer_title_en: texts.en.footer_title,

      hero_title_sv: texts.sv.hero_title,
      hero_subtitle_sv: texts.sv.hero_subtitle,
      hero_button_text_sv: texts.sv.hero_button_text,

      gallery_title_sv: texts.sv.gallery_title,
      gallery_button_text_sv: texts.sv.gallery_button_text,
      gallery_button_url_sv: texts.sv.gallery_button_url,

      about_title_sv: texts.sv.about_title,
      about_subtitle_sv: texts.sv.about_subtitle,
      about_text_sv: texts.sv.about_text,

      contact_title_sv: texts.sv.contact_title,
      footer_title_sv: texts.sv.footer_title,
    };

    const { error } = await supabase.from("website_texts").upsert(payload);

    setLoading(false);

    if (error) {
      console.error(error);
      toast({
        title: "Failed to save",
        variant: "destructive",
        description: (
          <div className="flex items-center gap-2">
            <TbGhost3 className="h-5 w-5" />
            <span className="text-xs">
              Something went wrong.
            </span>
          </div>
        ),
      });
      return;
    }

    toast({
      title: "Texts saved",
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
    texts,
    activeLang,
    setActiveLang,
    updateField,
    saveTexts,
    loading,
    isLoading,
  };
}
