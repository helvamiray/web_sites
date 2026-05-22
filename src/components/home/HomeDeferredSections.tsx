import { useEffect } from "react";
import { initScrollReveal } from "@/lib/scrollReveal";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { PremiumAboutManifestoSection } from "@/components/sections/PremiumAboutManifestoSection";
import { PremiumProductSelectionSection } from "@/components/sections/PremiumProductSelectionSection";
import { SolutionPartners } from "@/components/SolutionPartners";
import QuoteSimple from "@/components/QuoteSimple";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Ana sayfa hero sonrası — hakkımızda manifesto → parametrik seçici → markalar → iletişim → footer.
 */
export default function HomeDeferredSections() {
  useEffect(() => {
    return initScrollReveal();
  }, []);

  return (
    <>
      <PremiumAboutManifestoSection />
      <ParallaxLayer travelPx={14}>
        <PremiumProductSelectionSection />
      </ParallaxLayer>
      <ParallaxLayer travelPx={20}>
        <SolutionPartners />
      </ParallaxLayer>
      <ParallaxLayer travelPx={12}>
        <QuoteSimple />
      </ParallaxLayer>
      <ParallaxLayer travelPx={8}>
        <SiteFooter />
      </ParallaxLayer>
    </>
  );
}
