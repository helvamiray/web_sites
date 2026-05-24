/**
 * Stratejik ortaklar — açık arka plan, koyu tipografi; mavi sahnelere kontrast oluşturan sakin blok.
 */
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { useSyncedPartnerSection } from "@/hooks/useSyncedSiteCms";
import { useLanguage } from "@/i18n/LanguageContext";

const SECTION_ID = "cozum-ortaklari";

function PartnerLogoSlide({
  id,
  label,
  src,
}: {
  id: string;
  label: string;
  src: string;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="lux-partners-logo-slide" data-partner-id={id}>
      {broken ? (
        <span className="lux-partners-logo-fallback">{label}</span>
      ) : (
        <img
          src={src}
          alt=""
          role="presentation"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

export function SolutionPartners() {
  const { lang } = useLanguage();
  const {
    logos,
    titleAccentEn,
    titleAccentTr,
    titlePrimaryEn,
    titlePrimaryTr,
    sectionSubEn,
    sectionSubTr,
  } = useSyncedPartnerSection();

  const isTr = lang === "tr";
  const primary = isTr ? titlePrimaryTr : titlePrimaryEn;
  const accent = isTr ? titleAccentTr : titleAccentEn;
  const subline = isTr ? sectionSubTr : sectionSubEn;

  const track = [...logos, ...logos];

  return (
    <section
      id={SECTION_ID}
      className="solution-partners-section lux-partners lux-partners--showcase"
      aria-label={isTr ? "Stratejik çözüm ortakları" : "Strategic solution partners"}
    >
      <div className="solution-partners-inner">
        <header className="lux-partners__head lux-partners-showcase__head">
          <h2 className="solution-partners-title lux-partners-hero-title">
            <span className="lux-partners-hero-title__primary">{primary}</span>
            <span className="lux-partners-hero-title__accent">{accent}</span>
          </h2>
          <p className="lux-partners-showcase__sub">{subline}</p>
        </header>

        <div className="lux-partners-marquee-wrap">
          <div className="lux-partners-marquee lux-partners-marquee--single">
            <div className="lux-partners-marquee__mask">
              <div className="lux-partners-marquee__track lux-partners-marquee__track--forward">
                {track.map((p, i) => (
                  <PartnerLogoSlide key={`${p.id}-${i}`} id={p.id} label={p.label} src={p.src} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="lux-partners-showcase__cta-wrap">
          <Link
            to="/"
            hash="iletisim"
            className="lux-partners-showcase__cta"
            data-lux-cursor=""
          >
            {isTr ? "İletişime geç" : "Get in touch"}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SolutionPartners;
