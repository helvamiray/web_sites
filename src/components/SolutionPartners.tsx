/**
 * Stratejik ortaklar — sinematik lacivert sahne; sakin cam kartlar ve sonsuz marquee.
 */
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
    <div className="lux-partners-logo-slide" data-partner-id={id} title={label}>
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
  const { logos, titleAccentEn, titleAccentTr, titlePrimaryEn, titlePrimaryTr, sectionSubEn, sectionSubTr } =
    useSyncedPartnerSection();

  const isTr = lang === "tr";
  const primary = isTr ? titlePrimaryTr : titlePrimaryEn;
  const accent = isTr ? titleAccentTr : titleAccentEn;
  const subline = isTr ? sectionSubTr : sectionSubEn;

  const track = [...logos, ...logos];

  return (
    <section
      id={SECTION_ID}
      className="solution-partners-section lux-partners lux-partners--showcase"
      aria-label="Stratejik çözüm ortakları"
    >
      <div className="lux-partners__layer lux-partners__layer--wash" aria-hidden />
      <div className="lux-partners__layer lux-partners__layer--reflection" aria-hidden />
      <div className="lux-partners__layer lux-partners__layer--grid" aria-hidden />
      <div className="lux-partners__layer lux-partners__layer--noise" aria-hidden />
      <div className="lux-partners__layer lux-partners__layer--vignette" aria-hidden />

      <div className="lux-partners__bg" aria-hidden />
      <div className="lux-partners__glow-orb lux-partners__glow-orb--ambient" aria-hidden />
      <div className="lux-partners__rails-ambient" aria-hidden />

      <div className="solution-partners-inner">
        <h2 className="solution-partners-title lux-partners-hero-title">
          <span className="lux-partners-hero-title__primary">{primary}</span>
          <span className="lux-partners-hero-title__accent">{accent}</span>
        </h2>
        <p className="solution-partners-sub lux-partners-hero-sub">{subline}</p>

        <div className="lux-partners-marquee-wrap">
          <div className="lux-partners-marquee lux-partners-marquee--single">
            <div className="lux-partners-marquee__beam" aria-hidden />
            <div className="lux-partners-marquee__mask">
              <div className="lux-partners-marquee__track lux-partners-marquee__track--forward">
                {track.map((p, i) => (
                  <PartnerLogoSlide key={`${p.id}-${i}`} id={p.id} label={p.label} src={p.src} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolutionPartners;
