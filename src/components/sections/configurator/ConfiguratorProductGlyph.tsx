import type { ProductTypeId } from "@/constants/premiumProductSelection";

interface ConfiguratorProductGlyphProps {
  productId: ProductTypeId;
  className?: string;
}

/** Minimal blueprint-style HVAC glyphs — animated via parent CSS */
export function ConfiguratorProductGlyph({ productId, className }: ConfiguratorProductGlyphProps) {
  const cn = ["pps-cine-glyph", className].filter(Boolean).join(" ");

  switch (productId) {
    case "klima":
      return (
        <svg className={cn} viewBox="0 0 64 64" aria-hidden fill="none">
          <circle cx="32" cy="32" r="22" className="pps-cine-glyph__ring" strokeWidth="1.2" />
          <path
            className="pps-cine-glyph__stroke"
            strokeWidth="1.4"
            strokeLinecap="round"
            d="M32 14v36M22 22c8 6 12 6 20 0M22 42c8-6 12-6 20 0"
          />
          <circle cx="32" cy="32" r="3.5" className="pps-cine-glyph__core" strokeWidth="1.2" />
        </svg>
      );
    case "fancoil":
      return (
        <svg className={cn} viewBox="0 0 64 64" aria-hidden fill="none">
          <rect x="14" y="18" width="36" height="28" rx="4" className="pps-cine-glyph__stroke" strokeWidth="1.3" />
          <path className="pps-cine-glyph__stroke" strokeWidth="1.2" d="M18 26h28M18 34h28M18 42h28" />
          <path className="pps-cine-glyph__fan" strokeWidth="1.2" strokeLinecap="round" d="M46 46v8M42 50h8" />
        </svg>
      );
    case "isi-pompasi":
      return (
        <svg className={cn} viewBox="0 0 64 64" aria-hidden fill="none">
          <circle cx="32" cy="32" r="18" className="pps-cine-glyph__ring" strokeWidth="1.2" />
          <path
            className="pps-cine-glyph__stroke"
            strokeWidth="1.35"
            strokeLinecap="round"
            d="M32 18c9 6 10 22 0 28M32 18c-9 6-10 22 0 28"
          />
          <circle cx="32" cy="32" r="5" className="pps-cine-glyph__core" strokeWidth="1.2" />
        </svg>
      );
    case "kazan":
      return (
        <svg className={cn} viewBox="0 0 64 64" aria-hidden fill="none">
          <path
            className="pps-cine-glyph__stroke"
            strokeWidth="1.3"
            d="M22 42h20v10H22zM24 42V28h16v14"
          />
          <path className="pps-cine-glyph__stroke" strokeWidth="1.2" strokeLinecap="round" d="M28 28v-6h8v6" />
          <path className="pps-cine-glyph__fan" strokeWidth="1.2" strokeLinecap="round" d="M30 14s2-4 4-4 4 4 4 4" />
        </svg>
      );
    case "vrf":
      return (
        <svg className={cn} viewBox="0 0 64 64" aria-hidden fill="none">
          <circle cx="22" cy="40" r="6" className="pps-cine-glyph__core" strokeWidth="1.2" />
          <circle cx="42" cy="24" r="6" className="pps-cine-glyph__core" strokeWidth="1.2" />
          <circle cx="42" cy="46" r="5" className="pps-cine-glyph__core" strokeWidth="1.1" />
          <path
            className="pps-cine-glyph__stroke"
            strokeWidth="1.25"
            strokeLinecap="round"
            d="M26 37 L38 27 M38 31 L38 43 M41 43 L46 43"
          />
        </svg>
      );
  }
}
