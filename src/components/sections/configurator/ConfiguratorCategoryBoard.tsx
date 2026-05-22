import { motion } from "framer-motion";

interface ConfiguratorCategoryBoardProps {
  categories: string[];
  selected: string | null;
  onPick: (category: string) => void;
}

const ROW = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.06 },
  },
};

const ITEM = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ConfiguratorCategoryBoard({
  categories,
  selected,
  onPick,
}: ConfiguratorCategoryBoardProps) {
  return (
    <motion.div
      className="pps-studio-chip"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="pps-studio-leg">3 · Alt kategori</p>
      <motion.ul className="pps-studio-chip__row" variants={ROW} initial="hidden" animate="show" role="list">
        {categories.map((c) => {
          const sel = selected === c;
          return (
            <motion.li key={c} variants={ITEM}>
              <motion.button
                type="button"
                aria-pressed={sel}
                className={`pps-studio-chip-btn${sel ? " pps-studio-chip-btn--selected" : ""}`}
                onClick={() => onPick(c)}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {c}
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}
