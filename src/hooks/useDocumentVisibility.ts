import { useEffect, useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void): () => void {
  document.addEventListener("visibilitychange", onStoreChange);
  return () => document.removeEventListener("visibilitychange", onStoreChange);
}

function getDocumentVisible(): boolean {
  if (typeof document === "undefined") return true;
  return document.visibilityState === "visible";
}

/** Tab / PWA foreground — SSR falls back to true (avoid flash). */
export function useDocumentVisibility(): boolean {
  return useSyncExternalStore(subscribe, getDocumentVisible, () => true);
}

/**
 * Keeps `data-page-visible` on `<html>` for CSS-based pausing of ambient animations off-tab.
 */
export function useHtmlPageVisibilityAttribute(): void {
  const visible = useDocumentVisibility();

  useEffect(() => {
    document.documentElement.dataset.pageVisible = visible ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.pageVisible;
    };
  }, [visible]);
}
