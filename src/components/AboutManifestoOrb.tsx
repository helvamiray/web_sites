import { useCallback } from "react";

/**
 * Futuristic centerpiece — holographic climate orb, blueprint rings, telemetry HUD.
 * Pure SVG/CSS; no product photography.
 */
export function AboutManifestoOrb() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
    el.style.setProperty("--lux-orb-x", `${x}%`);
    el.style.setProperty("--lux-orb-y", `${y}%`);
  }, []);

  return (
    <div
      className="lux-about-visual__stage lux-about-manifesto-orb"
      onPointerMove={onPointerMove}
      aria-hidden
    >
      <span className="lux-about-manifesto-orb__halo" />
      <span className="lux-about-manifesto-orb__pulse-ring" />

      <svg className="lux-about-manifesto-orb__svg" viewBox="0 0 420 420" fill="none" aria-hidden>
        <defs>
          <radialGradient id="luxOrbCore" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(236,254,255,0.55)" />
            <stop offset="35%" stopColor="rgba(56,189,248,0.35)" />
            <stop offset="68%" stopColor="rgba(14,116,144,0.15)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </radialGradient>
          <radialGradient id="luxOrbInner" cx="50%" cy="50%" r="48%">
            <stop offset="0%" stopColor="rgba(165,243,252,0.25)" />
            <stop offset="100%" stopColor="rgba(8,47,73,0)" />
          </radialGradient>
          <filter id="luxOrbBloom" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="luxOrbArc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(103,232,249,0.9)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.15)" />
          </linearGradient>
        </defs>

        <g className="lux-about-manifesto-orb__ring-group lux-about-manifesto-orb__ring-group--outer">
          <circle cx="210" cy="210" r="188" stroke="url(#luxOrbArc)" strokeWidth="0.85" strokeDasharray="10 14" opacity="0.45" />
        </g>
        <g className="lux-about-manifesto-orb__ring-group lux-about-manifesto-orb__ring-group--mid">
          <circle cx="210" cy="210" r="152" stroke="rgba(103,232,249,0.35)" strokeWidth="1.1" strokeDasharray="6 12" />
          <circle cx="210" cy="210" r="152" stroke="rgba(165,243,252,0.12)" strokeWidth="6" opacity="0.35" />
        </g>
        <g className="lux-about-manifesto-orb__ring-group lux-about-manifesto-orb__ring-group--inner">
          <circle cx="210" cy="210" r="118" stroke="rgba(56,189,248,0.55)" strokeWidth="0.75" strokeDasharray="4 8" opacity="0.7" />
        </g>

        <circle cx="210" cy="210" r="96" fill="url(#luxOrbInner)" opacity="0.9" filter="url(#luxOrbBloom)" />
        <circle cx="210" cy="210" r="78" fill="url(#luxOrbCore)" />

        <path
          className="lux-about-manifesto-orb__scan"
          d="M118 210h184M210 118v184"
          stroke="rgba(165,243,252,0.28)"
          strokeWidth="0.75"
          strokeDasharray="3 10"
        />

        <g opacity="0.55" stroke="rgba(148,231,255,0.5)" strokeWidth="0.65">
          <path d="M260 132l42 28-42 28M158 268l-42-28 42-28" strokeLinecap="round" />
          <circle cx="210" cy="210" r="44" strokeDasharray="3 7" opacity="0.6" />
        </g>
      </svg>

      <span className="lux-about-telemetry lux-about-telemetry--cop">COP · 4.6 — 5.2</span>
      <span className="lux-about-telemetry lux-about-telemetry--flow">ΔT · optimize</span>
      <span className="lux-about-telemetry lux-about-telemetry--quiet">{`<19 dB(A)`}</span>
      <span className="lux-about-telemetry lux-about-telemetry--sys">SYS · HVAC twin</span>
    </div>
  );
}
