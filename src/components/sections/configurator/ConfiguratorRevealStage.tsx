import { motion, useReducedMotion } from "framer-motion";

import type { ConfiguratorTechCard } from "@/constants/premiumProductSelection";

interface ConfiguratorRevealStageProps {
  brand: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  techCards: ConfiguratorTechCard[];
}

export function ConfiguratorRevealStage({
  brand,
  category,
  imageSrc,
  imageAlt,
  techCards,
}: ConfiguratorRevealStageProps) {
  const reduceMotion = useReducedMotion();
  const lines = techCards.slice(0, 4);

  return (
    <motion.div
      className="pps-studio-preview"
      role="region"
      aria-label="Ön izleme"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
        const py = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
        el.style.setProperty("--pps-studio-ptr-x", `${px}%`);
        el.style.setProperty("--pps-studio-ptr-y", `${py}%`);
      }}
    >
      {reduceMotion ? (
        <span className="pps-studio-preview__bloom" aria-hidden />
      ) : (
        <motion.span
          className="pps-studio-preview__bloom"
          aria-hidden
          animate={{ opacity: [0.35, 0.55, 0.42] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      )}
      {reduceMotion ? (
        <span className="pps-studio-preview__volumetric" aria-hidden />
      ) : (
        <motion.span
          className="pps-studio-preview__volumetric"
          aria-hidden
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      )}
      {reduceMotion ? (
        <span className="pps-studio-preview__smoke" aria-hidden />
      ) : (
        <motion.span
          className="pps-studio-preview__smoke"
          aria-hidden
          animate={{ opacity: [0.25, 0.42, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      )}

      {reduceMotion ? (
        <div className="pps-studio-preview__float">
          <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" className="pps-studio-preview__img" />
        </div>
      ) : (
        <motion.div
          className="pps-studio-preview__float"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" className="pps-studio-preview__img" />
        </motion.div>
      )}

      <ul className="pps-studio-preview__specs">
        {lines.map((row, i) => (
          <motion.li
            key={row.title}
            className="pps-studio-preview-spec"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.04 * i }}
          >
            <span className="pps-studio-preview-spec__k">{row.title}</span>
            <span className="pps-studio-preview-spec__v">{row.value}</span>
          </motion.li>
        ))}
      </ul>

      <p className="pps-studio-leg pps-studio-preview__leg">
        <span className="pps-studio-preview__meta-soft">{brand}</span>
        <span aria-hidden className="pps-studio-preview__meta-dot">
          {" "}
          ·{" "}
        </span>
        <span className="pps-studio-preview__meta-soft">{category}</span>
      </p>
    </motion.div>
  );
}
