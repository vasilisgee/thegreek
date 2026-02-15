"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TbGhost3 } from "react-icons/tb";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { useIsGuest } from "@/lib/auth/guest";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "site-assets";
const CATALOGUE_PREFIX = "catalogue";

export type CatalogueLanguage = "en" | "sv";

export type CatalogueItem = {
  id: string;
  order: number;
  image: string | null;
  file: File | null;
  title: Record<CatalogueLanguage, string>;
  description: Record<CatalogueLanguage, string>;
  tags: Record<CatalogueLanguage, string[]>;
  tagInput: Record<CatalogueLanguage, string>;
};

export type CatalogueCategory = {
  id: string;
  title: Record<CatalogueLanguage, string>;
  order: number;
  items: CatalogueItem[];
};

type CatalogueItemStored = Omit<CatalogueItem, "file" | "tagInput">;
type CatalogueCategoryStored = {
  id: string;
  title: Record<CatalogueLanguage, string>;
  order: number;
  items: CatalogueItemStored[];
};
type RawCatalogueCategoryStored = Omit<CatalogueCategoryStored, "title"> & {
  title?: string | Record<CatalogueLanguage, string> | null;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createItem = (order = 1): CatalogueItem => ({
  id: createId(),
  order,
  image: null,
  file: null,
  title: { en: "", sv: "" },
  description: { en: "", sv: "" },
  tags: { en: [], sv: [] },
  tagInput: { en: "", sv: "" },
});

const createCategory = (index = 1): CatalogueCategory => ({
  id: createId(),
  title: {
    en: `Catalogue Category ${index}`,
    sv: "",
  },
  order: index,
  items: [],
});

function normalizeStoredCategories(
  stored: RawCatalogueCategoryStored[] | null | undefined,
): CatalogueCategory[] {
  if (!stored || stored.length === 0) {
    return [createCategory(1)];
  }

  const seenCategoryIds = new Set<string>();

  return stored.map((category, categoryIndex) => {
    let normalizedCategoryId = category.id ?? createId();
    if (seenCategoryIds.has(normalizedCategoryId)) {
      normalizedCategoryId = createId();
    }
    seenCategoryIds.add(normalizedCategoryId);

    const seenItemIds = new Set<string>();
    const normalizedItems = (category.items ?? []).map((item, itemIndex) => {
      let normalizedItemId = item.id ?? createId();
      if (seenItemIds.has(normalizedItemId)) {
        normalizedItemId = createId();
      }
      seenItemIds.add(normalizedItemId);

      return {
        id: normalizedItemId,
        order: item.order ?? itemIndex + 1,
        image: item.image ?? null,
        file: null,
        title: {
          en: item.title?.en ?? "",
          sv: item.title?.sv ?? "",
        },
        description: {
          en: item.description?.en ?? "",
          sv: item.description?.sv ?? "",
        },
        tags: {
          en: item.tags?.en ?? [],
          sv: item.tags?.sv ?? [],
        },
        tagInput: { en: "", sv: "" },
      };
    });

    return {
      id: normalizedCategoryId,
      title:
        typeof category.title === "string"
          ? { en: category.title, sv: "" }
          : {
              en: category.title?.en ?? "",
              sv: category.title?.sv ?? "",
            },
      order: category.order ?? categoryIndex + 1,
      items: normalizedItems,
    };
  });
}

export function useCatalogue() {
  const isGuest = useIsGuest();

  const [categories, setCategories] = useState<CatalogueCategory[]>([
    createCategory(1),
  ]);
  const [persistedCategories, setPersistedCategories] = useState<
    RawCatalogueCategoryStored[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (isGuest) {
        setCategories([createCategory(1)]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("catalogue")
        .select("categories")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        toast.error("Failed to load catalogue", {
          description: "Something went wrong.",
          icon: <TbGhost3 className="h-5 w-5" />,
        });
        setIsLoading(false);
        return;
      }

      const nextCategories = normalizeStoredCategories(
        (data?.categories ?? null) as RawCatalogueCategoryStored[] | null,
      );
      setCategories(nextCategories);
      setPersistedCategories(
        ((data?.categories ?? null) as RawCatalogueCategoryStored[] | null) ?? [],
      );
      setIsLoading(false);
    }

    load();
  }, [isGuest]);

  async function saveCatalogue(overrideCategories?: CatalogueCategory[]) {
    if (isGuest) {
      toast("Guest mode", {
        description: "Saving is disabled for guest users.",
        icon: <TbGhost3 className="h-5 w-5" />,
      });
      return;
    }

    setLoading(true);

    const sourceCategories = overrideCategories ?? categories;
    const nextCategories: CatalogueCategory[] = [];
    const usedPaths = new Set<string>();

    const uploadCatalogueFile = async (file: File) => {
      const originalName = file.name.trim();
      const extensionIndex = originalName.lastIndexOf(".");
      const baseName =
        extensionIndex > 0 ? originalName.slice(0, extensionIndex) : originalName;
      const extension = extensionIndex > 0 ? originalName.slice(extensionIndex) : "";
      const safeBase = baseName.length > 0 ? baseName : "catalogue-item";

      for (let attempt = 0; attempt < 50; attempt += 1) {
        const suffix = attempt === 0 ? "" : `-${attempt}`;
        const fileName = `${safeBase}${suffix}${extension}`;
        const filePath = `${CATALOGUE_PREFIX}/${fileName}`;

        if (usedPaths.has(filePath)) {
          continue;
        }

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, file, { upsert: false, cacheControl: "31536000" });

        if (!error) {
          usedPaths.add(filePath);
          return filePath;
        }

        const errorMessage = (error as { message?: string }).message ?? "";
        const normalizedMessage = errorMessage.toLowerCase();
        const isDuplicate =
          normalizedMessage.includes("already exists") ||
          normalizedMessage.includes("duplicate") ||
          normalizedMessage.includes("exist");

        if (!isDuplicate) {
          throw error;
        }
      }

      throw new Error("Could not generate a unique filename.");
    };

    for (const [categoryIndex, category] of sourceCategories.entries()) {
      const nextItems: CatalogueItem[] = [];

      for (const [itemIndex, item] of category.items.entries()) {
        let nextItem: CatalogueItem = {
          ...item,
          order: itemIndex + 1,
        };

        if (item.file instanceof File) {
          let filePath: string;

          try {
            filePath = await uploadCatalogueFile(item.file);
          } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Upload failed", {
              icon: <TbGhost3 className="h-5 w-5" />,
            });
            return;
          }

          nextItem = {
            ...nextItem,
            image: filePath,
            file: null,
          };
        }

        nextItems.push(nextItem);
      }

      nextCategories.push({
        ...category,
        order: categoryIndex + 1,
        items: nextItems,
      });
    }

    const payloadCategories: CatalogueCategoryStored[] = nextCategories.map(
      (category, categoryIndex) => ({
        id: category.id,
        title: category.title,
        order: category.order ?? categoryIndex + 1,
        items: category.items.map((item, itemIndex) => ({
          id: item.id,
          order: item.order ?? itemIndex + 1,
          image: item.image ?? null,
          title: item.title,
          description: item.description,
          tags: item.tags,
        })),
      }),
    );

    const previousImages = new Set(
      persistedCategories.flatMap((category) =>
        (category.items ?? [])
          .map((item) => item.image ?? null)
          .filter((image): image is string => Boolean(image)),
      ),
    );

    const nextImages = new Set(
      payloadCategories.flatMap((category) =>
        category.items
          .map((item) => item.image ?? null)
          .filter((image): image is string => Boolean(image)),
      ),
    );

    const imagesToRemove = Array.from(previousImages).filter(
      (image) => !nextImages.has(image),
    );

    if (imagesToRemove.length > 0) {
      await supabase.storage.from(BUCKET).remove(imagesToRemove);
    }

    const { error } = await supabase.from("catalogue").upsert({
      id: SETTINGS_ID,
      categories: payloadCategories,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Save failed", {
        icon: <TbGhost3 className="h-5 w-5" />,
      });
      return;
    }

    setCategories(nextCategories);
    setPersistedCategories(payloadCategories);

    toast("Catalogue saved", {
      description: "Changes saved successfully.",
      icon: <FaRegFloppyDisk className="h-5 w-5" />,
    });
  }

  async function deleteCategory(categoryId: string) {
    const nextCategories = categories.filter(
      (category) => category.id !== categoryId,
    );
    setCategories(nextCategories);
    await saveCatalogue(nextCategories);
  }

  return {
    categories,
    setCategories,
    saveCatalogue,
    deleteCategory,
    loading,
    isLoading,
  };
}
