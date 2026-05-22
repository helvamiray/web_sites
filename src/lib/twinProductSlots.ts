import { villaTwinHighlightKey } from "@/lib/villaTwinHighlightKey";

/**
 * Scene mesh keys registered in `Villa3D` / `componentsRef` (equipment groups).
 */
export type TwinSceneSlot =
  | "ac-units"
  | "boiler"
  | "tank"
  | "pump"
  | "manifold"
  | "underfloor"
  | "radiators";

/**
 * Per-product overrides: VRF / outdoor stations → mechanical yard emphasis (`pump`);
 * split wall AC → `ac-units` (living / bedroom wall heads in-scene).
 */
const PRODUCT_ID_SLOT: Partial<Record<string, TwinSceneSlot>> = {
  /** Daikin VRV 5 — dış ünite / mekanik alan vurgusu (sahnedeki sirkülasyon bölgesi). */
  "p-ac-daikin": "pump",
  "p-vrf-mitsubishi": "pump",
  /** Duvar tipi split — iç ünite duvar hattı. */
  "p-ac-residential": "ac-units",
};

/**
 * Resolve which 3D slot the digital twin camera & highlight should use for a catalog row.
 */
export function resolveTwinSceneSlot(productId: string, componentKey: string | null): string | null {
  const slot = PRODUCT_ID_SLOT[productId];
  if (slot) return slot;
  return villaTwinHighlightKey(componentKey);
}
