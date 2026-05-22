/**
 * Premium HVAC engineering wireframe — no raster icons; SVG blueprint aesthetic.
 */
export function ContactBlueprintVisual() {
  return (
    <svg
      className="lux-contact__blueprint-svg"
      viewBox="0 0 440 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="contactBpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#35d7ff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#67e8f9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#07111f" stopOpacity="0.15" />
        </linearGradient>
        <filter id="contactBpGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="contactFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35d7ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#07111f" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Soft ground plane */}
      <path
        d="M40 260 L220 200 L400 260 L220 316 Z"
        fill="url(#contactFloor)"
        stroke="#35d7ff"
        strokeOpacity="0.18"
        strokeWidth="0.75"
      />

      {/* Wireframe tower / zoning */}
      <g filter="url(#contactBpGlow)" stroke="url(#contactBpGrad)" strokeWidth="1.1" strokeLinejoin="round">
        <path
          d="M120 248 V140 L200 108 L280 140 V248"
          strokeOpacity="0.85"
          fill="none"
        />
        <path d="M120 248 L200 276 L280 248" strokeOpacity="0.65" fill="none" />
        <path d="M200 108 L200 276" strokeOpacity="0.35" strokeDasharray="4 6" />

        <rect
          x="148"
          y="152"
          width="104"
          height="64"
          rx="3"
          strokeOpacity="0.5"
          fill="rgba(53,215,255,0.04)"
        />
        <path d="M148 176 H252" strokeOpacity="0.35" />
        <path d="M184 152 V216" strokeOpacity="0.28" strokeDasharray="3 5" />

        {/* Duct schematic */}
        <path
          d="M60 120 H140 Q160 120 168 100 L176 72"
          strokeOpacity="0.55"
          fill="none"
        />
        <path d="M168 100 H320 Q340 100 348 118 L356 156" strokeOpacity="0.45" fill="none" />

        <circle cx="200" cy="92" r="22" strokeOpacity="0.7" fill="rgba(53,215,255,0.06)" />
        <circle cx="200" cy="92" r="8" strokeOpacity="0.9" fill="none" />

        {/* Digital twin mesh nodes */}
        <path
          d="M80 200 L140 176 M320 176 L380 200 M260 120 L300 88"
          strokeOpacity="0.35"
          strokeDasharray="2 5"
        />
        <circle cx="80" cy="200" r="3" fill="#35d7ff" fillOpacity="0.5" />
        <circle cx="380" cy="200" r="3" fill="#35d7ff" fillOpacity="0.5" />
        <circle cx="300" cy="88" r="3" fill="#35d7ff" fillOpacity="0.45" />

        <path
          d="M92 228 Q200 188 348 228"
          stroke="#35d7ff"
          strokeOpacity="0.25"
          strokeWidth="0.9"
          strokeDasharray="6 10"
          fill="none"
        />
      </g>

      {/* HVAC unit block — abstract */}
      <rect
        x="168"
        y="188"
        width="64"
        height="36"
        rx="4"
        stroke="#35d7ff"
        strokeOpacity="0.5"
        fill="rgba(7,17,31,0.08)"
      />
      <path d="M176 200 H224" stroke="#35d7ff" strokeOpacity="0.35" strokeWidth="0.8" />
      <path d="M184 210 H216" stroke="#35d7ff" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* Scan line */}
      <line
        x1="32"
        y1="124"
        x2="408"
        y2="124"
        stroke="#35d7ff"
        strokeOpacity="0.12"
        strokeWidth="0.75"
        strokeDasharray="10 14"
      />
    </svg>
  );
}
