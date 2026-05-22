interface ConfiguratorEngineeringHudProps {
  className?: string;
}

/** Animated schematic HUD layer — blueprint cinema */
export function ConfiguratorEngineeringHud({ className }: ConfiguratorEngineeringHudProps) {
  return (
    <svg
      className={["pps-cine-hud", className].filter(Boolean).join(" ")}
      viewBox="0 0 520 320"
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="ppsHudStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(103,232,249,0.55)" />
          <stop offset="50%" stopColor="rgba(56,189,248,0.2)" />
          <stop offset="100%" stopColor="rgba(165,243,252,0.45)" />
        </linearGradient>
      </defs>
      <rect x="24" y="20" width="472" height="280" rx="6" stroke="url(#ppsHudStroke)" strokeWidth="0.75" opacity="0.45" />
      <path
        className="pps-cine-hud__dash"
        stroke="rgba(103,232,249,0.35)"
        strokeWidth="0.9"
        strokeDasharray="6 10"
        d="M48 76h424M48 156h312M48 236h380"
      />
      <path className="pps-cine-hud__pulse" stroke="rgba(56,189,248,0.55)" strokeWidth="1.1" d="M420 96l72 64-72 64" />
      <circle cx="120" cy="240" r="28" stroke="rgba(103,232,249,0.25)" strokeWidth="0.8" />
      <circle cx="392" cy="68" r="18" stroke="rgba(165,243,252,0.3)" strokeWidth="0.75" />
      <path stroke="rgba(34,211,238,0.35)" strokeWidth="0.8" d="M96 52v216M428 52v216" strokeDasharray="4 12" />
    </svg>
  );
}
