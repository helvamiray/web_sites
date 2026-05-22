import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA_MAX_NARROW } from "@/constants/layoutBreakpoint";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  /* Lenis: sadece lg+; dar viewport’ta native scroll + dokunmatik daha doğal. */
  if (window.matchMedia(MEDIA_MAX_NARROW).matches) return null;

  if (lenisInstance) return lenisInstance;

  /** Apple-style weight: lower lerp + gentler wheel, smoother program scroll easing */
  const lenis = new Lenis({
    lerp: 0.068,
    duration: 1.58,
    wheelMultiplier: 0.92,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;
  return lenis;
}

export function destroySmoothScroll(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/** Current vertical scroll (Lenis proxy when active). */
export function getMainScrollY(): number {
  if (typeof window === "undefined") return 0;
  if (lenisInstance) return lenisInstance.scroll;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

/** Jump main document scroll — Lenis-aware for lg+ smooth scroll. */
export function scrollMainDocumentTo(y: number): void {
  if (typeof window === "undefined") return;
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { immediate: true });
    return;
  }
  window.scrollTo(0, y);
}
