import { BRANDS_BY_PRODUCT, type ProductTypeId } from "@/constants/premiumProductSelection";

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** True when a CMS/partner studio brand aligns with an HVAC category brand string. */
function overlaps(poolName: string, studioName: string): boolean {
  const a = norm(poolName);
  const b = norm(studioName);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  const filler = new Set(["hvac", "electric"]);
  const wordsA = a.split(/[\s./]+/).filter((w) => w.length >= 2 && !filler.has(w));
  const wordsB = b.split(/[\s./]+/).filter((w) => w.length >= 2 && !filler.has(w));

  return wordsA.some((wa) =>
    wordsB.some((wb) => {
      const minLen = wa.length >= 3 && wb.length >= 3;
      return wa === wb || (minLen && (wa.includes(wb) || wb.includes(wa)));
    }),
  );
}

/**
 * Prefer brands present in CMS that also belong to the curated pool for this product type.
 * If nothing matches (or CMS is empty), fall back to the full curated list.
 */
export function intersectBrandsForProductType(
  productId: ProductTypeId,
  studioBrands: readonly string[],
): string[] {
  const pool = BRANDS_BY_PRODUCT[productId];
  if (!pool?.length) return [...studioBrands];

  if (studioBrands.length === 0) return [...pool];

  const filtered = [...studioBrands].filter((s) => pool.some((p) => overlaps(p, s)));
  const base = filtered.length > 0 ? filtered : [...pool];

  base.sort((a, b) => {
    const ia = pool.findIndex((p) => overlaps(p, a));
    const ib = pool.findIndex((p) => overlaps(p, b));
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });

  const seen = new Set<string>();
  const result: string[] = [];
  for (const brand of base) {
    const key = norm(brand);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(brand);
  }
  return result;
}
