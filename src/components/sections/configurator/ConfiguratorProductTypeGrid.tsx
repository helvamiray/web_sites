import { motion } from "framer-motion";

import {
  CONFIGURATOR_TYPE_THUMB,
  type ProductTypeId,
  type ProductTypeOption,
} from "@/constants/premiumProductSelection";

interface ConfiguratorProductTypeGridProps {
  products: ProductTypeOption[];
  activeId: ProductTypeId | null;
  onPick: (id: ProductTypeId) => void;
}

const ROW = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const CELL = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ConfiguratorProductTypeGrid({
  products,
  activeId,
  onPick,
}: ConfiguratorProductTypeGridProps) {
  return (
    <div className="pps-studio-product">
      <p className="pps-studio-leg">1 · Ürün seç</p>
      <motion.ul
        className="pps-studio-product__grid-two"
        variants={ROW}
        initial="hidden"
        animate="show"
        role="list"
        aria-label="Ürün tipleri"
      >
        {products.map((p) => {
          const thumb = CONFIGURATOR_TYPE_THUMB[p.id];
          const isActive = activeId === p.id;
          return (
            <motion.li key={p.id} variants={CELL} className="pps-studio-product__cell">
              <motion.button
                type="button"
                data-lux-cursor=""
                aria-label={p.label}
                className={`pps-studio-product-card${isActive ? " pps-studio-product-card--selected" : ""}`}
                onClick={() => onPick(p.id)}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="pps-studio-product-card__glow" aria-hidden />
                <span className="pps-studio-product-card__visual">
                  <img src={thumb.src} alt="" className="pps-studio-product-card__img" />
                </span>
                <span className="pps-studio-product-card__copy">
                  <span className="pps-studio-product-card__name">{p.label}</span>
                  <span className="pps-studio-product-card__desc">{p.description}</span>
                </span>
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
