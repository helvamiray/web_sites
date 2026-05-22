import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { UI_THEME_STORAGE_KEY } from "@/constants/uiTheme";

export type UiColorMode = "dark" | "light";

interface UiThemeContextValue {
  mode: UiColorMode;
  setMode: (m: UiColorMode) => void;
  toggleMode: () => void;
}

const UiThemeContext = createContext<UiThemeContextValue | null>(null);

function readStoredMode(): UiColorMode | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(UI_THEME_STORAGE_KEY);
  if (v === "light" || v === "dark") return v;
  return null;
}

/**
 * Midnight Engineering — single dark surface language site-wide.
 * Light mode is disabled; toggle is a no-op for API compatibility.
 */
export function UiThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const stored = readStoredMode();
    if (stored === "light") {
      try {
        localStorage.setItem(UI_THEME_STORAGE_KEY, "dark");
      } catch {
        /* quota */
      }
    }
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-ui-theme", "dark");
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    try {
      localStorage.setItem(UI_THEME_STORAGE_KEY, "dark");
    } catch {
      /* ignore */
    }
  }, [mounted]);

  const setMode = (_m: UiColorMode) => {
    /* light mode intentionally unavailable */
  };
  const toggleMode = () => {
    /* no-op */
  };

  const ctx: UiThemeContextValue = {
    mode: "dark",
    setMode,
    toggleMode,
  };

  return <UiThemeContext.Provider value={ctx}>{children}</UiThemeContext.Provider>;
}

export function useUiTheme(): UiThemeContextValue {
  const ctx = useContext(UiThemeContext);
  if (!ctx) {
    throw new Error("useUiTheme must be used within UiThemeProvider");
  }
  return ctx;
}
