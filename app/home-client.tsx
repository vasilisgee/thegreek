"use client";
"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CircleCheckBig,
  Clock3,
  Facebook,
  Github,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Music2,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

export type BusinessInfo = {
  address: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  order_delivery: string | null;
};
export type WebsiteBasics = {
  google_maps: string | null;
};
export type WebsiteTexts = {
  hero_title_en: string | null;
  hero_title_sv: string | null;
  hero_subtitle_en: string | null;
  hero_subtitle_sv: string | null;
  hero_button_text_en: string | null;
  hero_button_text_sv: string | null;
  about_title_en: string | null;
  about_title_sv: string | null;
  about_sutitle_en: string | null;
  about_subtitle_sv: string | null;
  about_text_en: string | null;
  about_text_sv: string | null;
  gallery_title_en: string | null;
  gallery_title_sv: string | null;
  gallery_button_text_en: string | null;
  gallery_button_text_sv: string | null;
  gallery_button_url_en: string | null;
  gallery_button_url_sv: string | null;
  contact_title_en: string | null;
  contact_title_sv: string | null;
  footer_title_en: string | null;
  footer_title_sv: string | null;
};

export type MediaAssets = {
  hero_image: string | null;
  hero_video: string | null;
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

type CatalogueLanguage = "en" | "sv";

export type CatalogueItem = {
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
export type CatalogueCategorySummary = Omit<CatalogueCategory, "items">;

const BUCKET = "site-assets";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

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

type HomeClientProps = {
  initialBusinessInfo: BusinessInfo | null;
  initialWebsiteBasics: WebsiteBasics | null;
  initialWebsiteTexts: WebsiteTexts | null;
  initialMediaAssets: MediaAssets | null;
  initialMediaAssetsVersion: string | null;
  initialCatalogueCategories: CatalogueCategorySummary[];
  initialActiveMenuItems: CatalogueItem[];
};

function buildMenuItemsCache(
  categories: CatalogueCategorySummary[],
  items: CatalogueItem[],
) {
  const firstCategoryId = categories[0]?.id;
  if (!firstCategoryId || items.length === 0) {
    return {};
  }

  return {
    [firstCategoryId]: items,
  };
}

function toPublicUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (!SUPABASE_URL) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function HomeClient({
  initialBusinessInfo,
  initialWebsiteBasics,
  initialWebsiteTexts,
  initialMediaAssets,
  initialMediaAssetsVersion,
  initialCatalogueCategories,
  initialActiveMenuItems,
}: HomeClientProps) {

  const pathname = usePathname();
  const lang = pathname.startsWith("/sv") ? "sv" : "en";
  const isSV = pathname.startsWith("/sv");
  const englishHref = isSV
    ? pathname.replace(/^\/sv(?=\/|$)/, "") || "/"
    : pathname;
  const swedishHref = isSV ? pathname : `/sv${pathname === "/" ? "" : pathname}`;
  const businessInfo = initialBusinessInfo;
  const websiteBasics = initialWebsiteBasics;
  const websiteTexts = initialWebsiteTexts;
  const mediaAssets = initialMediaAssets ?? EMPTY_MEDIA_ASSETS;
  const mediaAssetsVersion = initialMediaAssetsVersion;
  const appendMediaVersion = (url: string | null) => {
    if (!url || !mediaAssetsVersion) return url;
    if (
      !url.includes("/storage/v1/object/public/") &&
      (!SUPABASE_URL || !url.startsWith(SUPABASE_URL))
    ) {
      return url;
    }
    if (url.includes("v=")) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${encodeURIComponent(mediaAssetsVersion)}`;
  };
  const toMediaAssetUrl = (path: string | null) =>
    appendMediaVersion(toPublicUrl(path));
  const [catalogueCategories, setCatalogueCategories] = useState<
    CatalogueCategorySummary[]
  >(initialCatalogueCategories);
  const [activeMenuItems, setActiveMenuItems] = useState<CatalogueItem[]>(
    initialActiveMenuItems,
  );
  const [isMenuItemsLoading, setIsMenuItemsLoading] = useState(false);
  const [isMenuItemsFetchingFresh, setIsMenuItemsFetchingFresh] = useState(false);
  const [isMenuTabTransitioning, setIsMenuTabTransitioning] = useState(false);
  const [menuAnimateIn, setMenuAnimateIn] = useState(
    initialActiveMenuItems.length > 0,
  );
  const menuItemsCacheRef = useRef<Record<string, CatalogueItem[]>>(
    buildMenuItemsCache(initialCatalogueCategories, initialActiveMenuItems),
  );
  const menuTransitionTimeoutRef = useRef<number | null>(null);
  const [activeMenuTab, setActiveMenuTab] = useState(0);

  useEffect(() => {
    menuItemsCacheRef.current = buildMenuItemsCache(
      initialCatalogueCategories,
      initialActiveMenuItems,
    );
    setCatalogueCategories(initialCatalogueCategories);
    setActiveMenuItems(initialActiveMenuItems);
    setActiveMenuTab(0);
    setIsMenuItemsLoading(false);
    setIsMenuItemsFetchingFresh(false);
    setIsMenuTabTransitioning(false);
    setMenuAnimateIn(initialActiveMenuItems.length > 0);
  }, [initialCatalogueCategories, initialActiveMenuItems]);

  useEffect(() => {
    if (initialCatalogueCategories.length > 0) return;
    async function loadCatalogue() {
      try {
        const response = await fetch("/api/catalogue", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load catalogue categories (${response.status})`);
        }

        const payload = (await response.json()) as {
          categories?: CatalogueCategorySummary[];
        };
        const nextCategories = [...(payload.categories ?? [])].sort(
          (a, b) => a.order - b.order,
        );
        menuItemsCacheRef.current = {};
        setActiveMenuItems([]);
        setCatalogueCategories(nextCategories);
        setActiveMenuTab(0);
      } catch (error) {
        console.error(error);
        setCatalogueCategories([]);
        setActiveMenuItems([]);
        menuItemsCacheRef.current = {};
      }
    }

    loadCatalogue();
  }, [initialCatalogueCategories.length]);

  function t(field: string) {
    if (!websiteTexts) return "";

    const key = `${field}_${lang}` as keyof WebsiteTexts;
    return websiteTexts[key] ?? "";
  }

  const stripHtml = (value: string) => value.replace(/<[^>]*>/g, "").trim();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const scrollToSection = (target: string, behavior: ScrollBehavior = "auto") => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior });
  };

  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [activeBusinessPanel, setActiveBusinessPanel] = useState<
    "contact" | "message"
  >("contact");
  const [messagePanelReady, setMessagePanelReady] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactPulseKey, setContactPulseKey] = useState(0);
  const [activeEventsSlide, setActiveEventsSlide] = useState(0);
  const [isEventsPaused, setIsEventsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );
  const [canScrollMenuPrev, setCanScrollMenuPrev] = useState(false);
  const [canScrollMenuNext, setCanScrollMenuNext] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isHeaderMenuClosing, setIsHeaderMenuClosing] = useState(false);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const [isHeaderBrandHidden, setIsHeaderBrandHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const closeHeaderMenu = useCallback(() => {
    if (!isHeaderMenuOpen || isHeaderMenuClosing) return;
    setIsHeaderMenuClosing(true);
    window.setTimeout(() => {
      setIsHeaderMenuClosing(false);
      setIsHeaderMenuOpen(false);
    }, 300);
  }, [isHeaderMenuOpen, isHeaderMenuClosing]);

  const handleHeaderMenuNavigate = (target: string) => {
    closeHeaderMenu();
    window.setTimeout(() => {
      scrollToSection(target, "smooth");
    }, 320);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };
    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const updateLogoVisibility = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;

      if (currentY <= 16) {
        setIsHeaderBrandHidden(false);
      } else if (deltaY > 4) {
        setIsHeaderBrandHidden(true);
      } else if (deltaY < -4) {
        setIsHeaderBrandHidden(false);
      }

      lastScrollYRef.current = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateLogoVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isHeaderMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isHeaderMenuOpen]);

  useEffect(() => {
    if (!isHeaderMenuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeHeaderMenu();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isHeaderMenuOpen, closeHeaderMenu]);

  const heroImageUrl = toMediaAssetUrl(mediaAssets?.hero_image ?? null);
  const heroVideoUrl = toMediaAssetUrl(mediaAssets?.hero_video ?? null);
  const shouldUseHeroVideo =
    Boolean(heroVideoUrl) && !prefersReducedMotion && !isMobileViewport;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldUseHeroVideo) {
      setShouldLoadHeroVideo(false);
      setIsHeroVideoReady(false);
      return;
    }

    let isCancelled = false;
    let startTimeoutId: number | null = null;
    const fallbackTimeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        setShouldLoadHeroVideo(true);
      }
    }, 4000);

    const scheduleAfterLoad = () => {
      startTimeoutId = window.setTimeout(() => {
        if (!isCancelled) {
          setShouldLoadHeroVideo(true);
        }
      }, 900);
    };

    if (document.readyState === "complete") {
      scheduleAfterLoad();
    } else {
      window.addEventListener("load", scheduleAfterLoad, { once: true });
    }

    return () => {
      isCancelled = true;
      window.clearTimeout(fallbackTimeoutId);
      if (startTimeoutId) {
        window.clearTimeout(startTimeoutId);
      }
      window.removeEventListener("load", scheduleAfterLoad);
    };
  }, [shouldUseHeroVideo]);


  const heroTitleText = stripHtml(t("hero_title"));
  const heroImageAlt = heroTitleText
    ? `${heroTitleText} hero image`
    : "Hero image";
  const aboutTitleText = stripHtml(t("about_title"));
  const aboutGalleryAltBase = aboutTitleText || "Gallery image";
  const galleryTitleText = stripHtml(t("gallery_title"));
  const orderOnlineUrl = businessInfo?.order_delivery?.trim() || "";
  const thumbImages = [
    toMediaAssetUrl(mediaAssets?.thumb_gallery_1 ?? null),
    toMediaAssetUrl(mediaAssets?.thumb_gallery_2 ?? null),
    toMediaAssetUrl(mediaAssets?.thumb_gallery_3 ?? null),
    toMediaAssetUrl(mediaAssets?.thumb_gallery_4 ?? null),
  ].filter((src): src is string => Boolean(src));

  const sliderSlides = [
    {
      image: toMediaAssetUrl(mediaAssets?.slider_gallery_1 ?? null),
      titleEn: mediaAssets?.slider_gallery_1_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_1_title_sv ?? "",
    },
    {
      image: toMediaAssetUrl(mediaAssets?.slider_gallery_2 ?? null),
      titleEn: mediaAssets?.slider_gallery_2_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_2_title_sv ?? "",
    },
    {
      image: toMediaAssetUrl(mediaAssets?.slider_gallery_3 ?? null),
      titleEn: mediaAssets?.slider_gallery_3_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_3_title_sv ?? "",
    },
    {
      image: toMediaAssetUrl(mediaAssets?.slider_gallery_4 ?? null),
      titleEn: mediaAssets?.slider_gallery_4_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_4_title_sv ?? "",
    },
  ].filter((slide) => Boolean(slide.image));

  const activeMenuTabIndex = Math.min(
    activeMenuTab,
    Math.max(0, catalogueCategories.length - 1),
  );

  useEffect(() => {
    const activeCategory = catalogueCategories[activeMenuTabIndex];
    if (!activeCategory) {
      setActiveMenuItems([]);
      setIsMenuItemsLoading(false);
      setIsMenuItemsFetchingFresh(false);
      setIsMenuTabTransitioning(false);
      setMenuAnimateIn(false);
      return;
    }

    if (menuTransitionTimeoutRef.current) {
      window.clearTimeout(menuTransitionTimeoutRef.current);
      menuTransitionTimeoutRef.current = null;
    }

    const cachedItems = menuItemsCacheRef.current[activeCategory.id];
    if (cachedItems) {
      setIsMenuItemsFetchingFresh(false);
      if (cachedItems === activeMenuItems && menuAnimateIn) {
        setIsMenuItemsLoading(false);
        setIsMenuTabTransitioning(false);
        return;
      }
      setIsMenuItemsLoading(true);
      menuTransitionTimeoutRef.current = window.setTimeout(() => {
        setActiveMenuItems(cachedItems);
        setIsMenuItemsLoading(false);
        setIsMenuTabTransitioning(false);
        setMenuAnimateIn(true);
        menuTransitionTimeoutRef.current = null;
      }, 250);
      return;
    }

    let isCancelled = false;

    async function loadCategoryItems() {
      setIsMenuItemsLoading(true);
      setIsMenuItemsFetchingFresh(true);

      try {
        const response = await fetch(
          `/api/catalogue?categoryId=${encodeURIComponent(activeCategory.id)}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error(
            `Failed to load catalogue category (${response.status})`,
          );
        }

        const payload = (await response.json()) as {
          items?: CatalogueItem[];
        };

        if (isCancelled) return;

        const nextItems = [...(payload.items ?? [])].sort(
          (a, b) => a.order - b.order,
        );
        menuItemsCacheRef.current = {
          ...menuItemsCacheRef.current,
          [activeCategory.id]: nextItems,
        };
        setActiveMenuItems(nextItems);
      } catch (error) {
        if (isCancelled) return;
        console.error(error);
        setActiveMenuItems([]);
      }
      if (isCancelled) return;
      setIsMenuItemsLoading(false);
      setIsMenuItemsFetchingFresh(false);

      window.requestAnimationFrame(() => {
        if (!isCancelled) {
          setIsMenuTabTransitioning(false);
          window.requestAnimationFrame(() => {
            setMenuAnimateIn(true);
          });
        }
      });
    }

    loadCategoryItems();

    return () => {
      isCancelled = true;
      if (menuTransitionTimeoutRef.current) {
        window.clearTimeout(menuTransitionTimeoutRef.current);
        menuTransitionTimeoutRef.current = null;
      }
    };
  }, [activeMenuTabIndex, catalogueCategories]);

  const [menuEmblaRef, menuEmblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: isMobileViewport ? 1 : 4,
    containScroll: "keepSnaps",
    duration: 30,
    loop: false,
  });
  const eventsFadePlugin = useMemo(() => [Fade()], []);
  const [eventsEmblaRef, eventsEmblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    loop: sliderSlides.length > 1,
    duration: 60,
  }, eventsFadePlugin);

  useEffect(() => {
    if (!menuEmblaApi) return;
    menuEmblaApi.reInit();
    menuEmblaApi.scrollTo(0, true);
  }, [menuEmblaApi, activeMenuTabIndex, activeMenuItems.length]);

  useEffect(() => {
    if (!menuEmblaApi) {
      setCanScrollMenuPrev(false);
      setCanScrollMenuNext(false);
      return;
    }

    const syncMenuEdgeFades = () => {
      setCanScrollMenuPrev(menuEmblaApi.canScrollPrev());
      setCanScrollMenuNext(menuEmblaApi.canScrollNext());
    };

    syncMenuEdgeFades();
    menuEmblaApi.on("select", syncMenuEdgeFades);
    menuEmblaApi.on("reInit", syncMenuEdgeFades);

    return () => {
      menuEmblaApi.off("select", syncMenuEdgeFades);
      menuEmblaApi.off("reInit", syncMenuEdgeFades);
    };
  }, [menuEmblaApi, activeMenuItems.length]);

  useEffect(() => {
    if (!eventsEmblaApi) return;

    const syncSelected = () => {
      setActiveEventsSlide(eventsEmblaApi.selectedScrollSnap());
    };

    syncSelected();
    eventsEmblaApi.on("select", syncSelected);
    eventsEmblaApi.on("reInit", syncSelected);

    return () => {
      eventsEmblaApi.off("select", syncSelected);
      eventsEmblaApi.off("reInit", syncSelected);
    };
  }, [eventsEmblaApi]);

  useEffect(() => {
    if (!eventsEmblaApi || isEventsPaused || sliderSlides.length < 2) return;

    const autoplayId = window.setInterval(() => {
      eventsEmblaApi.scrollNext();
    }, 4000);

    return () => {
      window.clearInterval(autoplayId);
    };
  }, [eventsEmblaApi, isEventsPaused, sliderSlides.length]);

  const activeEventSlide = sliderSlides[activeEventsSlide] ?? null;
  const activeEventTitle = activeEventSlide
    ? isSV
      ? activeEventSlide.titleSv || activeEventSlide.titleEn
      : activeEventSlide.titleEn || activeEventSlide.titleSv
    : "";

  const handleMenuTabChange = (index: number) => {
    if (index === activeMenuTabIndex) return;
    setIsMenuTabTransitioning(true);
    setIsMenuItemsLoading(true);
    setMenuAnimateIn(false);
    setActiveMenuTab(index);
  };

  return (
    <>
      <main className="page-bg w-full overflow-hidden ">
        {/* ================= HEADER ================= */}
        <header className="fixed top-0 left-0 w-full z-50 ">
          <div className="p-3 relative flex items-center justify-between gap-4">
            <div
              className={`text-2xl font-bold tracking-tight transition-transform duration-200 ease-out ${
                isHeaderBrandHidden
                  ? "-translate-y-20 pointer-events-none"
                  : "translate-y-0"
              }`}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
              >
                <strong className="font-extrabold bg-brand-primary text-white p-2 rounded-xl text-xl md:text-2xl">
                  theGreek
                </strong>
              </a>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <Link
                className={`bg-white text-brand-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-white/90 transition shadow-xl hidden md:block transition-transform duration-200 ease-out ${
                  isHeaderBrandHidden
                    ? "-translate-y-20 pointer-events-none"
                    : "translate-y-0"
                }`}
                href="/login"
                target="_blank"
              >
                Admin Demo
              </Link>

              <div
                className={`flex rounded-full bg-brand-primary p-1 shadow-xl transition-transform duration-200 ease-out ${
                  isHeaderBrandHidden
                    ? "-translate-y-20 pointer-events-none"
                    : "translate-y-0"
                }`}
              >
                <Link
                  href={englishHref}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition
                  ${
                    !isSV
                      ? "bg-white text-brand-primary"
                      : "text-white opacity-80 hover:opacity-100"
                  }
                `}
                >
                  EN
                </Link>

                <Link
                  href={swedishHref}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition
                  ${
                    isSV
                      ? "bg-white text-brand-primary"
                      : "text-white opacity-80 hover:opacity-100"
                  }
                `}
                >
                  SV
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsHeaderMenuClosing(false);
                  setIsHeaderMenuOpen(true);
                }}
                className="w-11 h-11 rounded-full bg-brand-primary text-white inline-flex items-center justify-center hover:bg-brand-primary/90 transition shadow-xl cursor-pointer"
                aria-label="Open navigation menu"
              >
                <span className="relative block h-4 w-5">
                  <span className="absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-white" />
                  <span className="absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-white" />
                  <span className="absolute left-0 top-[14px] block h-0.5 w-5 rounded-full bg-white" />
                </span>
              </button>
            </div>
          </div>
        </header>

        {isHeaderMenuOpen ? (
          <div
            className={`fixed inset-0 z-[60] bg-brand-primary text-white p-3 px-4 ${
              isHeaderMenuClosing
                ? "animate-[fadeIn_0.3s_ease-out_reverse]"
                : "animate-[fadeIn_0.3s_ease-out]"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <strong className="font-extrabold text-white text-xl md:text-2xl tracking-tight pl-1">
                  theGreek
                </strong>
                <button
                  type="button"
                  onClick={closeHeaderMenu}
                  className="w-11 h-11 rounded-full bg-white/10 text-white inline-flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <span className="text-3xl leading-none">&times;</span>
                </button>
              </div>

              <nav className="flex flex-1 flex-col items-center justify-center gap-7">
                <button
                  type="button"
                  onClick={() => handleHeaderMenuNavigate(".section-hero")}
                  className="text-3xl md:text-4xl font-light tracking-tight text-white hover:opacity-80 transition cursor-pointer"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderMenuNavigate(".section-about")}
                  className="text-3xl md:text-4xl font-light tracking-tight text-white hover:opacity-80 transition cursor-pointer"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderMenuNavigate(".section-menu")}
                  className="text-3xl md:text-4xl font-light tracking-tight text-white hover:opacity-80 transition cursor-pointer"
                >
                  Our Menu
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderMenuNavigate(".section-slider")}
                  className="text-3xl md:text-4xl font-light tracking-tight text-white hover:opacity-80 transition cursor-pointer"
                >
                  Live Events
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderMenuNavigate(".section-contact")}
                  className="text-3xl md:text-4xl font-light tracking-tight text-white hover:opacity-80 transition cursor-pointer"
                >
                  Contact & Order
                </button>
                <button
                  type="button"
                  onClick={() => handleHeaderMenuNavigate(".section-footer")}
                  className="text-3xl md:text-4xl font-light tracking-tight text-white hover:opacity-80 transition cursor-pointer"
                >
                  Reviews
                </button>
              </nav>
            </div>
          </div>
        ) : null}

        {/* ================= HERO ================= */}
        <section className="section-hero relative h-screen w-full overflow-hidden">
          {heroImageUrl ? (
            <Image
              className="hero-bg object-cover z-0"
              src={heroImageUrl}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
            />
          ) : (
            <div className="hero-bg absolute inset-0 w-full h-full bg-black/10 z-0" />
          )}
          {shouldUseHeroVideo && shouldLoadHeroVideo ? (
            <video
              className={`hero-bg absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ${
                isHeroVideoReady ? "opacity-100" : "opacity-0"
              }`}
              src={heroVideoUrl ?? undefined}
              poster={heroImageUrl ?? undefined}
              preload="none"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsHeroVideoReady(true)}
              aria-hidden="true"
            />
          ) : null}
          <div className="hero-overlay-depth absolute inset-0 z-10" />

          <div className="hero-content relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 m">
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-0 sm:px-6">
              <h1
                className="hero-title text-5xl lg:text-8xl font-light mb-6  tracking-tight "
                dangerouslySetInnerHTML={{ __html: t("hero_title") }}
              />

              <p className="hero-subtitle text-xl lg:text-3xl mb-10 opacity-90 font-light tracking-tight">
                {t("hero_subtitle")}
              </p>
              <button
                onClick={() => scrollToSection(".section-about", "smooth")}
                className="hero-cta inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-primary transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5 cursor-pointer"
                aria-label={isSV ? "Gå till Om oss" : "Go to About section"}
              >
                <ArrowDown className="size-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section className="section-about min-h-screen flex items-center px-5 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 md:gap-12 w-full max-w-6xl mx-auto">
            <div className="about-left self-end flex h-full flex-col justify-end">
              <h2
                className="text-5xl md:text-6xl font-normal text-brand-primary mb-6 tracking-tight moving-text "
                dangerouslySetInnerHTML={{ __html: t("about_title") }}
              />

              <div className="grid grid-cols-2 gap-3">
                {thumbImages.map((src, i) => {
                  const alt = `${aboutGalleryAltBase} ${i + 1}`;
                  return (
                  <div
                    key={i}
                    className="relative w-full h-42 overflow-hidden rounded-xl shadow-sm"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setLightboxImage({ src, alt })}
                    />
                  </div>
                );
                })}
              </div>
            </div>

            <div className="about-card self-end bg-brand-primary text-white shadow-lg rounded-2xl p-5 pb-10 pt-10 md:pt-12 md:pb-12 md:p-12">
              <div className="mb-5 md:mb-3 w-fit rounded-md border border-white/20 bg-white/5 px-4 py-1 text-md font-semibold tracking-[-0.2px] text-white">
                {isSV ? "Om Oss" : "About Us"}
              </div>
              <h3 className="text-2xl md:text-3xl font-light mb-5 tracking-tight">
                {t("about_subtitle")}
              </h3>
              <p
                className="text-md md:text-lg leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: t("about_text") }}
              />
            </div>
          </div>
        </section>

        {/* ================= MENU ================= */}
        <section className="section-menu min-h-screen flex items-center px-5 md:px-10 py-16 md:py-20 bg-brand-backgroundGray">
          <div className="w-full max-w-6xl mx-auto">
            <div className="mx-auto mb-5 md:mb-2 w-fit rounded-md border border-[#e1e0dd] bg-white/80 px-4 py-1 text-md font-semibold tracking-[-0.2px] text-brand-primary">
              {isSV ? "Vår Meny" : "Our Menu"}
            </div>
            <h2
              className="text-5xl md:text-6xl font-normal text-brand-primary text-center max-w-3xl mx-auto tracking-tight mb-10"
              dangerouslySetInnerHTML={{
                __html: isSV
                  ? "Smaker från vårt <strong>kök</strong>"
                  : "Flavors from our <strong>kitchen</strong>",
              }}
            />

            {catalogueCategories.length > 0 ? (
              <>
                <div className="relative rounded-2xl select-none">
                  <div className="mb-5 overflow-x-auto pr-4 md:pr-0 md:overflow-visible">
                    <div className="mx-auto flex w-max flex-nowrap md:flex-wrap justify-start md:justify-center rounded-full bg-brand-primary p-1 shadow-xl gap-1">
                      {catalogueCategories.map((category, index) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            handleMenuTabChange(index);
                          }}
                          className={`px-3 py-1.5 text-sm md:text-md font-semibold rounded-full transition cursor-pointer ${
                            index === activeMenuTabIndex
                              ? "bg-white text-brand-primary"
                              : "text-white opacity-80 hover:opacity-100"
                          }`}
                        >
                          {category.title?.[lang] ||
                            `${isSV ? "Kategori" : "Category"} ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`relative ${
                      isMenuItemsFetchingFresh && activeMenuItems.length === 0
                        ? "min-h-[360px]"
                        : ""
                    }`}
                  >
                    {activeMenuItems.length > 0 ? (
                      <div
                        className={`relative transition-opacity duration-1000 ease-out ${
                          isMenuTabTransitioning || !menuAnimateIn
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        <div className="overflow-hidden px-3 py-4" ref={menuEmblaRef}>
                          <div
                            className={`flex ${
                              canScrollMenuPrev || canScrollMenuNext
                                ? "-ml-3"
                                : "justify-center gap-3"
                            }`}
                          >
                            {activeMenuItems.map((item, itemIndex) => {
                          const itemTitle =
                            item.title[lang as CatalogueLanguage] ||
                            item.title.en ||
                            item.title.sv ||
                            `${isSV ? "Rätt" : "Item"} ${itemIndex + 1}`;
                          const itemDescription =
                            item.description[lang as CatalogueLanguage] ||
                            item.description.en ||
                            item.description.sv ||
                            "";
                          const itemTags = item.tags[lang as CatalogueLanguage];

                          return (
                            <div
                              key={item.id}
                              className={`min-w-0 ${
                                canScrollMenuPrev || canScrollMenuNext
                                  ? "pl-3"
                                  : ""
                              } flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] xl:flex-[0_0_22%]`}
                            >
                              <article className="rounded-2xl overflow-hidden bg-white text-brand-primary shadow-md h-full md:min-h-[360px] transition-transform duration-500 ease-out hover:scale-[1.02]">
                              <div className="h-52 bg-brand-backgroundGray relative overflow-hidden">
                                {item.image ? (
                                  <Image
                                    src={toPublicUrl(item.image) ?? ""}
                                    alt={itemTitle}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-brand-primary/70">
                                    <UtensilsCrossed className="h-10 w-10" />
                                  </div>
                                )}
                                {itemTags.length > 0 && (
                                  <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
                                    {itemTags.map((tag) => (
                                      <span
                                        key={`${item.id}-${tag}`}
                                        className="px-2 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm border border-white/50 text-brand-primary"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="p-4 space-y-3">
                                <h3 className="text-lg font-semibold tracking-tight">
                                  {itemTitle}
                                </h3>
                                <p className="text-md text-brand-primary/85 leading-relaxed">
                                  {itemDescription}
                                </p>
                              </div>
                              </article>
                            </div>
                          );
                            })}
                          </div>
                        </div>
                        <div
                          className={`pointer-events-none absolute inset-y-4 left-0 z-10 w-6 md:w-8 bg-gradient-to-r from-[#F5F3F0] to-transparent transition-opacity duration-300 ${
                            canScrollMenuPrev ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div
                          className={`pointer-events-none absolute inset-y-4 right-0 z-10 w-6 md:w-8 bg-gradient-to-l from-[#F5F3F0] to-transparent transition-opacity duration-300 ${
                            canScrollMenuNext ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    ) : !isMenuItemsLoading ? (
                      <div className="rounded-xl border border-dashed border-[#E3E1DA] bg-white/70 p-6 text-center text-sm text-muted-foreground">
                        {isSV
                          ? "Den här kategorin har inga rätter ännu."
                          : "This category has no items yet."}
                      </div>
                    ) : null}

                    {isMenuItemsFetchingFresh ? (
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-brand-primary shadow-sm backdrop-blur-sm">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {(canScrollMenuPrev || canScrollMenuNext) && (
                    <div className="hidden md:flex absolute top-full left-1/2 -translate-x-1/2 mt-4 z-20 items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => menuEmblaApi?.scrollPrev()}
                        className="w-8 h-8 rounded-full bg-white text-brand-primary inline-flex items-center justify-center hover:bg-white/90 shadow-sm transition cursor-pointer"
                        aria-label="Previous menu items"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => menuEmblaApi?.scrollNext()}
                        className="w-8 h-8 rounded-full bg-white text-brand-primary inline-flex items-center justify-center hover:bg-white/90 shadow-sm transition cursor-pointer"
                        aria-label="Next menu items"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-[#E3E1DA] bg-white/70 p-6 text-center text-sm text-muted-foreground">
                {isSV
                  ? "Menyn är inte uppladdad ännu."
                  : "The menu is not uploaded yet."}
              </div>
            )}
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <section className="section-slider mt-10 min-h-screen flex items-center px-5 md:px-10 py-10 md:py-14">
          <div className="relative w-full h-[85vh] min-h-[560px] md:min-h-[680px] overflow-hidden rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-[30%_70%]">
            <div className="flex flex-col items-center justify-center px-4 md:px-12 py-4 md:py-0 bg-brand-backgroundGray h-auto">
              <div className="self-center md:self-start mb-3 w-fit mt-5 rounded-md border border-[#e1e0dd] bg-white/80 px-4 py-1 text-md font-semibold tracking-[-0.2px] text-brand-primary">
                {isSV ? "Liveevenemang" : "Live Events"}
              </div>
              <h2
                className="md:self-start text-5xl md:text-6xl font-normal text-brand-primary text-center md:text-left leading-none slider-title tracking-tight moving-text mb-7"
                dangerouslySetInnerHTML={{ __html: t("gallery_title") }}
              />
              <p
                key={`event-title-${activeEventsSlide}`}
                className="max-w-md min-h-[3.5rem] md:min-h-0 self-center md:self-start text-center md:text-left text-xl font-light text-brand-primary animate-[fadeIn_0.35s_ease-out]"
              >
                {stripHtml(activeEventTitle) || (isSV ? "Kommande liveevents" : "Upcoming live events")}
              </p>

                <a
                  href={t("gallery_button_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-center md:self-start inline-flex slider-about items-center justify-center px-8 py-3 rounded-full bg-brand-primary text-white font-semibold tracking-wide transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-2xl shadow-xl cursor-pointer mt-7 mb-7"
                >
                  {t("gallery_button_text")}
                </a>
              
            </div>

            <div
              className="slider relative w-full h-full min-h-[300px] overflow-hidden"
              onMouseEnter={() => setIsEventsPaused(true)}
              onMouseLeave={() => setIsEventsPaused(false)}
              onFocusCapture={() => setIsEventsPaused(true)}
              onBlurCapture={() => setIsEventsPaused(false)}
            >
              <div className="overflow-hidden h-full" ref={eventsEmblaRef}>
                <div className="flex h-full">
                  {sliderSlides.map((slide, i) => {
                    const slideTitleRaw = isSV
                      ? slide.titleSv || slide.titleEn
                      : slide.titleEn || slide.titleSv;
                    const slideTitleText = stripHtml(slideTitleRaw ?? "");
                    const slideAlt = slideTitleText
                      ? `${slideTitleText} ${i + 1}`
                      : galleryTitleText
                        ? `${galleryTitleText} ${i + 1}`
                        : `Gallery slide ${i + 1}`;
                    return (
                      <div
                        key={i}
                        className="min-w-0 flex-[0_0_100%] h-full relative"
                      >
                        <Image
                          src={slide.image ?? ""}
                          alt={slideAlt}
                          fill
                          sizes="100vw"
                          className="object-cover cursor-grab active:cursor-grabbing select-none"
                          draggable={false}
                          priority={i === 0}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {sliderSlides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {sliderSlides.map((_, index) => (
                    <span
                      key={`events-dot-${index}`}
                      aria-hidden="true"
                      className={`h-2.5 rounded-full transition-all ${
                        activeEventsSlide === index
                          ? "w-6 bg-white"
                          : "w-2.5 bg-white/50"
                      }`}
                    >
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section
          className="section-contact
        min-h-screen
        flex items-center
        px-5 md:px-10
        py-16 md:py-20
        "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 md:gap-12 w-full max-w-6xl mx-auto">
            <div className="business-card self-end relative overflow-hidden bg-brand-primary text-white shadow-lg rounded-2xl p-5 pb-10 pt-10 md:pt-12 md:pb-12 md:p-12 order-2 md:order-1">
              <div className="relative z-10">
                <div className="mb-5 w-fit rounded-md border border-white/20 bg-white/5 px-4 py-1 text-md font-semibold tracking-[-0.2px] text-white">
                  {isSV ? "Kontakta oss" : "Contact Us"}
                </div>

                <h3 className="text-2xl md:text-3xl font-light mb-5 tracking-tight">
                  {isSV ? "Hör av dig" : "Get in touch"}
                </h3>

                {businessInfo?.address && (
                  <div className="flex items-start gap-4 mb-5">
                    <MapPin className="mt-1 h-6 w-6 opacity-80" />
                    <p className="text-md md:text-lg leading-relaxed font-light">{businessInfo.address}</p>
                  </div>
                )}

                {businessInfo?.phone && (
                  <div className="flex items-center gap-4 mb-5">
                    <Phone className="h-6 w-6 opacity-80" />
                    <p className="text-md md:text-lg leading-relaxed font-light">
                      <a href={`tel:${businessInfo.phone}`}>
                        {businessInfo.phone}
                      </a>
                    </p>
                  </div>
                )}

                {businessInfo?.email && (
                  <div className="flex items-center gap-4 mb-5">
                    <Mail className="h-6 w-6 opacity-80" />
                    <p className="text-md md:text-lg leading-relaxed font-light">
                      {" "}
                      <a href={`mailto:${businessInfo.email}`}>
                        {businessInfo.email}
                      </a>
                    </p>
                  </div>
                )}

                {businessInfo?.opening_hours && (
                  <div className="flex items-start gap-4">
                    <Clock3 className="mt-1 h-6 w-6 opacity-80" />
                    <div>
                      <p className="text-md font-semibold my-1 text-white/70">
                        {isSV ? "Öppettidery" : "Opening Hours:"}
                      </p>
                      <p
                        className="text-md md:text-lg leading-relaxed font-light"
                        dangerouslySetInnerHTML={{
                          __html: businessInfo.opening_hours,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-full h-px bg-white/10 my-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setMessagePanelReady(true);
                      setActiveBusinessPanel("message");
                    }}
                    className="w-full inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-brand-primary font-semibold tracking-wide hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer "
                  >
                    {isSV ? "Meddela oss" : "Send us a message"}{" "}
                  </button>

                  {orderOnlineUrl ? (
                    <a
                      href={orderOnlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-primary font-semibold tracking-wide hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {isSV ? "Beställ online" : "Order online"}
                      <Image
                        src="/wolt.svg"
                        alt=""
                        aria-hidden="true"
                        width={42}
                        height={42}
                        className="pointer-events-none absolute right-1 top-1/2 h-[42px] w-[42px] -translate-y-1/2"
                      />
                    </a>
                  ) : null}
                </div>
              </div>

              <div
                className={`absolute inset-0 z-20 bg-brand-primary text-white p-5 pb-10 pt-10 md:pt-12 md:pb-12 md:p-12 transition-all duration-500 ease-out ${
                  activeBusinessPanel === "message"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0 pointer-events-none"
                }`}
              >
                {messagePanelReady && (
                  <>
                    <div className="relative ">
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            setContactSubmitted(true);
                            setContactPulseKey((prev) => prev + 1);
                          }}
                        className={`space-y-4 transition-opacity duration-500 ${
                          contactSubmitted
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveBusinessPanel("contact")}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/60 text-white hover:bg-white/10 transition cursor-pointer"
                            aria-label="Back"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </button>
                          <h3 className="text-2xl md:text-3xl font-light tracking-tight">
                            {isSV
                              ? "Skicka ett meddelande"
                              : "Send us a Message"}
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <input
                            name="contact_name"
                            placeholder={isSV ? "Namn" : "Name"}
                            className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-white/40"
                          />
                          <input
                            type="email"
                            name="contact_email"
                            placeholder={isSV ? "E-post" : "Email"}
                            className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-white/40"
                          />
                        </div>

                        <input
                          type="tel"
                          name="contact_phone"
                          placeholder={isSV ? "Telefon" : "Phone"}
                          className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-white/40"
                        />

                        <textarea
                          name="contact_message"
                          placeholder={isSV ? "Meddelande" : "Message"}
                          rows={7}
                          className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-white/40"
                        />

                        <button
                          type="submit"
                          className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-primary font-semibold tracking-wide hover:bg-surface transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                        >
                          {isSV ? "Skicka meddelande" : "Send message"}
                        </button>
                      </form>

                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-500 ${
                          contactSubmitted
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <CircleCheckBig
                          key={contactPulseKey}
                          className="mb-4 h-16 w-16 text-white animate-pulse-once"
                        />
                        <p className="text-lg md:text-xl font-light">
                          {isSV
                            ? "Tack! Vi hör av oss snart."
                           : (
                              <>
                                Your message was sent!
                                <br />
                                We will get back to you shortly.
                              </>
                            )}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setContactSubmitted(false);
                            setActiveBusinessPanel("contact");
                          }}
                          className="mt-6 bg-white text-brand-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5 shadow-xl inline-flex items-center justify-center cursor-pointer"
                        >
                          {isSV ? "Stäng" : "Close"}
                        </button>
                      </div>
                    
                    </div>
                  </>
                )}
              </div>

            </div>

            <div className="map-container order-1 md:order-2">
              <h2
                className="text-5xl md:text-6xl font-normal text-brand-primary mb-6 text-left md:text-right map-title tracking-tight moving-text "
                dangerouslySetInnerHTML={{ __html: t("contact_title") }}
              />

              <div className="map-frame w-full h-80 md:h-96 rounded-xl shadow-xl border border-[#E3E1DA] hover:opacity-100! transition-opacity duration-600 overflow-hidden">
                <MapEmbed html={websiteBasics?.google_maps ?? ""} />
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <section className="section-footer min-h-screen bg-brand-primary text-white px-5 md:px-10 pb-20 pt-15 md:pt-30 flex items-center justify-center">
          <div className="contact-inner text-center w-full ">
            <div className="mb-16 w-full max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <div className="mx-auto mb-4 w-fit rounded-md border border-white/20 bg-white/5 px-4 py-1 text-md font-semibold tracking-[-0.2px] text-white">
                  {isSV ? "Tripadvisor Recensioner" : "Tripadvisor Reviews"}
                </div>
                <h2
                  className="text-5xl md:text-5xl font-light mb-10 max-w-xl mx-auto tracking-tight moving-text"
                  dangerouslySetInnerHTML={{
                    __html: t("footer_title"),
                  }}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
                <article className="rounded-2xl bg-white/5 p-6 transition-colors duration-300 hover:bg-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <img
                        src="/avatar-2.webp"
                        alt="Sofia Lindgren"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">Sofia Lindgren</h3>
                      <p className="text-sm text-white/70">3 weeks ago</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-1 text-white/90">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <p className="text-md md:text-lg leading-relaxed font-light">
                    Warm service and really flavorful dishes, each one
                    was well-seasoned with generous portions.
                  </p>
                </article>

                <article className="rounded-2xl bg-white/5 p-6 transition-colors duration-300 hover:bg-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <img
                        src="/avatar-1.webp"
                        alt="Marcus Andreou"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">Marcus Andreou</h3>
                      <p className="text-sm text-white/70">1 month ago</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-1 text-white/90">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <p className="text-md md:text-lg leading-relaxed font-light">
                    Came on a busy Friday and still got friendly, quick service. The grilled meat
                    was tender and the sides tasted fresh.
                  </p>
                </article>

                <article className="rounded-2xl bg-white/5 p-6 transition-colors duration-300 hover:bg-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <img
                        src="/avatar-3.webp"
                        alt="Elin Karlsen"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">Elin Karlsen</h3>
                      <p className="text-sm text-white/70">5 months ago</p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-1 text-white/90">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <p className="text-md md:text-lg leading-relaxed font-light">
                    Cozy atmosphere, clean dining area, and great value for the portion size. We will definitely come back.
                  </p>
                </article>
              </div>
            </div>

            <h3
              className="text-4xl md:text-4xl font-light mb-10 max-w-xl mx-auto tracking-tight moving-text "
              dangerouslySetInnerHTML={{
                __html: isSV
                  ? "Följ oss för<br /><strong>Nyheter</strong> & <strong>Evenemang:</strong>"
                  : "Follow us for<br /><strong>News</strong> & <strong>Events:</strong>",
              }}
            />

            {/* Social icons */}
            <div className="flex gap-6 justify-center mb-12">
              {businessInfo?.facebook && (
                <a
                  href={`${businessInfo.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className=" p-3.5 flex items-center justify-center rounded-full bg-white text-brand-primary hover:scale-105 transition "
                >
                  <Facebook
                    className="h-6 w-6 md:h-7 md:w-7"
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              )}

              {businessInfo?.instagram && (
                <a
                  href={`${businessInfo.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className=" p-3.5 flex items-center justify-center rounded-full bg-white text-brand-primary hover:scale-105 transition "
                >
                  <Instagram
                    className="h-6 w-6 md:h-7 md:w-7"
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              )}

              {businessInfo?.tiktok && (
                <a
                  href={`${businessInfo.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className=" p-3.5 flex items-center justify-center rounded-full bg-white text-brand-primary hover:scale-105 transition "
                >
                  <Music2
                    className="h-6 w-6 md:h-7 md:w-7"
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              )}
            </div>

            <footer className="border-t border-white/20 pt-6 max-w-3xl mx-auto">
              <p className="text-sm opacity-70">
                © {new Date().getFullYear()} TheGreek — React&Next.js Business Website Template + Admin Panel — View project on{" "}
                <a
                  href="https://github.com/vasilisgee/thegreek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 underline hover:text-white transition"
                >
                  {" "}
                  GitHub <Github className="h-4 w-4" />
                </a>
              </p>
              {/* <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="bg-white text-brand-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-white/90 transition shadow-xl inline-flex items-center justify-center"
              >
                {isSV ? "Till Toppen" : "Back to Top"}{" "}
                <span aria-hidden="true" className="ml-3">
                  ↑
                </span>
              </a> */}
            </footer>
          </div>
        </section>

        {/* Custom Lightbox */}
        {lightboxImage && (
          <div
            className=" fixed inset-0 z-100 bg-black/80 flex items-center justify-center p-2 md:p-6 animate-[fadeIn_0.3s_ease-out] "
            onClick={() => setLightboxImage(null)}
          >
            {/* Close button */}
            <button
              className=" absolute top-2 md:top-4 right-2 md:right-4 w-10 h-10 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center hover:scale-110 transition z-110 cursor-pointer "
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              aria-label="Close image"
            >
              {" "}
              ×
            </button>

            {/* Image */}
            <div
              className="relative flex w-full h-full items-center justify-center max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                width={1600}
                height={1200}
                sizes="90vw"
                className="mx-auto h-auto w-auto max-h-full max-w-full object-contain rounded-lg md:rounded-2xl shadow-2xl animate-[fadeIn_0.4s_ease-out]"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

const MapEmbed = memo(function MapEmbed({ html }: { html: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
});
