"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";

import { initHomeAnimations } from "@/lib/animations/home";
import { scrollToTop } from "@/lib/animations/home";
import { scrollToSection } from "@/lib/animations/home";

import { FaGithub } from "react-icons/fa";
import { LuUtensilsCrossed } from "react-icons/lu";
import { RiShoppingBag3Line } from "react-icons/ri";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineArrowDown, HiOutlineArrowUp, } from "react-icons/hi";
import { HiOutlineMapPin, HiOutlineEnvelope, HiOutlinePhone, HiOutlineClock, } from "react-icons/hi2";
import { RiEBike2Line } from "react-icons/ri";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";

type BusinessInfo = {
  address: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  order_pickup: string | null;
  order_delivery: string | null;
};
type WebsiteBasics = {
  google_maps: string | null;
};
type WebsiteTexts = {
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

type MediaAssets = {
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

const BUCKET = "site-assets";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const MEDIA_ASSET_COLUMNS =
  "hero_image, hero_video, menu_pdf_en, menu_pdf_sv, " +
  "thumb_gallery_1, thumb_gallery_2, thumb_gallery_3, thumb_gallery_4, " +
  "slider_gallery_1, slider_gallery_2, slider_gallery_3, slider_gallery_4, " +
  "slider_gallery_1_title_en, slider_gallery_1_title_sv, " +
  "slider_gallery_2_title_en, slider_gallery_2_title_sv, " +
  "slider_gallery_3_title_en, slider_gallery_3_title_sv, " +
  "slider_gallery_4_title_en, slider_gallery_4_title_sv";
const EMPTY_MEDIA_ASSETS: MediaAssets = {
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

function toPublicUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (!SUPABASE_URL) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function Home() {

  const [isAppReady, setIsAppReady] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  
  const pathname = usePathname();
  const lang = pathname.startsWith("/sv") ? "sv" : "en";
  const isSV = pathname.startsWith("/sv");

  {/*Load Supabase */}
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [websiteBasics, setWebsiteBasics] = useState<WebsiteBasics | null>(null);
  const [websiteTexts, setWebsiteTexts] = useState<WebsiteTexts | null>(null);
  const [mediaAssets, setMediaAssets] =
    useState<MediaAssets>(EMPTY_MEDIA_ASSETS);
  const [mediaAssetsLoaded, setMediaAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadBusinessInfo() {
      const { data } = await supabase
        .from("business_info")
        .select("address, phone, email, opening_hours, facebook, instagram, tiktok, order_pickup, order_delivery")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .maybeSingle();

      setBusinessInfo(data);
    }

    loadBusinessInfo();
  }, []);

  useEffect(() => {
    async function loadWebsiteBasics() {
      const { data } = await supabase
        .from("site_settings")
        .select("google_maps")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .maybeSingle();

      setWebsiteBasics(data);
    }

    loadWebsiteBasics();
      }, []);

      useEffect(() => {
      async function loadWebsiteTexts() {
        const { data } = await supabase
          .from("website_texts")
          .select("*")
          .eq("id", "00000000-0000-0000-0000-000000000001")
          .maybeSingle();

        setWebsiteTexts(data);
      }

    loadWebsiteTexts();
  }, []);

  useEffect(() => {
    async function loadMediaAssets() {
      const { data, error } = await supabase
        .from("media_assets")
        .select(MEDIA_ASSET_COLUMNS)
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .maybeSingle();

      if (error) {
        console.error(error);
        setMediaAssets(EMPTY_MEDIA_ASSETS);
        setMediaAssetsLoaded(true);
        return;
      }

      const nextMedia = (data ?? EMPTY_MEDIA_ASSETS) as MediaAssets;
      setMediaAssets(nextMedia);
      setMediaAssetsLoaded(true);
    }

    loadMediaAssets();
  }, []);

    function t(field: string) {
      if (!websiteTexts) return "";

      const key = `${field}_${lang}` as keyof WebsiteTexts;
      return websiteTexts[key] ?? "";
    }


    // App loader
    useEffect(() => {
    if (!businessInfo || !websiteBasics || !mediaAssetsLoaded) return;

    const onReady = async () => {
      // Wait for fonts
      if ("fonts" in document) {
        await (document as any).fonts.ready;
      }

      // Wait for images
      const images = Array.from(document.images);
      await Promise.all(
        images.map(
          (img) =>
            img.complete ||
            new Promise((res) => {
              img.onload = img.onerror = res;
            })
        )
      );

    // Small buffer for layout stability
    setTimeout(() => {
      setHideLoader(true);
    }, 600); 
    setTimeout(() => {
        setIsAppReady(true);
      }, 1200);
    };

    onReady();
    }, [businessInfo, websiteBasics, mediaAssetsLoaded]);

    useEffect(() => {
      if (!isAppReady) return;

      initHomeAnimations();
  }, [isAppReady]);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const heroImageUrl = toPublicUrl(mediaAssets?.hero_image ?? null);
  const heroVideoUrl = toPublicUrl(mediaAssets?.hero_video ?? null);
  const menuPdfUrl = toPublicUrl(
    (isSV ? mediaAssets?.menu_pdf_sv : mediaAssets?.menu_pdf_en) ??
      mediaAssets?.menu_pdf_en ??
      mediaAssets?.menu_pdf_sv ??
      null,
  );
  const thumbImages = [
    toPublicUrl(mediaAssets?.thumb_gallery_1 ?? null),
    toPublicUrl(mediaAssets?.thumb_gallery_2 ?? null),
    toPublicUrl(mediaAssets?.thumb_gallery_3 ?? null),
    toPublicUrl(mediaAssets?.thumb_gallery_4 ?? null),
  ].filter((src): src is string => Boolean(src));

  const sliderSlides = [
    {
      image: toPublicUrl(mediaAssets?.slider_gallery_1 ?? null),
      titleEn: mediaAssets?.slider_gallery_1_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_1_title_sv ?? "",
    },
    {
      image: toPublicUrl(mediaAssets?.slider_gallery_2 ?? null),
      titleEn: mediaAssets?.slider_gallery_2_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_2_title_sv ?? "",
    },
    {
      image: toPublicUrl(mediaAssets?.slider_gallery_3 ?? null),
      titleEn: mediaAssets?.slider_gallery_3_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_3_title_sv ?? "",
    },
    {
      image: toPublicUrl(mediaAssets?.slider_gallery_4 ?? null),
      titleEn: mediaAssets?.slider_gallery_4_title_en ?? "",
      titleSv: mediaAssets?.slider_gallery_4_title_sv ?? "",
    },
  ].filter((slide) => Boolean(slide.image));

  return (
  <>
    {/* FULLSCREEN LOADER */}
    {!isAppReady && (
      <div
        className={`
          fixed inset-0 z-[9999]
          bg-[#f5f3f0]
          flex items-center justify-center
          transition-all duration-700 ease-in-out
          ${hideLoader ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{overflow:"visible"}}><style>{".bowl{transform-origin:50% 60%;animation:b 2.8s ease-in-out infinite}.steam path{animation:s 1.8s ease-in-out infinite}.steam path:nth-child(2){animation-delay:.3s}.steam path:nth-child(3){animation-delay:.6s}@keyframes s{0%{opacity:0;transform:translateY(4px)}20%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}@keyframes b{0%{transform:rotate(0)}25%{transform:rotate(-1deg)}50%{transform:rotate(0)}75%{transform:rotate(1deg)}100%{transform:rotate(0)}}"}</style><g className="bowl"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/></g><g className="steam"><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/></g></svg>


      </div>
    )}

    
    <main className="page-bg w-full overflow-x-hidden ">

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-50 ">
        <div className="  p-3 flex items-center justify-between ">
      
          <div className="text-2xl font-bold tracking-tight">
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} >
              <strong className="font-extrabold bg-brand-primary text-white p-2 rounded-xl text-xl md:text-2xl">
                theGreek
              </strong>
            </a>
          </div>

          <div className="flex items-center gap-6">
           <div className="flex rounded-full bg-brand-primary p-1 shadow-xl">
              <a
                href="/"
                className={`px-3 py-1 text-xs font-semibold rounded-full transition
                  ${
                    !isSV
                      ? "bg-white text-brand-primary"
                      : "text-white opacity-80 hover:opacity-100"
                  }
                `}
              >
                EN
              </a>

              <a
                href="/sv"
                className={`px-3 py-1 text-xs font-semibold rounded-full transition
                  ${
                    isSV
                      ? "bg-white text-brand-primary"
                      : "text-white opacity-80 hover:opacity-100"
                  }
                `}
              >
                SV
              </a>
            </div>

            <a className="bg-white text-brand-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-surface transition shadow-xl hidden md:block" href="/login" target="_blank">
              Admin Demo
            </a>
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="section-hero relative h-screen w-full overflow-hidden">

        {mediaAssetsLoaded ? (
          heroVideoUrl ? (
            <video
              className="hero-bg absolute inset-0 w-full h-full object-cover z-0"
              src={heroVideoUrl}
              poster={heroImageUrl ?? undefined}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : heroImageUrl ? (
            <img
              className="hero-bg absolute inset-0 w-full h-full object-cover z-0"
              src={heroImageUrl}
              alt=""
            />
          ) : null
        ) : (
          <div className="hero-bg absolute inset-0 w-full h-full bg-black/10 z-0" />
        )}
        <div className="absolute inset-0 bg-[#151A3F]/60 z-10" />

        <div className="hero-content relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 m">
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-0 sm:px-6">

              <h1 className="hero-title text-4xl lg:text-8xl font-light mb-6  tracking-tight "
                dangerouslySetInnerHTML={{ __html: t("hero_title") }}
              />
              
            <p className="hero-subtitle text-xl lg:text-3xl mb-10 opacity-90 font-light tracking-tight">
              {t("hero_subtitle")}
            </p>
            <button onClick={() => scrollToSection(".section-about")} className="hero-cta inline-flex items-center justify-center px-6 py-3 rounded-full  border border-white text-white hover:bg-white hover:text-black transition-colors " >
              {t("hero_button_text")} <HiOutlineArrowDown className="ml-3 text-md" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className=" section-about min-h-screen flex items-center px-5 md:px-10 py-[10vh] " >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full max-w-6xl mx-auto items-center">
       
          <div className="about-left">
           
            <h2 className="text-4xl md:text-6xl font-normal text-primary-brand mb-6 tracking-tight moving-text "
                dangerouslySetInnerHTML={{ __html: t("about_title") }}
              />

            <div className="grid grid-cols-2 gap-3">
              {thumbImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  onClick={() => setLightboxImage(src)}
                  className=" w-full h-42 object-cover rounded-xl shadow cursor-pointer transition-transform duration-300 hover:scale-105 "
                />
              ))}
            </div>
          </div>

          <div className="about-card bg-brand-primary text-white shadow-lg rounded-2xl p-5 pb-10 pt-10 md:pt-12 md:pb-12 md:p-12">
            <h3 className="text-2xl md:text-3xl font-light mb-5 tracking-tight">
              {t("about_subtitle")}
            </h3>
             <p className="text-md md:text-lg mb-6 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: t("about_text") }}
              />

            <a
              className=" inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-primary font-semibold tracking-wide hover:bg-surface transition"
              href={menuPdfUrl ?? "/thegreek-menu.pdf"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isSV ? "Visa vår Meny" : "View our Menu"} <LuUtensilsCrossed className="ml-3 text-lg" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="section-slider h-[90vh] relative overflow-hidden mx-5 md:mx-10 rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-[30%_70%]">
        
        <div className="flex flex-col items-center justify-center px-4 md:px-12 py-4 md:py-0 bg-brand-backgroundGray gap-6 h-auto">

           <h2 className="text-4xl md:text-6xl font-normal text-brand-primary text-center leading-none slider-title tracking-tight moving-text "
                dangerouslySetInnerHTML={{ __html: t("gallery_title") }}
            />

          <a href={t("gallery_button_url")} className=" inline-flex slider-about items-center justify-center px-8 py-3 rounded-full bg-brand-primary text-white font-semibold tracking-wide hover:bg-brand-primaryHover transition">{t("gallery_button_text")} <SiFacebook className="ml-3 text-lg" /> </a>
        </div>

        <div className="slider relative w-full h-full  min-h-[300px]">

          {/* Slides */}
          {sliderSlides.map((slide, i) => (
            <div
              key={i}
              className="slide absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            >
              <img src={slide.image ?? ""} className="w-full h-full object-cover" />
              {(slide.titleEn || slide.titleSv) && (
                <h2 className="absolute bottom-12 left-12 text-white text-2xl font-normal hidden md:block">
                  {isSV ? slide.titleSv || slide.titleEn : slide.titleEn || slide.titleSv}
                </h2>
              )}
            </div>
          ))}

          <button className="slider-prev absolute left-1 md:left-6 top-1/2 -translate-y-1/2 text-white text-4xl z-20 bg-black/40 p-2 md:p-4 rounded-full  hover:bg-black/60 transition">
            <HiOutlineArrowLeft className="text-lg md:text-2xl" />
          </button>
          <button className="slider-next absolute right-1 md:right-6 top-1/2 -translate-y-1/2 text-white text-4xl z-20 bg-black/40 p-2 md:p-4 rounded-full hover:bg-black/60 transition">
            <HiOutlineArrowRight className="text-lg md:text-2xl" />
          </button>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        className="section-business  min-h-screen
        flex items-center
        px-5 md:px-10
        py-16 md:py-[10vh]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full max-w-6xl mx-auto">
          
          <div className="business-card bg-brand-primary text-white shadow-lg rounded-2xl p-5 pb-10 pt-10 md:pt-12 md:pb-12 md:p-12 order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-light mb-5 tracking-tight">
              {isSV ? "Kontakta oss" : "Get in touch"}
            </h3>

            {businessInfo?.address && (
              <div className="flex items-start gap-4 mb-5">
                <HiOutlineMapPin className="text-2xl opacity-80 mt-1" />
                <p className="text-md md:text-lg">
                  {businessInfo.address}
                </p>
              </div>
            )}

            {businessInfo?.phone && (
              <div className="flex items-center gap-4 mb-5">
                <HiOutlinePhone className="text-2xl opacity-80" />
                <p className="text-md md:text-lg"><a href={`tel:${businessInfo.phone}`}>{businessInfo.phone}</a></p>
              </div>
            )}

            {businessInfo?.email && (
               <div className="flex items-center gap-4 mb-8">
                <HiOutlineEnvelope className="text-2xl opacity-80" />
                <p className="text-md md:text-lg"> <a href={`mailto:${businessInfo.email}`}>
                  {businessInfo.email}
                </a></p>
              </div>
            )}


             {businessInfo?.opening_hours && (
            
              <div className="flex items-start gap-4">
                <HiOutlineClock className="text-2xl opacity-80 mt-1" />
                <div>
                  <p className="text-xl font-semibold mb-1">{isSV ? "Öppettidery" : "Opening Hours"}</p>
                   <p
                    className="text-md md:text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: businessInfo.opening_hours,
                    }}
                  />
                </div>
              </div>

              )}


            <div className="w-full h-px bg-white/10 my-6"></div>

            <h3 className="text-2xl md:text-3xl font-light mb-6 tracking-tight">
              {isSV ? "Beställ Online" : "Order Online"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {businessInfo?.order_delivery && (
                <a href={`${businessInfo.order_delivery}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-primary font-semibold tracking-wide hover:bg-surface transition " >
                  {isSV ? "Leverans" : "Order Delivery"} <RiEBike2Line className="text-lg ml-3" />
                </a>
              )}

              {businessInfo?.order_pickup && (
                <a href={`${businessInfo.order_pickup}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-primary font-semibold tracking-wide hover:bg-surface transition " >
                  {isSV ? "Avhämtning" : "Order Pickup"} <RiShoppingBag3Line className="ml-3 text-lg" />
                </a>
              )}
             
            </div>
          </div>

          <div className="map-container order-1 md:order-2">

            <h2 className="text-4xl md:text-6xl font-normal text-brand-primary mb-6 text-left md:text-right map-title tracking-tight moving-text "
                dangerouslySetInnerHTML={{ __html: t("contact_title") }}
              />

            <div className="map-frame w-full h-80 md:h-96 rounded-xl shadow-xl border border-[#E3E1DA] hover:!opacity-100 transition-opacity duration-600 overflow-hidden">
                {websiteBasics?.google_maps && (
                  <div
                    dangerouslySetInnerHTML={{ __html: websiteBasics.google_maps }}
                  />
                )}

            </div>
            
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="section-contact min-h-screen bg-brand-primary text-white px-10 py-24 flex items-center justify-center">
        <div className="contact-inner text-center w-full ">

          <h2 className="text-4xl md:text-5xl font-light mb-10 max-w-xl mx-auto tracking-tight moving-text "
                dangerouslySetInnerHTML={{ __html: t("footer_title") }}
              />

          {/* Social icons */}
          <div className="flex gap-6 justify-center mb-12">


             {businessInfo?.facebook && (
                <a href={`${businessInfo.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className=" p-4 flex items-center justify-center rounded-full bg-white text-brand-primary hover:scale-105 transition "  >
                <SiFacebook className="text-2xl md:text-3xl" />
                </a>
              )}

               {businessInfo?.instagram && (
                <a href={`${businessInfo.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className=" p-4 flex items-center justify-center rounded-full bg-white text-brand-primary hover:scale-105 transition "  >
                 <SiInstagram className="text-2xl md:text-3xl" />
                </a>
              )}

               {businessInfo?.tiktok && (
                <a href={`${businessInfo.tiktok}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className=" p-4 flex items-center justify-center rounded-full bg-white text-brand-primary hover:scale-105 transition "  >
                <SiTiktok className="text-2xl md:text-3xl" />
                </a>
              )}

          </div>

          <footer className="border-t border-white/20 pt-6 max-w-3xl mx-auto">
            <p className="text-sm opacity-70 mb-10">
              © {new Date().getFullYear()} TheGreek — React & Next.js Website Template — View project on <a href="https://github.com/vasilisgee/thegreek" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline hover:text-white transition"> GitHub <FaGithub className="text-base" /></a>
            </p>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="bg-white text-brand-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-surface transition shadow-xl inline-flex items-center justify-center" >
              {isSV ? "Till Toppen" : "Back to Top"} <HiOutlineArrowUp className="ml-3" />
            </a>
          </footer>
        </div>
      </section>

      {/* Custom Lightbox */}
      {lightboxImage && (
        <div className=" fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-2 md:p-6 animate-[fadeIn_0.3s_ease-out] " onClick={() => setLightboxImage(null)} >
          {/* Close button */}
          <button className=" absolute top-2 md:top-4 right-2 md:right-4 w-10 h-10 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center hover:scale-110 transition z-[110] " onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }} aria-label="Close image" > ×
          </button>

          {/* Image */}
          <img src={lightboxImage} className=" max-w-full max-h-full rounded-lg md:rounded-2xl shadow-2xl animate-[fadeIn_0.4s_ease-out] " onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  </>
  );
}
