import { useMemo, useState } from "react";
import { BrandFilters } from "@/components/BrandFilters";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import {
  TWIN_CONFIGURATOR_PRODUCTS,
  TWIN_CONFIGURATOR_TOTAL,
} from "@/data/twinConfiguratorProducts";
import type { TwinBrandFilterId, TwinConfiguratorProduct } from "@/types";

function normalize(query: string) {
  return query.trim().toLocaleLowerCase("tr-TR");
}

function matchesSearch(product: TwinConfiguratorProduct, raw: string): boolean {
  const q = normalize(raw);
  if (!q.length) return true;
  const name = normalize(product.name);
  const brand = normalize(product.brandDisplay);
  return name.includes(q) || brand.includes(q);
}

function matchesBrand(product: TwinConfiguratorProduct, brand: TwinBrandFilterId): boolean {
  if (brand === "TÜMÜ") return true;
  return product.brandKey === brand;
}

export interface ProductCatalogProps {
  className?: string;
}

export function ProductCatalog({ className }: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<TwinBrandFilterId>("TÜMÜ");

  const filtered = useMemo(
    () =>
      TWIN_CONFIGURATOR_PRODUCTS.filter((p) => matchesBrand(p, brand) && matchesSearch(p, query)),
    [brand, query],
  );

  return (
    <div className={className}>
      <SearchBar value={query} onChange={setQuery} className="mb-4" />
      <BrandFilters active={brand} onChange={setBrand} className="mb-3" />
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
        {filtered.length} / {TWIN_CONFIGURATOR_TOTAL} ÜRÜN
      </p>
      <div className="flex flex-col gap-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#94a3b8]">
            Bu filtrelere uygun ürün bulunamadı.
          </p>
        ) : null}
      </div>
    </div>
  );
}
