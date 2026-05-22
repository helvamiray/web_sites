import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { useLanguage } from "@/i18n/LanguageContext";

/** Full-bleed asset for Engineering Philosophy / Hakkımızda hero column */
export const ENGINEERING_PHILOSOPHY_STUDIO_IMAGE = "/img/engineering-philosophy-studio.png";

interface AboutEngineeringStudioVisualProps {
  className?: string;
}

/**
 * Cinematic HVAC engineering environment — no card frame; blends into section atmosphere.
 */
export function AboutEngineeringStudioVisual({ className = "" }: AboutEngineeringStudioVisualProps) {
  const { lang } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [12, -12],
  );

  const alt =
    lang === "tr"
      ? "Geleceğe dönük HVAC mühendislik stüdyosu — havada süzülen sistem montajı, cyan hacim ışık ve mimari karanlık sahne"
      : "Futuristic HVAC engineering studio — floating system assembly, cyan volumetric light in a dark architectural space";

  return (
    <div ref={rootRef} className={`lux-about-engineering-studio${className ? ` ${className}` : ""}`}>
      <div className="lux-about-engineering-studio__dust" aria-hidden />
      <div className="lux-about-engineering-studio__ambient-pulse" aria-hidden />
      <motion.div className="lux-about-engineering-studio__parallax" style={{ y: parallaxY }}>
        <figure className="lux-about-engineering-studio__figure">
          <span className="lux-about-engineering-studio__bloom" aria-hidden />
          <span className="lux-about-engineering-studio__bloom lux-about-engineering-studio__bloom--delay" aria-hidden />
          <img
            className="lux-about-engineering-studio__media"
            src={ENGINEERING_PHILOSOPHY_STUDIO_IMAGE}
            alt={alt}
            width={1600}
            height={1200}
            decoding="async"
            loading="lazy"
          />
          <span className="lux-about-engineering-studio__vignette" aria-hidden />
          <span className="lux-about-engineering-studio__depth-fog" aria-hidden />
        </figure>
      </motion.div>
    </div>
  );
}
