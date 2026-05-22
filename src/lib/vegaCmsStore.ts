import type { CinematicShowcaseSlideDef } from "@/constants/cinematicShowcaseHeroSlides";
import type { ProductTypeId } from "@/constants/premiumProductSelection";
import type { StrategicPartnerLogo } from "@/data/strategicPartnerLogos";

/** Birleşik CMS — ana sayfa + vitrin bağlamı için yerel depolama katmanı. */
export const VEGA_CMS_STORAGE_KEY = "vega_cms_state";
export const VEGA_CMS_UPDATED_EVENT = "vega-cms-updated";

export type HeroSlidePatch = Partial<Omit<CinematicShowcaseSlideDef, "id">>;

export interface VegaCmsMediaItem {
  id: string;
  label: string;
  /** data URL veya `/public` yolu */
  url: string;
  category: "product-render" | "logo" | "homepage" | "other";
  createdAt: string;
}

/** Hakkımızda metinleri — boş olanlar bileşende varsayılan metne düşer. */
export interface VegaCmsAboutCopy {
  aboutTitleTr?: string;
  aboutTitleEn?: string;
  aboutLeadTr?: string;
  aboutLeadEn?: string;
  aboutBodyTr?: string;
  aboutBodyEn?: string;
  missionTitleTr?: string;
  missionTitleEn?: string;
  missionLeadTr?: string;
  missionLeadEn?: string;
  missionCloseTr?: string;
  missionCloseEn?: string;
  visionTitleTr?: string;
  visionTitleEn?: string;
  visionLeadTr?: string;
  visionLeadEn?: string;
  visionTagTr?: string;
  visionTagEn?: string;
}

export interface VegaCmsState {
  version: 1;
  /** `slideId` → kısmi alanlar */
  heroSlidePatches: Record<string, HeroSlidePatch>;
  about: VegaCmsAboutCopy;
  /** `useCustomLogos` true ise `customLogos` vitrinde kullanılır */
  partners: {
    useCustomLogos: boolean;
    sectionTitlePrimaryTr?: string;
    sectionTitleAccentTr?: string;
    sectionTitlePrimaryEn?: string;
    sectionTitleAccentEn?: string;
    sectionSubTr?: string;
    sectionSubEn?: string;
    customLogos: StrategicPartnerLogo[];
  };
  /** Konfiguratör vitrin markaları + başlık */
  configurator: {
    extraStudioBrands: string[];
    sectionTitleTr?: string;
    sectionTitleEn?: string;
    sectionVisible: boolean;
  };
  /** `productTypeId::brand` → tam alt kategori listesi (override) */
  subcategoryOverrides: Record<string, string[]>;
  /** Ürün tipine göre ek marka adları (liste birleştirmesi) */
  brandPoolExtras: Partial<Record<ProductTypeId, string[]>>;
  mediaLibrary: VegaCmsMediaItem[];
}

/** Varsayılan CMS — SSR sabitleri ve birleştirme için tek kaynak. */
export const VEGA_CMS_INITIAL_STATE: VegaCmsState = {
  version: 1,
  heroSlidePatches: {},
  about: {},
  partners: {
    useCustomLogos: false,
    customLogos: [],
  },
  configurator: {
    extraStudioBrands: [],
    sectionVisible: true,
  },
  subcategoryOverrides: {},
  brandPoolExtras: {},
  mediaLibrary: [],
};

const isBrowser = () => typeof window !== "undefined";

function cloneDefault(): VegaCmsState {
  return JSON.parse(JSON.stringify(VEGA_CMS_INITIAL_STATE)) as VegaCmsState;
}

function coerceState(raw: unknown): VegaCmsState {
  if (!raw || typeof raw !== "object") return cloneDefault();
  const o = raw as Partial<VegaCmsState>;
  if (o.version !== 1) return cloneDefault();
  return {
    ...VEGA_CMS_INITIAL_STATE,
    ...o,
    heroSlidePatches:
      typeof o.heroSlidePatches === "object" && o.heroSlidePatches != null
        ? (o.heroSlidePatches as Record<string, HeroSlidePatch>)
        : {},
    about:
      typeof o.about === "object" && o.about != null ? { ...VEGA_CMS_INITIAL_STATE.about, ...o.about } : {},
    partners:
      typeof o.partners === "object" && o.partners != null
        ? {
            ...VEGA_CMS_INITIAL_STATE.partners,
            ...o.partners,
            customLogos: Array.isArray(o.partners.customLogos)
              ? (o.partners.customLogos as StrategicPartnerLogo[])
              : [],
          }
        : { ...VEGA_CMS_INITIAL_STATE.partners },
    configurator:
      typeof o.configurator === "object" && o.configurator != null
        ? {
            ...VEGA_CMS_INITIAL_STATE.configurator,
            ...o.configurator,
            extraStudioBrands: Array.isArray(o.configurator.extraStudioBrands)
              ? o.configurator.extraStudioBrands.filter((x): x is string => typeof x === "string")
              : [],
          }
        : { ...VEGA_CMS_INITIAL_STATE.configurator },
    subcategoryOverrides:
      typeof o.subcategoryOverrides === "object" && o.subcategoryOverrides != null
        ? { ...o.subcategoryOverrides }
        : {},
    brandPoolExtras:
      typeof o.brandPoolExtras === "object" && o.brandPoolExtras != null
        ? { ...o.brandPoolExtras }
        : {},
    mediaLibrary:
      typeof o.mediaLibrary === "object" && Array.isArray(o.mediaLibrary)
        ? (o.mediaLibrary.filter(
            (m): m is VegaCmsMediaItem =>
              Boolean(m && typeof m === "object" && typeof (m as VegaCmsMediaItem).url === "string"),
          ) as VegaCmsMediaItem[])
        : [],
  };
}

export function readVegaCms(): VegaCmsState {
  if (!isBrowser()) return cloneDefault();
  try {
    const raw = window.localStorage.getItem(VEGA_CMS_STORAGE_KEY);
    if (!raw) return cloneDefault();
    return coerceState(JSON.parse(raw) as unknown);
  } catch {
    return cloneDefault();
  }
}

export function writeVegaCms(next: VegaCmsState): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(VEGA_CMS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(VEGA_CMS_UPDATED_EVENT));
}

export function subscribeVegaCms(onStoreChange: () => void): () => void {
  if (!isBrowser()) return () => {};
  const fn = (): void => onStoreChange();
  window.addEventListener(VEGA_CMS_UPDATED_EVENT, fn);
  return (): void => {
    window.removeEventListener(VEGA_CMS_UPDATED_EVENT, fn);
  };
}
