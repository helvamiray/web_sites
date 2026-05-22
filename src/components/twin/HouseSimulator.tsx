import Villa3D from "@/components/Villa3D";

export interface HouseSimulatorProps {
  highlightedKey: string | null;
  productImageUrl?: string | null;
}

/**
 * Digital twin house view — paket akışı: Villa3D + tek kat plan + dış cephe + Poly Haven (GSAP orbit).
 */
export function HouseSimulator({ highlightedKey, productImageUrl }: HouseSimulatorProps) {
  return <Villa3D highlightedKey={highlightedKey} productImageUrl={productImageUrl} />;
}

export default HouseSimulator;
