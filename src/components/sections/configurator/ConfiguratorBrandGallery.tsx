import { motion } from "framer-motion";

import { getConfiguratorBrandLogoUrl } from "@/constants/premiumProductSelection";

interface ConfiguratorBrandGalleryProps {
  brands: readonly string[];
  selected: string | null;
  onPick: (brand: string) => void;
}

const WRAP = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const ITEM = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Monochrome kelime işareti — cam panel içinde Beyaz Porsche / minimal tipografi görünümü */
function BrandMono({ name }: { name: string }) {
  return (
    <span className="pps-studio-brand-card__mono" aria-hidden>
      {name}
    </span>
  );
}

export function ConfiguratorBrandGallery({ brands, selected, onPick }: ConfiguratorBrandGalleryProps) {
  return (
    <motion.div
      className="pps-studio-brand"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="pps-studio-leg">2 · Marka seç</p>
      <motion.ul className="pps-studio-brand__rail" variants={WRAP} initial="hidden" animate="show" role="list">
        {brands.map((b) => {
          const sel = selected === b;
          const logoUrl = getConfiguratorBrandLogoUrl(b);
          return (
            <motion.li key={b} variants={ITEM}>
              <motion.button
                type="button"
                data-lux-cursor=""
                aria-label={b}
                aria-pressed={sel}
                className={`pps-studio-brand-card${sel ? " pps-studio-brand-card--selected" : ""}`}
                onClick={() => onPick(b)}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="pps-studio-brand-card__haze" aria-hidden />
                <span className="pps-studio-brand-card__rim" aria-hidden />
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="pps-studio-brand-card__logo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <BrandMono name={b} />
                )}
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}
