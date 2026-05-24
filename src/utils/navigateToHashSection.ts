import type { NavigateFn } from "@tanstack/react-router";

/**
 * Prefer `behavior: "auto"` so programmatic scroll respects `html { scroll-behavior }` without JS easing libraries.
 * @deprecated Use `hashScrollIntoViewOptions()` directly; kept for callers that branch on programmatic smooth.
 */
export function prefersSmoothHashScroll(): boolean {
  return false;
}

/** Options for `scrollIntoView` and TanStack Router `hashScrollIntoView`. */
export function hashScrollIntoViewOptions(): {
  behavior: ScrollBehavior;
  block: "start";
} {
  return {
    behavior: "auto",
    block: "start",
  };
}

/** Scroll to `#id` on the current page, or navigate to `/#id` on the home page if the element is missing. */
export function navigateToHashSection(navigate: NavigateFn, hashId: string) {
  const el = document.getElementById(hashId);
  const scrollOpts = hashScrollIntoViewOptions();
  if (el) {
    el.scrollIntoView(scrollOpts);
    return;
  }
  navigate({
    to: "/",
    hash: hashId,
    resetScroll: false,
    hashScrollIntoView: scrollOpts,
  });
}
