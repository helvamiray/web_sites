/**
 * Run work after first paint — avoids competing with LCP/interaction on hydration.
 */
export function scheduleIdleTask(fn: () => void, idleTimeoutMs = 2200): () => void {
  if (typeof window === "undefined") {
    fn();
    return () => {};
  }

  let id: ReturnType<typeof window.requestIdleCallback> | undefined;
  let t: number | undefined;

  const run = () => {
    t = undefined;
    id = undefined;
    fn();
  };

  if (typeof window.requestIdleCallback === "function") {
    id = window.requestIdleCallback(run, { timeout: idleTimeoutMs });
  } else {
    t = window.setTimeout(run, idleTimeoutMs > 900 ? 450 : idleTimeoutMs);
  }

  return () => {
    if (id !== undefined && typeof window.cancelIdleCallback === "function") {
      window.cancelIdleCallback(id);
    }
    if (t !== undefined) window.clearTimeout(t);
  };
}
