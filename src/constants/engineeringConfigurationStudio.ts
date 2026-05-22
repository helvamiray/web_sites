import type { ProductTypeId } from "@/constants/premiumProductSelection";

/** Default Vega catalog `Product.id` when adding from studio preview */
export const STUDIO_CART_PRODUCT_ID: Record<ProductTypeId, string> = {
  klima: "p-ac-residential",
  fancoil: "p-ac-residential",
  "isi-pompasi": "p-heatpump-daikin",
  kazan: "p-boiler-industrial",
  vrf: "p-ac-daikin",
};

export interface StudioPreviewMetric {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
}

/** Cinematic preview strip — restrained, laboratory-style readouts */
export const STUDIO_PREVIEW_METRICS: Record<ProductTypeId, readonly StudioPreviewMetric[]> = {
  klima: [
    { label: "SEER", value: "8,6", hint: "Seasonal" },
    { label: "Enerji", value: "A+++", hint: "EU etiket" },
    { label: "Akustik", value: "19 dB(A)", hint: "Gece profili" },
    { label: "Kontrol", value: "Smart Climate", hint: "Iklim senaryoları" },
  ],
  fancoil: [
    { label: "EC motor", value: "sınıf A", hint: "Sürekli debi" },
    { label: "Statik", value: "50–250 Pa", hint: "Kanal uyumu" },
    { label: "Kontrol", value: "0–10 V · Modbus", hint: "BMS hazır" },
    { label: "Serpantin", value: "4 borulu", hint: "Düşük ΔT" },
  ],
  "isi-pompasi": [
    { label: "SCOP", value: "A+++", hint: "Part-load" },
    { label: "Çalışma", value: "−28 °C", hint: "Çıkış suyu" },
    { label: "Refrigerant", value: "R32", hint: "Düşük GWP" },
    { label: "Akıllı", value: "Climate curve", hint: "Uyarlanabilir" },
  ],
  kazan: [
    { label: "Verim", value: "%109", hint: "Yoğuşmalı" },
    { label: "Kapasite", value: "100–400 kW", hint: "Kaskad" },
    { label: "Emisyon", value: "NOx 6", hint: "Şehir gazı" },
    { label: "İzleme", value: "SCADA", hint: "Uzaktan alarm" },
  ],
  vrf: [
    { label: "Bağlantı", value: "64+ iç ünite", hint: "Uzun mesafe" },
    { label: "Recovery", value: "eşzamanlı", hint: "Isı geri kazanım" },
    { label: "Akustik", value: "48 dB(A)", hint: "Dış ünite" },
    { label: "Merkezi", value: "iTouch", hint: "Köprü katman" },
  ],
};

export const ECS_STEPS = [
  { id: 1 as const, shortLabel: "ÜRÜN" },
  { id: 2 as const, shortLabel: "MARKA" },
  { id: 3 as const, shortLabel: "KATEGORİ" },
  { id: 4 as const, shortLabel: "ÖN İZLEME" },
] as const;
