/**
 * Native window scrolling only — no Lenis / scroll hijacking / GSAP ticker coupling.
 */

export function initSmoothScroll(): null {
  return null;
}

export function destroySmoothScroll(): void {
  /* noop — kept so route cleanup imports stay stable */
}

export function getMainScrollY(): number {
  if (typeof window === "undefined") return 0;
  return window.scrollY ?? document.documentElement.scrollTop ?? 0;
}

/** Immediate jump (no programmatic smooth easing). */
export function scrollMainDocumentTo(y: number): void {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: Math.max(0, y), left: 0, behavior: "auto" });
}
