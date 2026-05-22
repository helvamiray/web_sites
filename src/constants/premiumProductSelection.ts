/**
 * Premium product selection flow — product type → brand → category.
 * Brand lists are curated per category (HVAC premium positioning).
 */

export type ProductTypeId = "klima" | "fancoil" | "isi-pompasi" | "kazan" | "vrf";

export interface ProductTypeOption {
  id: ProductTypeId;
  label: string;
  description: string;
}

export const PRODUCT_TYPES: ProductTypeOption[] = [
  { id: "klima", label: "Klima", description: "Konfor ve verimlilik odaklı iklimlendirme" },
  { id: "fancoil", label: "Fancoil", description: "Su serpantinli terminal üniteler" },
  {
    id: "isi-pompasi",
    label: "Isı Pompası",
    description: "Yenilenebilir enerji ile ısıtma-soğutma",
  },
  { id: "kazan", label: "Kazan", description: "Endüstriyel ve konut kazan sistemleri" },
  { id: "vrf", label: "VRF", description: "Değişken refrigerant debisi · çok bölgeli iklim kontrolü" },
];

/** Büyük ön izleme görseli — ön izleme adımında tam vitrin */
export const CONFIGURATOR_HERO_IMAGE: Record<ProductTypeId, { src: string; alt: string }> = {
  klima: { src: "/img/mitsubishi-wall.webp", alt: "Duvar tipi klima ünitesi detayı" },
  fancoil: { src: "/img/fancoil-cassette-hero.png", alt: "Kaset tipi fancoil ünite görünümü" },
  "isi-pompasi": { src: "/img/heat-pump.webp", alt: "Isı pompası dış ünite görünümü" },
  kazan: { src: "/img/urunler.webp", alt: "Endüstriyel kazan ve mekanik sistem vitrin görseli" },
  vrf: { src: "/img/daikin-vrf.webp", alt: "VRF / VRV dış ünite sistemi" },
};

/** Ürün tipi seçim kartları — küçük teknik / mühendislik görselleri (yatay şerit) */
export const CONFIGURATOR_TYPE_THUMB: Record<ProductTypeId, { src: string; alt: string }> = {
  klima: {
    src: "/img/configurator-type-klima.png",
    alt: "Klima — teknik kesit görünümü",
  },
  fancoil: {
    src: "/img/configurator-type-fancoil.png",
    alt: "Fancoil — teknik kesit görünümü",
  },
  "isi-pompasi": {
    src: "/img/configurator-type-isi-pompasi.png",
    alt: "Isı pompası — teknik kesit görünümü",
  },
  kazan: {
    src: "/img/configurator-type-kazan.png",
    alt: "Kazan — sistem şematik görünümü",
  },
  vrf: {
    src: "/img/configurator-type-vrf.png",
    alt: "VRF — teknik holografik görünüm",
  },
};

export interface ConfiguratorTechCard {
  title: string;
  value: string;
  detail: string;
}

/** Ön izleme adımında yüzen teknik kartlar */
export const CONFIGURATOR_TECH_CARDS: Record<ProductTypeId, ConfiguratorTechCard[]> = {
  klima: [
    { title: "Kapasite bandı", value: "2,5 — 28 kW", detail: "Residential · light commercial" },
    { title: "Seasonal COP", value: "A+++ · SCOP", detail: "Yoğuşmalı inverter mimari" },
    { title: "Akustik", value: "<19 dB(A)", detail: "Gece sessizlik profili" },
    { title: "Entegrasyon", value: "Wi‑Fi · BMS", detail: "BACnet / Modbus hazır arayüz" },
  ],
  fancoil: [
    { title: "Serpantin", value: "4‑ borulu · düşük ΔT", detail: "Chiller / HP uyumu" },
    { title: "EC motor", value: "%35 daha az enerji", detail: "Sürekli debi optimizasyonu" },
    { title: "Statik", value: "50 — 250 Pa", detail: "Kanal uzunluğuna göre seçim" },
    { title: "Kontrol", value: "0‑10 V · Modbus", detail: "Merkezi otomasyon uyumu" },
  ],
  "isi-pompasi": [
    { title: "Çalışma", value: "‑28 °C çıkış", detail: "Monoblok / split konfigürasyon" },
    { title: "Refrigerant", value: "R32 · düşük GWP", detail: "Regülasyon uyumlu devre" },
    { title: "COP / SCOP", value: "yüksek verim bandı", detail: "Part‑load optimizasyonu" },
    { title: "Tank / IO", value: "hidronik paketler", detail: "Akıllı pompa senaryosu" },
  ],
  kazan: [
    { title: "Yoğuşma", value: "%109'a kadar verim", detail: "Modülasyonlu brülör aralığı" },
    { title: "Kapasite", value: "konut · endüstri", detail: "Kaskad senaryoya hazır" },
    { title: "Emisyon", value: "NOx Class 6", detail: "Şehir gazı uyumu" },
    { title: "İzleme", value: "uzaktan alarm", detail: "SCADA entegrasyon opsiyonu" },
  ],
  vrf: [
    { title: "Bağlantı", value: "64+ iç ünite", detail: "Uzun boru mesafesi toleransı" },
    { title: "Heat recovery", value: "eşzamanlı I/S", detail: "Bölgesel bağımsız modlar" },
    { title: "Refrigerant", value: "R410A · R32", detail: "Proje bazlı sıvı seçimi" },
    { title: "Merkezi kontrol", value: "iTouch Manager", detail: "BMS köprü katmanı" },
  ],
};

/** Brands shown after product type is chosen */
export const BRANDS_BY_PRODUCT: Record<ProductTypeId, string[]> = {
  klima: [
    "Daikin",
    "Mitsubishi Electric",
    "LG",
    "Samsung HVAC",
    "Toshiba Carrier",
    "Fujitsu General",
  ],
  fancoil: ["Systemair", "FläktGroup", "Carrier", "Swegon", "Trox", "VTS"],
  "isi-pompasi": [
    "Daikin Altherma",
    "Viessmann",
    "Vaillant",
    "Bosch",
    "Mitsubishi Electric",
    "Atlantic",
  ],
  kazan: ["Viessmann", "Buderus", "Bosch Thermotechnik", "Ariston", "Vaillant", "EcoForest"],
  vrf: [
    "Daikin VRV",
    "Mitsubishi Electric City Multi",
    "LG Multi V",
    "Samsung DVM",
    "Toshiba SHRM",
  ],
};

/** Category grids per product type */
export const CATEGORIES_BY_PRODUCT: Record<ProductTypeId, string[]> = {
  klima: [
    "Merkezi Sistem",
    "Bireysel Sistem",
    "Duvar Tipi",
    "Tavan Tipi",
    "Kaset Tipi",
    "Kanal Tipi",
  ],
  fancoil: [
    "Kaset Fancoil",
    "Kanal Tipi",
    "Duvar Tipi",
    "Tavan Tipi",
    "Düşük Statik",
    "Yüksek Statik",
  ],
  "isi-pompasi": ["Monoblok", "Split", "Ticari", "Konut Tipi"],
  kazan: [
    "Yoğuşmalı",
    "Elektrik",
    "Katı Yakıt · Biomass",
    "Kaskad",
    "Endüstriyel Kapasite",
    "Hibrit",
  ],
  vrf: [
    "Multi VRF",
    "Mini VRF",
    "Heat Recovery",
    "Soğutma Odaklı",
    "Isı Pompalı VRF",
    "Hijyen Modülü",
  ],
};

export function getBrandsFor(productId: ProductTypeId): string[] {
  return BRANDS_BY_PRODUCT[productId] ?? [];
}

export function getCategoriesFor(productId: ProductTypeId): string[] {
  return CATEGORIES_BY_PRODUCT[productId] ?? [];
}

/** Vitrin konfiguratör marka şeridi — Cloudinary logolu marka adları. */
export const CONFIGURATOR_STUDIO_BRANDS = [
  "Daikin",
  "Wilo",
  "Honeywell",
  "DUCA",
  "Ecodense",
  "Kodsan",
  "Kayse",
  "E.C.A.",
] as const;

export type ConfiguratorStudioBrand = (typeof CONFIGURATOR_STUDIO_BRANDS)[number];

/** Marka kelime işareti görselleri (küçük vitrin; HTTPS Cloudinary). */
export const CONFIGURATOR_BRAND_LOGO_URLS = {
  Daikin:
    "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778328949/daikin_turkey_logo_q1jepz.jpg",
  Wilo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778328995/blog-wilo-logo_jyx8to.jpg",
  Honeywell:
    "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329204/Honeywell-Logo_gx6zcc.png",
  DUCA: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329200/DUCA_Credit_Union_logo.svg_oxiwwb.png",
  Ecodense:
    "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329008/ECODENSE_vektorel_logo_ukeftk.png",
  Kodsan: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329196/placeholder_o2zmkd.png",
  Kayse:
    "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329208/RutU20MpInEOHuQyUmMoco8HCH5RVDaBm2X4c6ZC_sc9ihu.jpg",
  "E.C.A.": "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329113/file_a1axb2.jpg",
} as const satisfies Record<ConfiguratorStudioBrand, string>;

export function getConfiguratorBrandLogoUrl(brand: string): string | null {
  const key = brand.trim() as keyof typeof CONFIGURATOR_BRAND_LOGO_URLS;
  return CONFIGURATOR_BRAND_LOGO_URLS[key] ?? null;
}

/**
 * Marka seçiminden sonra görünen alt kategori chipleri.
 * Bilinmeyen marka için "*" yedek listesi kullanılır.
 */
export const SUBCATEGORIES_BY_PRODUCT_BRAND: Record<ProductTypeId, Record<string, string[]>> = {
  klima: {
    Daikin: ["Split Klima", "Kaset Tipi", "Multi Split", "Tavan Tipi", "Kanal Tipi"],
    Wilo: ["Split Klima", "Kanal Tipi"],
    Honeywell: ["Split Klima", "Kaset Tipi", "Kanal Tipi"],
    DUCA: ["Split Klima", "Kaset Tipi", "Multi Split", "Kanal Tipi"],
    Ecodense: ["Tavan Tipi", "Kanal Tipi", "Kaset Tipi"],
    Kodsan: ["Split Klima", "Kaset Tipi", "Multi Split"],
    Kayse: ["Split Klima", "Multi Split", "Tavan Tipi"],
    "E.C.A.": ["Split Klima", "Kanal Tipi"],
    "*": ["Split Klima", "Kaset Tipi", "Multi Split", "Tavan Tipi"],
  },
  fancoil: {
    Daikin: ["Kaset Fancoil", "Kanal Tipi", "Tavan Tipi", "Duvar Tipi"],
    Wilo: ["Kanal Tipi"],
    Honeywell: ["Kanal Tipi", "Kaset Fancoil"],
    DUCA: ["Kaset Fancoil", "Kanal Tipi", "Tavan Tipi", "Duvar Tipi"],
    Ecodense: ["Kanal Tipi", "Kaset Fancoil"],
    Kodsan: ["Kaset Fancoil", "Kanal Tipi"],
    Kayse: ["Kanal Tipi", "Kaset Fancoil", "Düşük Statik"],
    "E.C.A.": ["Kanal Tipi", "Duvar Tipi"],
    "*": ["Kaset Tipi", "Kanal Tipi", "Duvar Tipi", "Tavan Tipi"],
  },
  "isi-pompasi": {
    Daikin: ["Monoblok", "Split", "Hybrid", "Ticari"],
    Wilo: ["Hidronik paket"],
    Honeywell: ["Monoblok", "Split", "Hybrid"],
    DUCA: ["Monoblok", "Split", "Hybrid"],
    Ecodense: ["Monoblok", "Split", "Hibrit"],
    Kodsan: ["Monoblok", "Split"],
    Kayse: ["Monoblok", "Split"],
    "E.C.A.": ["Monoblok", "Split"],
    "*": ["Monoblok", "Split", "Ticari"],
  },
  kazan: {
    Daikin: ["Yoğuşmalı Duvar", "Kaskad", "Konut paketi"],
    Wilo: ["Sirkülasyon destek"],
    Honeywell: ["Yoğuşmalı Duvar"],
    DUCA: ["Yoğuşmalı Duvar", "Konut paketi"],
    Ecodense: ["Yoğuşmalı", "Elektrik", "Kaskad"],
    Kodsan: ["Yoğuşmalı"],
    Kayse: ["Yoğuşmalı Duvar"],
    "E.C.A.": ["Yoğuşmalı", "Kaskad"],
    "*": ["Yoğuşmalı", "Elektrik", "Kaskad"],
  },
  vrf: {
    Daikin: ["Heat Recovery", "Soğutma odaklı", "Multi bağlantılı"],
    Wilo: ["Hidronik taraf"],
    Honeywell: ["Multi bağlantılı", "Heat Recovery"],
    DUCA: ["Heat Recovery", "Multi bağlantılı"],
    Ecodense: ["Merkezi istasyon"],
    Kodsan: ["Multi bağlantılı", "Heat Recovery"],
    Kayse: ["Heat Recovery", "Mini VRF"],
    "E.C.A.": ["Multi bağlantılı"],
    "*": ["Multi VRF", "Heat Recovery", "Mini VRF"],
  },
};

export function getSubcategoriesForBrand(
  productId: ProductTypeId,
  brand: string,
): string[] {
  const table = SUBCATEGORIES_BY_PRODUCT_BRAND[productId];
  const list = table[brand.trim()] ?? table["*"];
  return list ?? [];
}

/**
 * Kombinasyon → katalog `Product.id`. Marka için özel SKU yoksa `*` ile yedeklenir.
 */
const REPRESENTATIVE_PRODUCT_ID: Record<
  ProductTypeId,
  Partial<Record<string | "*", string>>
> = {
  klima: {
    Daikin: "p-ac-residential",
    Wilo: "p-ac-residential",
    Honeywell: "p-ac-residential",
    DUCA: "p-ac-residential",
    Ecodense: "p-ac-residential",
    Kodsan: "p-ac-residential",
    Kayse: "p-ac-residential",
    "E.C.A.": "p-ac-residential",
    "*": "p-ac-residential",
  },
  vrf: {
    Daikin: "p-ac-daikin",
    Wilo: "p-ac-daikin",
    Honeywell: "p-ac-daikin",
    DUCA: "p-ac-daikin",
    Ecodense: "p-ac-daikin",
    Kodsan: "p-ac-daikin",
    Kayse: "p-ac-daikin",
    "E.C.A.": "p-ac-daikin",
    "*": "p-ac-daikin",
  },
  "isi-pompasi": {
    Daikin: "p-heatpump-daikin",
    Wilo: "p-pump-wilo",
    Honeywell: "p-heatpump-daikin",
    DUCA: "p-heatpump-daikin",
    Ecodense: "p-heatpump-daikin",
    Kodsan: "p-heatpump-daikin",
    Kayse: "p-heatpump-daikin",
    "E.C.A.": "p-heatpump-daikin",
    "*": "p-heatpump-daikin",
  },
  kazan: {
    Daikin: "p-boiler-buderus",
    Wilo: "p-pump-wilo",
    Honeywell: "p-boiler-buderus",
    DUCA: "p-boiler-buderus",
    Ecodense: "p-boiler-buderus",
    Kodsan: "p-boiler-buderus",
    Kayse: "p-boiler-buderus",
    "E.C.A.": "p-boiler-buderus",
    "*": "p-boiler-buderus",
  },
  fancoil: {
    Daikin: "p-ac-residential",
    Wilo: "p-pump-wilo",
    Honeywell: "p-ac-residential",
    DUCA: "p-ac-residential",
    Ecodense: "p-ac-residential",
    Kodsan: "p-ac-residential",
    Kayse: "p-ac-residential",
    "E.C.A.": "p-ac-residential",
    "*": "p-ac-residential",
  },
};

export function getConfiguratorRepresentativeProductId(
  productTypeId: ProductTypeId,
  brand: string,
): string {
  const b = brand.trim();
  const byType = REPRESENTATIVE_PRODUCT_ID[productTypeId];
  const id = byType[b] ?? byType["*"];
  return id ?? "p-ac-residential";
}


/** Dinamik filtre adımı — ürün tipine göre önerilen ince ayarlar (UI katmanı) */
export const SMART_REFINEMENTS_BY_PRODUCT: Record<ProductTypeId, string[]> = {
  klima: ["A+++ sınıfı", "Inverter", "Wi‑Fi kontrol", "Sessiz mod", "Hijyen filtresi"],
  fancoil: ["EC motor", "Düşük enerji", "Kaset / kanal uyumu", "Kondens kontrolü"],
  "isi-pompasi": ["R32 sıvı", "Monoblok kolay montaj", "-25 °C performans", "Akıllı enerji"],
  kazan: ["Yoğuşmalı verim", "Modülasyon", "Kaskad senaryo", "Uzaktan izleme"],
  vrf: ["Heat recovery", "Zoning esnekliği", "Merkezi BMS", "Düşük GWP refrigerant"],
};
