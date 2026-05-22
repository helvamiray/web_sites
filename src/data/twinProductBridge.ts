import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

/** Maps twin configurator ids → canonical `PRODUCTS` entries for project basket. */
const TWIN_ID_TO_PRODUCT_ID: Record<string, string> = {
  "twin-1": "p-ac-daikin",
  "twin-2": "p-vrf-mitsubishi",
  "twin-3": "p-heatpump-daikin",
  "twin-4": "p-heatpump-samsung",
  "twin-5": "p-boiler-industrial",
  "twin-6": "p-boiler-buderus",
  "twin-7": "p-pump-wilo",
  "twin-8": "p-tank-kodsan",
  "twin-9": "p-ac-residential",
  "twin-10": "p-pump-wilo",
  "twin-11": "p-fire-tyco",
};

export function resolveTwinProductId(twinConfiguratorId: string): Product | undefined {
  const pid = TWIN_ID_TO_PRODUCT_ID[twinConfiguratorId];
  if (!pid) return undefined;
  return PRODUCTS.find((p) => p.id === pid);
}
