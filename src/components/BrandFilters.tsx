import type { TwinBrandFilterId } from "@/types";

export interface BrandFiltersProps {
  active: TwinBrandFilterId;
  onChange: (brand: TwinBrandFilterId) => void;
  className?: string;
}

const BRANDS: TwinBrandFilterId[] = [
  "TÜMÜ",
  "DAİKİN",
  "BUDERUS",
  "E.C.A",
  "LOWARA",
  "KODSAN",
  "CALEFİ",
  "FRANKİSCHE",
  "TYCO",
];

export function BrandFilters({ active, onChange, className }: BrandFiltersProps) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] ${className ?? ""}`}
      role="tablist"
      aria-label="Marka filtresi"
    >
      {BRANDS.map((brand) => {
        const isActive = active === brand;
        return (
          <button
            key={brand}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(brand)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? "border-white/30 bg-white/20 text-white"
                : "border-white/10 bg-transparent text-[#cbd5e1] hover:border-white/20 hover:bg-white/5"
            }`}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}
