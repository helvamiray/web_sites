/**
 * Ana sayfa ve katalog bölümleri — Anime.js v4 ScrollObserver ile “scrollytelling”.
 * GSAP ScrollTrigger kullanılmaz; tüm seçiciler mevcut işaretleme ile uyumludur.
 */
import { animate, onScroll, stagger } from "animejs";

type Revertible = { revert: () => unknown };

export function initScrollReveal(): () => void {
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const observers: Revertible[] = [];

  if (!motionOk) {
    return () => {};
  }

  const linkScrub = (el: HTMLElement, translateFrom: number) => {
    const anim = animate(el, {
      opacity: [0, 1],
      translateY: [translateFrom, 0],
      filter: ["blur(11px)", "blur(0px)"],
      autoplay: false,
      duration: 1,
      ease: "linear",
    });
    const obs = onScroll({
      target: el,
      enter: "end start",
      leave: "start end",
      sync: "linear",
      repeat: true,
    }).link(anim);
    observers.push(obs);
  };

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    linkScrub(el, 52);
  });

  document.querySelectorAll<HTMLElement>(".section-headline").forEach((el) => {
    linkScrub(el, 42);
  });

  document.querySelectorAll<HTMLElement>("[data-reveal-glass]").forEach((el) => {
    linkScrub(el, 40);
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

    let ran = false;
    const obs = onScroll({
      target: parent,
      enter: "end start",
      leave: "start end",
      repeat: false,
      /** Varsayılan `sync: 'play pause'` scrub ile callback tetiklemesini bozabilir */
      sync: false,
      onEnter: () => {
        if (ran) return;
        ran = true;
        animate(children, {
          opacity: [0, 1],
          translateY: [36, 0],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 820,
          ease: "out(4)",
          delay: stagger(88, { ease: "out(2)", from: "first" }),
        });
      },
    });
    observers.push(obs);
  });

  return () => {
    observers.forEach((o) => {
      try {
        o.revert();
      } catch {
        /* noop */
      }
    });
  };
}
