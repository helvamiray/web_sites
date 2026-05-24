/**
 * One-shot reveal when an element enters the viewport — no scroll listeners / scrub.
 */
const DEFAULT_ROOT_MARGIN = "0px 0px -12% 0px";

export function revealOnView(
  element: Element,
  onReveal: () => void,
  options?: IntersectionObserverInit,
): () => void {
  let done = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (done) return;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        done = true;
        try {
          onReveal();
        } finally {
          io.disconnect();
        }
        return;
      }
    },
    {
      root: null,
      rootMargin: DEFAULT_ROOT_MARGIN,
      threshold: 0.08,
      ...options,
    },
  );
  io.observe(element);
  return () => {
    done = true;
    io.disconnect();
  };
}
