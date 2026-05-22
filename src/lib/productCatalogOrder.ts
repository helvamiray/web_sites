import { VEGA_CATALOG_UPDATED_EVENT } from "@/lib/adminProductService";
import type { AdminProduct } from "@/lib/adminProductService";

const ORDER_KEY = "vega_product_catalog_order";

const isBrowser = () => typeof window !== "undefined";

export function getStoredProductOrder(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ORDER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function setStoredProductOrder(ids: readonly string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ORDER_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(VEGA_CATALOG_UPDATED_EVENT));
}

export function applyProductOrder(rows: AdminProduct[]): AdminProduct[] {
  const order = getStoredProductOrder();
  if (order.length === 0) return rows;
  const map = new Map(rows.map((r) => [r.id, r]));
  const seen = new Set<string>();
  const ordered: AdminProduct[] = [];
  for (const id of order) {
    const row = map.get(id);
    if (row) {
      ordered.push(row);
      seen.add(id);
    }
  }
  for (const r of rows) {
    if (!seen.has(r.id)) ordered.push(r);
  }
  return ordered;
}
