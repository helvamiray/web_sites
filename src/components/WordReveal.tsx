import { useEffect, useRef } from "react";
import gsap from "gsap";

import { revealOnView } from "@/utils/revealOnView";

interface Props {
  text: string;
  /** Base text color (lit state). Default: inherit */
  litColor?: string;
  /** Dim color (unread state). Default: rgba(current, 0.18) */
  dimOpacity?: number;
  /** tag to render */
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Splits `text` into word-spans — one-shot staggered reveal on view (no scroll scrub).
 */
const WordReveal = ({
  text,
  litColor,
  dimOpacity = 0.18,
  as: Tag = "p",
  className,
  style,
}: Props) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const words = text.trim().split(/\s+/);
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="wr-word" style="display:inline; white-space:pre-wrap;">${w} </span>`,
      )
      .join("");

    if (!motionOk) {
      const wordEls = el.querySelectorAll<HTMLSpanElement>(".wr-word");
      gsap.set(wordEls, { opacity: 1 });
      return undefined;
    }

    const wordEls = el.querySelectorAll<HTMLSpanElement>(".wr-word");
    gsap.set(wordEls, { opacity: dimOpacity });

    return revealOnView(
      el,
      () => {
        gsap.to(wordEls, {
          opacity: 1,
          color: litColor,
          duration: 1.05,
          stagger: 0.04,
          ease: "power2.out",
        });
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0 },
    );
  }, [text, dimOpacity, litColor]);

  return (
    <Tag
      // @ts-expect-error — dynamic ref assignment
      ref={ref}
      className={className}
      style={style}
    />
  );
};

export default WordReveal;
