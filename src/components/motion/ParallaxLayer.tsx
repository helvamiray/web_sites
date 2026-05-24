import type { ReactNode } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  /** @deprecated Unused — scroll-linked motion removed for native scroll performance. */
  travelPx?: number;
  className?: string;
}

/**
 * Stable section wrapper — previous scroll-linked parallax removed so the main document scroll stays native/fast.
 */
export function ParallaxLayer({ children, className }: ParallaxLayerProps) {
  return <div className={className ?? "lux-parallax-wrap"}>{children}</div>;
}
