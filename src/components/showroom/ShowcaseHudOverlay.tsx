import { AnimatePresence, motion, type Transition } from "framer-motion";

export interface ShowcaseHudOverlayCard {
  readonly label: string;
  readonly value: string;
}

interface ShowcaseHudOverlayProps {
  readonly motionKey: string;
  readonly frameId: string;
  readonly cards: readonly ShowcaseHudOverlayCard[];
  readonly reducedMotion: boolean;
}

const HUD_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Decorative engineering HUD — glass readouts anchored to the product stage (not live telemetry).
 */
export function ShowcaseHudOverlay({
  motionKey,
  frameId,
  cards,
  reducedMotion,
}: ShowcaseHudOverlayProps) {
  if (cards.length === 0 && !frameId) return null;

  const rootHidden = reducedMotion
    ? { opacity: 1 }
    : { opacity: 0, scale: 0.985 };
  const rootShow = reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 };
  const rootExit = reducedMotion
    ? { opacity: 1 }
    : { opacity: 0, scale: 0.99, transition: { duration: 0.42, ease: HUD_EASE } };

  const itemHidden = reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8, filter: "blur(5px)" };
  const itemShow = reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" };

  const rootTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.75, ease: HUD_EASE, delay: 0.06 };

  const itemTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.52, ease: HUD_EASE };

  const listStagger: Transition = reducedMotion
    ? { duration: 0 }
    : {
        staggerChildren: 0.068,
        delayChildren: 0.16,
      };

  const listVariants = {
    hidden: {},
    show: {
      transition: listStagger,
    },
  };

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={motionKey}
        className="studio-vega-hero__showcase-hud-root"
        aria-hidden
        initial={rootHidden}
        animate={rootShow}
        exit={rootExit}
        transition={rootTransition}
      >
        <div className="studio-vega-hero__showcase-hud-grid-lines" />

        <div className="studio-vega-hero__showcase-hud-corner studio-vega-hero__showcase-hud-corner--tl" />
        <div className="studio-vega-hero__showcase-hud-corner studio-vega-hero__showcase-hud-corner--tr" />

        {frameId ? (
          <div className="studio-vega-hero__showcase-hud-chip">
            <span className="studio-vega-hero__showcase-hud-chip-scan" aria-hidden />
            <span className="studio-vega-hero__showcase-hud-chip-prefix">REF</span>
            <span className="studio-vega-hero__showcase-hud-chip-divider" aria-hidden />
            <span className="studio-vega-hero__showcase-hud-chip-id">{frameId}</span>
          </div>
        ) : null}

        <motion.ul
          className="studio-vega-hero__showcase-hud-cards"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {cards.map((c) => (
            <motion.li
              key={`${motionKey}-${c.label}`}
              className="studio-vega-hero__showcase-hud-card"
              variants={{
                hidden: itemHidden,
                show: itemShow,
              }}
              transition={itemTransition}
            >
              <span className="studio-vega-hero__showcase-hud-card-glint" aria-hidden />
              <span className="studio-vega-hero__showcase-hud-card-label">{c.label}</span>
              <span className="studio-vega-hero__showcase-hud-card-value">{c.value}</span>
              <span className="studio-vega-hero__showcase-hud-card-corner" aria-hidden />
            </motion.li>
          ))}
        </motion.ul>

        <div className="studio-vega-hero__showcase-hud-corner studio-vega-hero__showcase-hud-corner--br" />
      </motion.div>
    </AnimatePresence>
  );
}
