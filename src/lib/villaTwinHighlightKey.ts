/**
 * Maps catalog `componentKey` values to mesh keys present in the Villa3D Poly Haven scene.
 * Heat pump and fire products are not modeled separately; closest mechanical twins are used.
 */
const VILLA_TWIN_KEY_MAP: Record<string, string> = {
  heatpump: "boiler",
  "fire-system": "manifold",
};

export function villaTwinHighlightKey(componentKey: string | null): string | null {
  if (!componentKey) return null;
  return VILLA_TWIN_KEY_MAP[componentKey] ?? componentKey;
}
