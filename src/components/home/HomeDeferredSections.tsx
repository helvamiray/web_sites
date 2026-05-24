import { Suspense, lazy, useEffect } from "react";

import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { scheduleIdleTask } from "@/utils/scheduleIdle";

const PremiumAboutManifestoSection = lazy(() =>
  import("@/components/sections/PremiumAboutManifestoSection").then((m) => ({
    default: m.PremiumAboutManifestoSection,
  })),
);

const PremiumProductSelectionSection = lazy(() =>
  import("@/components/sections/PremiumProductSelectionSection").then((m) => ({
    default: m.PremiumProductSelectionSection,
  })),
);

const SolutionPartners = lazy(() =>
  import("@/components/SolutionPartners").then((m) => ({ default: m.SolutionPartners })),
);

const QuoteSimple = lazy(() => import("@/components/QuoteSimple"));

const SiteFooter = lazy(() =>
  import("@/components/SiteFooter").then((m) => ({ default: m.SiteFooter })),
);

/**
 * Ana sayfa hero sonrası — kod bölüm bölüm yüklenir; scrollReveal + anime düşük öncelikle gelir.
 */
export default function HomeDeferredSections() {
  useEffect(() => {
    let revealTeardown: (() => void) | undefined;
    let cancelled = false;

    const cancelSchedule = scheduleIdleTask(() => {
      void import("@/lib/scrollReveal").then((mod) => {
        if (cancelled) return;
        revealTeardown = mod.initScrollReveal();
      });
    }, 1200);

    return () => {
      cancelled = true;
      cancelSchedule();
      revealTeardown?.();
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PremiumAboutManifestoSection />
      </Suspense>

      <ParallaxLayer travelPx={14}>
        <Suspense fallback={null}>
          <PremiumProductSelectionSection />
        </Suspense>
      </ParallaxLayer>

      <ParallaxLayer travelPx={20}>
        <Suspense fallback={null}>
          <SolutionPartners />
        </Suspense>
      </ParallaxLayer>

      <ParallaxLayer travelPx={12}>
        <Suspense fallback={null}>
          <QuoteSimple />
        </Suspense>
      </ParallaxLayer>

      <ParallaxLayer travelPx={8}>
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
      </ParallaxLayer>
    </>
  );
}
