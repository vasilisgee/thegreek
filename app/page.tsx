import HomeClient from "./home-client";
import { createServerClient } from "@/lib/supabase/server";
import type {
  BusinessInfo,
  WebsiteBasics,
  WebsiteTexts,
  MediaAssets,
  CatalogueCategorySummary,
  CatalogueItem,
} from "./home-client";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const MEDIA_ASSET_COLUMNS =
  "hero_image, hero_video, " +
  "thumb_gallery_1, thumb_gallery_2, thumb_gallery_3, thumb_gallery_4, " +
  "slider_gallery_1, slider_gallery_2, slider_gallery_3, slider_gallery_4, " +
  "slider_gallery_1_title_en, slider_gallery_1_title_sv, " +
  "slider_gallery_2_title_en, slider_gallery_2_title_sv, " +
  "slider_gallery_3_title_en, slider_gallery_3_title_sv, " +
  "slider_gallery_4_title_en, slider_gallery_4_title_sv";
const MEDIA_ASSET_SELECT = `${MEDIA_ASSET_COLUMNS}, updated_at`;
const EMPTY_MEDIA_ASSETS: MediaAssets = {
  hero_image: null,
  hero_video: null,
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

export const revalidate = 60;

type CatalogueLanguage = "en" | "sv";

type RawCatalogueItem = Partial<CatalogueItem>;
type RawCatalogueCategory = {
  id?: string | null;
  title?: string | Record<CatalogueLanguage, string> | null;
  order?: number | null;
  items?: RawCatalogueItem[] | null;
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

export default async function HomePage() {
  const supabase = createServerClient();

  const [
    businessInfoResult,
    websiteBasicsResult,
    websiteTextsResult,
    mediaAssetsResult,
    catalogueResult,
  ] = await Promise.all([
    supabase
      .from("business_info")
      .select(
        "address, phone, email, opening_hours, facebook, instagram, tiktok, order_delivery",
      )
      .eq("id", SETTINGS_ID)
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("google_maps")
      .eq("id", SETTINGS_ID)
      .maybeSingle(),
    supabase
      .from("website_texts")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle(),
    supabase
      .from("media_assets")
      .select(MEDIA_ASSET_SELECT)
      .eq("id", SETTINGS_ID)
      .maybeSingle(),
    supabase
      .from("catalogue")
      .select("categories")
      .eq("id", SETTINGS_ID)
      .maybeSingle(),
  ]);

  const businessInfo: BusinessInfo | null = businessInfoResult.error
    ? null
    : businessInfoResult.data ?? null;
  const websiteBasics: WebsiteBasics | null = websiteBasicsResult.error
    ? null
    : websiteBasicsResult.data ?? null;
  const websiteTexts: WebsiteTexts | null = websiteTextsResult.error
    ? null
    : websiteTextsResult.data ?? null;
  const rawMediaAssets = mediaAssetsResult.error
    ? null
    : (mediaAssetsResult.data as (MediaAssets & { updated_at?: string | null }) | null);
  const mediaAssetsVersion = rawMediaAssets?.updated_at ?? null;
  const mediaAssets: MediaAssets = mediaAssetsResult.error
    ? EMPTY_MEDIA_ASSETS
    : ((rawMediaAssets
        ? (({ updated_at, ...rest }) => rest)(rawMediaAssets)
        : EMPTY_MEDIA_ASSETS) as MediaAssets);

  const rawCategories = (catalogueResult.error
    ? []
    : (catalogueResult.data?.categories ?? [])) as RawCatalogueCategory[];
  const normalizedCategories = rawCategories
    .map((category, categoryIndex) => ({
      id: category.id ?? `category-${categoryIndex}`,
      title: normalizeCategoryTitle(category.title, categoryIndex),
      order: category.order ?? categoryIndex + 1,
      items: category.items ?? [],
    }))
    .sort((a, b) => a.order - b.order);
  const initialCatalogueCategories: CatalogueCategorySummary[] =
    normalizedCategories.map(({ id, title, order }) => ({
      id,
      title,
      order,
    }));
  const initialActiveMenuItems =
    normalizedCategories.length > 0
      ? normalizeItems(
          normalizedCategories[0]?.items as RawCatalogueItem[] | undefined,
          0,
        )
      : [];

  return (
    <HomeClient
      initialBusinessInfo={businessInfo}
      initialWebsiteBasics={websiteBasics}
      initialWebsiteTexts={websiteTexts}
      initialMediaAssets={mediaAssets}
      initialMediaAssetsVersion={mediaAssetsVersion}
      initialCatalogueCategories={initialCatalogueCategories}
      initialActiveMenuItems={initialActiveMenuItems}
    />
  );
}
