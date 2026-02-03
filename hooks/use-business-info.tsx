"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TbGhost3 } from "react-icons/tb";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export type BusinessInfo = {
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  order_pickup: string;
  order_delivery: string;
};

export function useBusinessInfo() {
  const { toast } = useToast();
  const isGuest = useIsGuest();

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    address: "",
    phone: "",
    email: "",
    opening_hours: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    order_pickup: "",
    order_delivery: "",
  });

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function updateField<K extends keyof BusinessInfo>(
    key: K,
    value: BusinessInfo[K],
  ) {
    setBusinessInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    async function loadBusinessInfo() {
      if (isGuest) {
        setBusinessInfo({
          address: "",
          phone: "",
          email: "",
          opening_hours: "",
          facebook: "",
          instagram: "",
          tiktok: "",
          order_pickup: "",
          order_delivery: "",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("business_info")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast({
          title: "Failed to load settings",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        setBusinessInfo({
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          opening_hours: data.opening_hours ?? "",
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          tiktok: data.tiktok ?? "",
          order_pickup: data.order_pickup ?? "",
          order_delivery: data.order_delivery ?? "",
        });
      }

      setIsLoading(false);
    }

    loadBusinessInfo();
  }, [toast, isGuest]);

  async function saveBusinessInfo() {
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

    const { error } = await supabase.from("business_info").upsert({
      id: SETTINGS_ID,
      ...businessInfo,
    });

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
              Uh oh, something went wrong.
            </span>
          </div>
        ),
      });
      return;
    }

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
    businessInfo,
    updateField,
    saveBusinessInfo,
    loading,
    isLoading,
  };
}
