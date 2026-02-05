"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function scrollToTop(disableMotion = false) {
  if (disableMotion) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  gsap.to(window, {
    scrollTo: { y: 0 },
    duration: 1,
    ease: "power5.out",
  });
}
export function scrollToSection(target: string, disableMotion = false) {
  if (disableMotion) {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 30;
    window.scrollTo({ top, behavior: "smooth" });
    return;
  }
  gsap.to(window, {
    scrollTo: {
      y: target,
      offsetY: -30,
    },
    duration: 1,
    behavior: "smooth",
    ease: "power5.out",
  });
}

function initSlider(useGsap: boolean) {
  const slides = Array.from(document.querySelectorAll<HTMLElement>(".slide"));
  if (!slides.length) return () => {};

  let currentSlide = 0;

  slides.forEach((slide, index) => {
    const isActive = index === 0;
    if (useGsap) {
      gsap.set(slide, { opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" });
    } else {
      slide.style.transition = "opacity 0.8s ease";
      slide.style.willChange = "opacity";
      slide.style.opacity = isActive ? "1" : "0";
      slide.style.pointerEvents = isActive ? "auto" : "none";
    }
  });

  function showSlide(index: number) {
    if (index === currentSlide) return;
    if (useGsap) {
      gsap.to(slides[currentSlide], {
        opacity: 0,
        duration: 0.8,
        pointerEvents: "none",
      });
      gsap.to(slides[index], {
        opacity: 1,
        duration: 0.8,
        pointerEvents: "auto",
      });
    } else {
      slides[currentSlide].style.opacity = "0";
      slides[currentSlide].style.pointerEvents = "none";
      slides[index].style.opacity = "1";
      slides[index].style.pointerEvents = "auto";
    }
    currentSlide = index;
  }

  const handleNext = () => {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };
  const handlePrev = () => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  const nextButton = document.querySelector(".slider-next");
  const prevButton = document.querySelector(".slider-prev");
  nextButton?.addEventListener("click", handleNext);
  prevButton?.addEventListener("click", handlePrev);

  return () => {
    nextButton?.removeEventListener("click", handleNext);
    prevButton?.removeEventListener("click", handlePrev);
  };
}

export function initHomeAnimations(disableMotion = false) {
  const sliderCleanup = initSlider(!disableMotion);
  if (disableMotion) {
    return () => {
      sliderCleanup();
    };
  }
  const existingTriggers = new Set(ScrollTrigger.getAll());
  const mm = gsap.matchMedia();

  // Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.body.style.transform ? "transform" : "fixed",
  });

  const raf = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const onRefresh = () => {
    (lenis as { resize?: () => void }).resize?.();
  };
  ScrollTrigger.addEventListener("refresh", onRefresh);
  ScrollTrigger.refresh();

  gsap.utils.toArray<HTMLElement>(".moving-text").forEach((el) => {
  // Prevent double execution per container
  if (el.dataset.split === "true") return;
  el.dataset.split = "true";

  const strongs = Array.from(el.querySelectorAll("strong"));
  if (!strongs.length) return;

  strongs.forEach((strong) => {
    const text = strong.textContent || "";

    const animatedSpan = document.createElement("span");
    animatedSpan.className = "inline-block font-bold";
    animatedSpan.style.whiteSpace = "nowrap";

    strong.replaceWith(animatedSpan);

    const letters = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      animatedSpan.appendChild(span);
      return span;
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1.1,
        },
      })
      .to(letters, {
        opacity: 1,
        stagger: 0.04,
        ease: "power3.out",
      });
  });
});


  // HERO text animations
  const heroTitle = document.querySelector(".hero-title");

  if (heroTitle) {
    const strong = heroTitle.querySelector("strong");

    if (strong) {
      // 1. Create animated span
      const span = document.createElement("span");
      span.className =
        "  inline-block animate-scale-in relative font-bold text-brand-primary bg-white px-2 md:px-4 rounded-xl md:rounded-2xl";

      span.textContent = strong.textContent ?? "";

      // 2. Replace <strong> with animated <span>
      strong.replaceWith(span);

      // 3. Split text into letters
      const letters = span.textContent.split("");
      span.innerHTML = letters
        .map(
          (l) =>
            `<span class="inline-block opacity-0">${l === " " ? "&nbsp;" : l}</span>`,
        )
        .join("");

      // 4. Animate letters
      gsap.to(span.querySelectorAll("span"), {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  }

  gsap.from(".hero-subtitle", {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: "power3.out",
  });

  gsap.from(".hero-cta", {
    opacity: 0,
    scale: 0.6,
    duration: 1,
    ease: "back.out(1.7)",
  });

  gsap.to(".hero-bg", {
    scale: 1.3,
    y: "-15vh",
    scrollTrigger: {
      trigger: ".section-hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
    },
  });

  // HERO text animations
  gsap.fromTo(
    ".hero-content",
    { opacity: 1, y: 0 },
    {
      opacity: 0,
      y: -120,
      scrollTrigger: {
        trigger: ".section-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    },
  );

  // CONTACT section
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".section-contact",
        start: "top 60%", // section enters viewport
        end: "bottom 20%", // section leaves viewport
        scrub: true,
      },
    })
    .fromTo(
      ".contact-inner",
      { opacity: 0, y: 200 },
      { opacity: 1, y: 0, duration: 0.4 },
    )
    .to(".contact-inner", { opacity: 0, y: -200, duration: 0.4 });

  //DESKTOP only animations
  mm.add("(min-width: 768px)", () => {
    // ABOUT LEFT COLUMN
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section-about",
          start: "top 65%", // when the section comes in
          end: "bottom 5%", // when the section exits
          scrub: true,
        },
      })
      .fromTo(".about-left", { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .to(".about-left", { opacity: 0, duration: 0.4 });

    // ABOUT animation
    gsap.from(".about-card", {
      opacity: 1,
      y: 120,
      scrollTrigger: {
        trigger: ".section-about",
        start: "top 85%",
        end: "bottom 60%",
        scrub: 1.2,
      },
    });

    // SLIDER button animation
    gsap.from(".section-slider .slider-about", {
      opacity: 0,
      y: 40,
      scrollTrigger: {
        trigger: ".section-slider",
        start: "top 85%",
        end: "bottom 60%",
        scrub: 1.2,
      },
    });

    // SLIDER text animation
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section-slider",
          start: "top 65%", // when the section comes in
          end: "bottom 5%", // when the section exits
          scrub: true,
        },
      })
      .fromTo(".slider-title", { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .to(".slider-title", { opacity: 0, duration: 0.4 });

    // BUSINESS map title
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section-business",
          start: "top 65%", // when the section comes in
          end: "bottom 5%", // when the section exits
          scrub: true,
        },
      })
      .fromTo(".map-title", { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .to(".map-title", { opacity: 0, duration: 0.4 });

    // BUSINESS info
    gsap.from(".business-card", {
      opacity: 1,
      y: 120,
      scrollTrigger: {
        trigger: ".section-business",
        start: "top 85%",
        end: "bottom 60%",
        scrub: 1.2,
      },
    });
    // BUSINESS map
    gsap.from(".map-frame", {
      opacity: 0,
      x: 80,
      scrollTrigger: {
        trigger: ".section-business",
        start: "top 85%",
        scrub: 1.2,
      },
    });
  });

  //MOBILE only animations
  mm.add("(max-width: 767px)", () => {
    // BUSINESS INFO
    gsap.from(".business-card", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".section-business",
        start: "top 85%",
        scrub: 1.2,
      },
    });
    // BUSINESS map
    gsap.from(".map-frame", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".section-business",
        start: "top 85%",
        scrub: 1.2,
      },
    });
  });

  return () => {
    sliderCleanup();
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    gsap.ticker.remove(raf);
    lenis.off("scroll", onScroll);
    lenis.destroy();
    mm.revert();
    ScrollTrigger.getAll().forEach((trigger) => {
      if (!existingTriggers.has(trigger)) {
        trigger.kill();
      }
    });
  };
}
