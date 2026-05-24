/**
 * Section reveals — one-shot IntersectionObserver + Anime.js (no scroll scrub / no per-frame scroll work).
 */
import { animate, stagger } from "animejs";

import { revealOnView } from "@/utils/revealOnView";

export function initScrollReveal(): () => void {
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disposers: (() => void)[] = [];

  if (!motionOk) {
    return () => {};
  }

  const revealEl = (el: HTMLElement, translateFrom: number) => {
    disposers.push(
      revealOnView(el, () => {
        animate(el, {
          opacity: [0, 1],
          translateY: [translateFrom, 0],
          filter: ["blur(11px)", "blur(0px)"],
          duration: 820,
          ease: "out(4)",
        });
      }),
    );
  };

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    revealEl(el, 52);
  });

  document.querySelectorAll<HTMLElement>(".section-headline").forEach((el) => {
    revealEl(el, 42);
  });

  document.querySelectorAll<HTMLElement>("[data-reveal-glass]").forEach((el) => {
    revealEl(el, 40);
  });

  document.querySelectorAll<HTMLElement>("[data-reveal-children]").forEach((parent) => {
    const children = Array.from(parent.children).filter(
      (n): n is HTMLElement => n instanceof HTMLElement,
    );
    children.forEach((ch) => {
      ch.style.opacity = "0";
      ch.style.transform = "translateY(30px)";
      ch.style.filter = "blur(10px)";
    });

    disposers.push(
      revealOnView(parent, () => {
        animate(children, {
          opacity: [0, 1],
          translateY: [36, 0],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 820,
          ease: "out(4)",
          delay: stagger(88, { ease: "out(2)", from: "first" }),
        });
      }),
    );
  });

  return () => {
    disposers.forEach((d) => d());
  };
}
