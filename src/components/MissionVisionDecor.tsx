/** Decorative SVGs for MissionVision manifesto section */

export function IconMission() {
  return (
    <svg className="lux-about-card__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.35" opacity="0.35" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.35" opacity="0.65" />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" />
      <path
        d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function IconVision() {
  return (
    <svg className="lux-about-card__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 17h16M7 14l3.5-8 4 5 3.5-4.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.88"
      />
      <path
        d="M6 19.5h12a1 1 0 001-1v-1H5v1a1 1 0 001 1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function BlueprintManifestoSchematic() {
  return (
    <svg viewBox="0 0 440 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        className="lux-about-blueprint-path"
        d="M36 104h148M36 104v168M184 104v72M36 272h252M288 176h116M404 176v112M288 288h116M36 328h188"
        stroke="rgba(103,232,249,0.32)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <rect
        x="96"
        y="72"
        width="72"
        height="44"
        rx="6"
        stroke="rgba(165,243,252,0.28)"
        strokeWidth="1"
      />
      <rect
        x="268"
        y="216"
        width="92"
        height="56"
        rx="8"
        stroke="rgba(56,189,248,0.38)"
        strokeWidth="1"
      />
      <circle cx="220" cy="208" r="52" stroke="rgba(103,232,249,0.18)" strokeWidth="1" strokeDasharray="5 9" />
      <circle cx="220" cy="208" r="28" stroke="rgba(165,243,252,0.35)" strokeWidth="0.85" strokeDasharray="3 7" />
      <path
        d="M332 56l28 22-28 22"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="lux-about-blueprint-energy"
        d="M220 148v120"
        stroke="url(#luxBpGlow)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="luxBpGlow" x1="220" y1="148" x2="220" y2="268">
          <stop offset="0%" stopColor="rgba(165,243,252,0)" />
          <stop offset="45%" stopColor="rgba(103,232,249,0.55)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
