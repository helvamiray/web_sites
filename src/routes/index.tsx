import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

import { CinematicAmbientLayer } from "@/components/layout/CinematicAmbientLayer";
import { Navbar } from "@/components/Navbar";
import InteractiveShowroomHero from "@/components/showroom/InteractiveShowroomHero";
import { ShowroomFilterProvider } from "@/context/ShowroomFilterContext";

import { hashScrollIntoViewOptions } from "@/utils/navigateToHashSection";
import { VEGA_CATALOG_SCROLL_KEY } from "@/constants/catalogScroll";
import "@/styles/gravity.css";

const HomeDeferredSections = lazy(() => import("@/components/home/HomeDeferredSections"));

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * Lazy yüklenen bölümlerdeki #id (ör. urun-konfigurator, hakkımızda) DOM’a girince kaydırmayı tekrar dene.
 */
function useDeferredHashScroll() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const hashId = (hash ?? "").replace(/^#/, "");

  useEffect(() => {
    if (!hashId) return;

    const deadline = Date.now() + 8000;
    const tryScroll = () => {
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView(hashScrollIntoViewOptions());
        return true;
      }
      return false;
    };

    if (tryScroll()) return undefined;

    const id = window.setInterval(() => {
      if (tryScroll() || Date.now() > deadline) {
        clearInterval(id);
      }
    }, 48);

    return () => clearInterval(id);
  }, [hashId]);
}

function Index() {
  useDeferredHashScroll();

  useEffect(() => {
    const prefetchDeferred = window.setTimeout(() => {
      void import("@/components/home/HomeDeferredSections");
    }, 0);

    return () => {
      clearTimeout(prefetchDeferred);
      void import("@/lib/smoothScroll").then((m) => {
        try {
          sessionStorage.setItem(VEGA_CATALOG_SCROLL_KEY, String(m.getMainScrollY()));
        } catch {
          /* ignore */
        }
      });
      void import("gsap/ScrollTrigger").then((ST) => {
        ST.ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return (
    <ShowroomFilterProvider>
      <div
        className="landing-page vega-enerji-theme premium-industrial-landing lux-cinematic-surface hp-premium-shell midnight-shell"
        style={{
          fontFamily: "var(--font-lux-sans, 'Satoshi', 'Inter', system-ui, sans-serif)",
          overflowX: "hidden",
        }}
      >
        <CinematicAmbientLayer />
        <Navbar />

        <div className="relative z-[5]">
          <InteractiveShowroomHero nextSectionId="hakkimizda" showVisualStage={false} />
        </div>

        <div className="main-content hp-premium-shell">
          <Suspense fallback={null}>
            <HomeDeferredSections />
          </Suspense>
        </div>
      </div>
    </ShowroomFilterProvider>
  );
}
