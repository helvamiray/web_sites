import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useRef } from "react";

import type { CinematicShowcaseSlideDef } from "@/constants/cinematicShowcaseHeroSlides";

const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

/** Piksel bazlı parallax hedefleri — RAF ile yumşatılır (çok küçük hareket). */
const EDITORIAL_PARALLAX_HALF_SHIFT_X_PX = 11;
const EDITORIAL_PARALLAX_HALF_SHIFT_Y_PX = 8;
const PARALLAX_LERP = 0.072;

interface ShowroomHeroEditorialStillProps {
  slideDef: CinematicShowcaseSlideDef;
  motionOff: boolean;
  isTr: boolean;
}

/**
 * Anasayfa kahramanı — `showVisualStage={false}` iken hafif sağ vitrin (statik görsel, HUD yok).
 */
function ShowroomHeroEditorialStillBase({
  slideDef,
  motionOff,
  isTr,
}: ShowroomHeroEditorialStillProps) {
  const alt = isTr ? slideDef.showcaseImageAltTr : slideDef.showcaseImageAltEn;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || motionOff) return;

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (!visible && rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { root: null, threshold: 0.08 },
    );
    io.observe(el);

    let rafId = 0;
    let curX = 0;
    let curY = 0;
    let tgtX = 0;
    let tgtY = 0;

    const smooth = (): void => {
      if (!visible) {
        rafId = 0;
        return;
      }
      curX += (tgtX - curX) * PARALLAX_LERP;
      curY += (tgtY - curY) * PARALLAX_LERP;
      el.style.setProperty("--seh-shift-x", `${curX.toFixed(3)}px`);
      el.style.setProperty("--seh-shift-y", `${curY.toFixed(3)}px`);

      const settle = Math.abs(tgtX - curX) < 0.02 && Math.abs(tgtY - curY) < 0.02;
      if (!settle) {
        rafId = window.requestAnimationFrame(smooth);
      } else {
        rafId = 0;
        curX = tgtX;
        curY = tgtY;
        el.style.setProperty("--seh-shift-x", `${curX.toFixed(3)}px`);
        el.style.setProperty("--seh-shift-y", `${curY.toFixed(3)}px`);
      }
    };

    const queueSmooth = (): void => {
      if (!visible) return;
      if (!rafId) rafId = window.requestAnimationFrame(smooth);
    };

    const onMove = (ev: PointerEvent): void => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      tgtX =
        ((ev.clientX - r.left) / Math.max(r.width, 1) - 0.5) * EDITORIAL_PARALLAX_HALF_SHIFT_X_PX * 2;
      tgtY =
        ((ev.clientY - r.top) / Math.max(r.height, 1) - 0.5) * EDITORIAL_PARALLAX_HALF_SHIFT_Y_PX * 2;
      queueSmooth();
    };

    const onLeave = (): void => {
      tgtX = 0;
      tgtY = 0;
      queueSmooth();
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    el.style.setProperty("--seh-shift-x", "0px");
    el.style.setProperty("--seh-shift-y", "0px");

    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
      el.style.removeProperty("--seh-shift-x");
      el.style.removeProperty("--seh-shift-y");
    };
  }, [motionOff]);

  return (
    <div
      ref={rootRef}
      className={`ultra-premium-hero__visual studio-vega-hero__editorial-still${motionOff ? " studio-vega-hero__editorial-still--static" : ""}`}
    >
      <div className="studio-vega-hero__editorial-still-volumetrics" aria-hidden>
        <span className="studio-vega-hero__editorial-still-edge" />
        <span className="studio-vega-hero__editorial-still-haze" />
        <span className="studio-vega-hero__editorial-still-bloom studio-vega-hero__editorial-still-bloom--cyan">
          <span className="studio-vega-hero__editorial-still-bloom-core studio-vega-hero__editorial-still-breathe" />
        </span>
        <span className="studio-vega-hero__editorial-still-bloom studio-vega-hero__editorial-still-bloom--deep">
          <span className="studio-vega-hero__editorial-still-bloom-core-secondary studio-vega-hero__editorial-still-breathe-secondary" />
        </span>
        <span className="studio-vega-hero__editorial-still-floor" />
        <span className="studio-vega-hero__editorial-still-drift" />
      </div>

      <figure className="studio-vega-hero__editorial-still-figure">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slideDef.id}
            className="studio-vega-hero__editorial-still-frame"
            role="presentation"
            initial={motionOff ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={
              motionOff
                ? { opacity: 1, transition: { duration: 0 } }
                : { opacity: 0, x: -14, transition: { duration: 0.38, ease: EASE_APPLE } }
            }
            transition={
              motionOff
                ? { duration: 0 }
                : { duration: 0.58, ease: EASE_APPLE }
            }
          >
            <img
              src={slideDef.showcaseImageSrc}
              alt={alt}
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="studio-vega-hero__editorial-still-img"
              style={{
                objectPosition: slideDef.imageObjectPosition,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </figure>
    </div>
  );
}

/** Avoid re-rendering the hero still when parent `InteractiveShowroomHero` commits unrelated updates. */
export const ShowroomHeroEditorialStill = memo(ShowroomHeroEditorialStillBase);
