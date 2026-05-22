import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface ParallaxLayerProps {
  children: ReactNode;
  /** Peak vertical motion in px (one direction). Default 20. */
  travelPx?: number;
  className?: string;
}

/**
 * Subtle scroll-linked Y motion for section blocks — works with Lenis + Framer.
 */
export function ParallaxLayer({ children, travelPx = 20, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [travelPx * 0.38, -travelPx * 0.38],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className ?? "lux-parallax-wrap"}>
      {children}
    </motion.div>
  );
}
