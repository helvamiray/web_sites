/** Orijinal renkli Simple Icons (CDN SVG) + yerel vektör */
const SI = "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons";

export interface StrategicPartnerLogo {
  id: string;
  label: string;
  /** SVG veya raster URL */
  src: string;
}

/** Premium teknoloji vitrin — seçkin HVAC / mühendislik markaları */
export const STRATEGIC_PARTNER_LOGOS: readonly StrategicPartnerLogo[] = [
  { id: "daikin", label: "Daikin", src: `${SI}/daikin.svg` },
  { id: "samsung", label: "Samsung", src: `${SI}/samsung.svg` },
  { id: "mitsubishi", label: "Mitsubishi Electric", src: `${SI}/mitsubishielectric.svg` },
  { id: "viessmann", label: "Viessmann", src: `${SI}/viessmann.svg` },
  { id: "wilo", label: "Wilo", src: `${SI}/wilo.svg` },
  { id: "caleffi", label: "Caleffi", src: `${SI}/caleffi.svg` },
  { id: "frankische", label: "Fränkische", src: "/img/partners/frankische.svg" },
  { id: "tyco", label: "Tyco", src: `${SI}/tyco.svg` },
] as const;
