import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

type CatalogueLanguage = "en" | "sv";

type CatalogueItem = {
  id: string;
  order: number;
  image: string | null;
  title: Record<CatalogueLanguage, string>;
  description: Record<CatalogueLanguage, string>;
  tags: Record<CatalogueLanguage, string[]>;
};

type CatalogueCategory = {
  id: string;
  title: Record<CatalogueLanguage, string>;
  order: number;
  items: CatalogueItem[];
};

type RawCatalogueItem = Partial<CatalogueItem>;
type RawCatalogueCategory = Omit<Partial<CatalogueCategory>, "title"> & {
  title?: string | Record<CatalogueLanguage, string> | null;
};

function normalizeCategoryTitle(
  title: RawCatalogueCategory["title"],
  index: number,
) {
  if (typeof title === "string") {
    return { en: title, sv: "" };
  }
  return {
    en: title?.en ?? `Catalogue Category ${index + 1}`,
    sv: title?.sv ?? "",
  };
}

function normalizeItems(
  rawItems: RawCatalogueItem[] | undefined,
  categoryIndex: number,
) {
  return (rawItems ?? [])
    .map((item, itemIndex) => ({
      id: item.id ?? `item-${categoryIndex}-${itemIndex}`,
      order: item.order ?? itemIndex + 1,
      image: item.image ?? null,
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
    }))
    .sort((a, b) => a.order - b.order);
}

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("categoryId");
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("catalogue")
    .select("categories")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to load catalogue data." },
      { status: 500 },
    );
  }

  const rawCategories = (data?.categories ?? []) as RawCatalogueCategory[];
  const normalizedCategories = rawCategories
    .map((category, categoryIndex) => ({
      id: category.id ?? `category-${categoryIndex}`,
      title: normalizeCategoryTitle(category.title, categoryIndex),
      order: category.order ?? categoryIndex + 1,
      items: category.items ?? [],
    }))
    .sort((a, b) => a.order - b.order);

  if (!categoryId) {
    const categories = normalizedCategories.map(({ id, title, order }) => ({
      id,
      title,
      order,
    }));

    return NextResponse.json(
      { categories },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const sourceCategoryIndex = normalizedCategories.findIndex(
    (category) => category.id === categoryId,
  );
  const sourceCategory =
    sourceCategoryIndex >= 0
      ? normalizedCategories[sourceCategoryIndex]
      : undefined;

  const items = normalizeItems(
    sourceCategory?.items as RawCatalogueItem[] | undefined,
    sourceCategoryIndex >= 0 ? sourceCategoryIndex : 0,
  );

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store" } },
  );
}
