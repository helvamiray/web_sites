import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { ProductTypeId } from "@/constants/premiumProductSelection";
import { PRODUCT_TYPES } from "@/constants/premiumProductSelection";
import { ECS_STEPS } from "@/constants/engineeringConfigurationStudio";
import { ConfiguratorProductGlyph } from "@/components/sections/configurator/ConfiguratorProductGlyph";
import { StudioPreviewPanel } from "@/components/sections/engineering-studio/StudioPreviewPanel";
import { cn } from "@/lib/utils";

/**
 * Ultra premium “Engineering Configuration Studio” — luxury HVAC lab aesthetic.
 * Naval gradient shell, cyan accent, glass cards, cinematic preview (not game UI).
 */
export function EngineeringConfigurationStudioSection() {
  const [selectedId, setSelectedId] = useState<ProductTypeId | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [proximity, setProximity] = useState<Partial<Record<ProductTypeId, number>>>({});
  const cardRefs = useRef<Map<ProductTypeId, HTMLButtonElement>>(new Map());

  const handleSectionMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: nx * 16, y: ny * 12 });

    const next: Partial<Record<ProductTypeId, number>> = {};
    for (const p of PRODUCT_TYPES) {
      const el = cardRefs.current.get(p.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      const norm = Math.max(r.width, r.height) * 0.78;
      next[p.id] = Math.max(0, Math.min(1, 1 - d / norm));
    }
    setProximity(next);
  };

  const handleSectionLeave = () => {
    setParallax({ x: 0, y: 0 });
    setProximity({});
  };

  const previewOpen = !!selectedId;

  return (
    <section
      className="ecs-studio landing-page py-20 md:py-28 midnight-section midnight-section--studio"
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
    >
      <div className="ecs-studio__grid-layer" aria-hidden />
      <div
        className="ecs-studio__glow ecs-studio__glow--a"
        style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
        aria-hidden
      />
      <div
        className="ecs-studio__glow ecs-studio__glow--b"
        style={{
          transform: `translate3d(${-parallax.x * 0.6}px, ${-parallax.y * 0.5}px, 0)`,
        }}
        aria-hidden
      />
      <div className="ecs-studio__particles" aria-hidden />
      <div className="ecs-studio__frame-lines" aria-hidden />

      <div className="ecs-studio__inner container">
        <header className="mx-auto max-w-4xl pb-12 text-center md:pb-16">
          <p className="ecs-studio__label">KONFİGÜRASYON STÜDYOSU</p>
          <div className="ecs-studio__title-row mt-5 justify-center">
            <h2 className="ecs-studio__title">Mühendislik</h2>
            <span className="ecs-studio__title-italic">parametrik seçim</span>
          </div>
          <p className="ecs-studio__lede mt-6">
            İklimlendirme aileleri arasında soğuk mühendislik disiplini ile geçiş yapın. Cam yüzeyler
            üzerinde teknik ön izlemeye geçiş; kurulumsal vitrin dili ile uyumludur.
          </p>

          <nav className="ecs-studio-steps mt-10" aria-label="Yapılandırma adımları">
            {ECS_STEPS.map((s) => {
              const isActive =
                (s.id === 1 && !previewOpen) || (s.id === 4 && previewOpen);
              const isComplete = s.id === 1 && previewOpen;
              const isMuted =
                (s.id === 4 && !previewOpen) ||
                s.id === 2 ||
                s.id === 3;

              return (
                <div
                  key={s.id}
                  className={cn(
                    "ecs-studio-steps__item",
                    isActive && "ecs-studio-steps__item--active",
                    isComplete && !isActive && "ecs-studio-steps__item--complete",
                    isMuted && !isActive && "ecs-studio-steps__item--idle",
                  )}
                >
                  <span className="ecs-studio-steps__num">{s.id}</span>
                  {s.shortLabel}
                </div>
              );
            })}
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-12">
          <div className="ecs-studio-cards-scroll">
            {PRODUCT_TYPES.map((p) => (
              <div key={p.id} className="ecs-studio-card-wrap">
                <button
                  type="button"
                  ref={(el) => {
                    if (el) cardRefs.current.set(p.id, el);
                    else cardRefs.current.delete(p.id);
                  }}
                  className={cn(
                    "ecs-studio-card w-full text-left",
                    selectedId === p.id && "ecs-studio-card--selected",
                  )}
                  style={
                    {
                      "--ecs-prox": String(proximity[p.id] ?? 0),
                    } as CSSProperties
                  }
                  onClick={() => setSelectedId(p.id)}
                  aria-pressed={selectedId === p.id}
                >
                  <div className="ecs-studio-card__icon-wrap">
                    <ConfiguratorProductGlyph productId={p.id} />
                  </div>
                  <p className="ecs-studio-card__title">{p.label}</p>
                  <p className="ecs-studio-card__desc">{p.description}</p>
                </button>
              </div>
            ))}
          </div>

          <div className="relative lg:sticky lg:top-28">
            <StudioPreviewPanel selectedId={selectedId} />
          </div>
        </div>
      </div>
    </section>
  );
}
