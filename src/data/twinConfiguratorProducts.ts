import type { TwinConfiguratorProduct } from "@/types";

/**
 * Standalone catalog for the Digital Twin page (11 items).
 * Do not confuse with `src/data/products.ts` (site-wide Vega catalog).
 */
export const TWIN_CONFIGURATOR_PRODUCTS: TwinConfiguratorProduct[] = [
  {
    id: "twin-1",
    brandKey: "DAİKİN",
    brandDisplay: "DAİKİN",
    name: "VRV 5 Çoklu-Split VRF Sistemi",
    imageUrl: "https://picsum.photos/seed/daikin-vrv/120/120",
    tags: [
      { id: "vrf", label: "VRF SİSTEMLERİ" },
      { id: "3d", label: "3D ODAK", emphasis: true },
    ],
    href: "#",
  },
  {
    id: "twin-2",
    brandKey: "OTHER",
    brandDisplay: "MITSUBISHI ELECTRIC",
    name: "City Multi R2 VRF Sistemi",
    imageUrl: "https://picsum.photos/seed/mitsubishi-vrf/120/120",
    tags: [{ id: "vrf", label: "VRF SİSTEMLERİ" }],
    href: "#",
  },
  {
    id: "twin-3",
    brandKey: "DAİKİN",
    brandDisplay: "DAİKİN",
    name: "Altherma 3 R Hava/Su Isı Pompası",
    imageUrl: "https://picsum.photos/seed/daikin-altherma/120/120",
    tags: [{ id: "hp", label: "ISI POMPASI" }],
    href: "#",
  },
  {
    id: "twin-4",
    brandKey: "OTHER",
    brandDisplay: "SAMSUNG",
    name: "EHS Mono Hava/Su Isı Pompası",
    imageUrl: "https://picsum.photos/seed/samsung-ehs/120/120",
    tags: [{ id: "hp", label: "ISI POMPASI" }],
    href: "#",
  },
  {
    id: "twin-5",
    brandKey: "BUDERUS",
    brandDisplay: "BUDERUS",
    name: "Logamax plus GB172i H Condens Kombi",
    imageUrl: "https://picsum.photos/seed/buderus-kombi/120/120",
    tags: [{ id: "kombi", label: "KOMBİ" }],
    href: "#",
  },
  {
    id: "twin-6",
    brandKey: "E.C.A",
    brandDisplay: "E.C.A",
    name: "Confeo Premix Tam Yoğuşmalı Kombi",
    imageUrl: "https://picsum.photos/seed/eca-kombi/120/120",
    tags: [{ id: "kombi", label: "KOMBİ" }],
    href: "#",
  },
  {
    id: "twin-7",
    brandKey: "LOWARA",
    brandDisplay: "LOWARA",
    name: "e-SH Tek Kademeli Santrifüj Pompa",
    imageUrl: "https://picsum.photos/seed/lowara-pump/120/120",
    tags: [{ id: "pompa", label: "SİRKÜLASYON" }],
    href: "#",
  },
  {
    id: "twin-8",
    brandKey: "KODSAN",
    brandDisplay: "KODSAN",
    name: "Buffer Tank 200 L Tampon Depo",
    imageUrl: "https://picsum.photos/seed/kodsan-tank/120/120",
    tags: [{ id: "tank", label: "TAM DEPOLAMA" }],
    href: "#",
  },
  {
    id: "twin-9",
    brandKey: "CALEFİ",
    brandDisplay: "CALEFİ",
    name: "Panel Radyatör Tip 22 Yüksek Verim",
    imageUrl: "https://picsum.photos/seed/calefi-rad/120/120",
    tags: [{ id: "rad", label: "RADYATÖR" }],
    href: "#",
  },
  {
    id: "twin-10",
    brandKey: "FRANKİSCHE",
    brandDisplay: "FRANKİSCHE",
    name: "Profitherm PE-Xa Yerden Isıtma Borusu",
    imageUrl: "https://picsum.photos/seed/frankische-pipe/120/120",
    tags: [{ id: "boru", label: "YAPı & BORU" }],
    href: "#",
  },
  {
    id: "twin-11",
    brandKey: "TYCO",
    brandDisplay: "TYCO",
    name: "Otomatik Yangın Vanası DN100",
    imageUrl: "https://picsum.photos/seed/tyco-valve/120/120",
    tags: [{ id: "yangin", label: "YANGIN GÜVENLİĞİ" }],
    href: "#",
  },
];

export const TWIN_CONFIGURATOR_TOTAL = TWIN_CONFIGURATOR_PRODUCTS.length;
