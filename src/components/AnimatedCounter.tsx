import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { revealOnView } from "@/utils/revealOnView";

interface Props {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${prefix}${end}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    return revealOnView(
      el,
      () => {
        gsap.to(counter, {
          value: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
          },
        });
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0 },
    );
  }, [end, suffix, prefix, duration]);

  return (
    <span ref={ref} className={["stat-number", className].filter(Boolean).join(" ")}>
      {prefix}0{suffix}
    </span>
  );
}
