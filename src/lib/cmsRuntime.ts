import {
  CINEMATIC_SHOWCASE_HERO_SLIDES,
  type CinematicShowcaseSlideDef,
} from "@/constants/cinematicShowcaseHeroSlides";
import {
  CONFIGURATOR_STUDIO_BRANDS,
  getSubcategoriesForBrand,
  type ProductTypeId,
} from "@/constants/premiumProductSelection";
import type { StrategicPartnerLogo } from "@/data/strategicPartnerLogos";
import { STRATEGIC_PARTNER_LOGOS } from "@/data/strategicPartnerLogos";
import { readVegaCms, type VegaCmsState, VEGA_CMS_INITIAL_STATE } from "@/lib/vegaCmsStore";

function hudMerge(
  base: CinematicShowcaseSlideDef["hudTelemetry"],
  patch?: CinematicShowcaseSlideDef["hudTelemetry"],
): CinematicShowcaseSlideDef["hudTelemetry"] {
  return patch ?? base;
}

function computeMergedCinematicHeroSlides(cms: VegaCmsState): readonly CinematicShowcaseSlideDef[] {
  return CINEMATIC_SHOWCASE_HERO_SLIDES.map((slide): CinematicShowcaseSlideDef => {
    const p = cms.heroSlidePatches[slide.id];
    if (!p) return slide;
    const mergedHud = hudMerge(slide.hudTelemetry, p.hudTelemetry);

    const next: CinematicShowcaseSlideDef = {
      ...slide,
      ...p,
      hudTelemetry: mergedHud,
    };
    next.id = slide.id;
    return next;
  });
}

/** `useSyncExternalStore`: patch değişmediyse aynı dizi referansı gerekli. */
let mergedHeroPatchesKey = "";
let mergedHeroCache: readonly CinematicShowcaseSlideDef[] | null = null;

export function getMergedCinematicHeroSlidesStable(): readonly CinematicShowcaseSlideDef[] {
  const cms = readVegaCms();
  const key = JSON.stringify(cms.heroSlidePatches);
  if (mergedHeroCache && key === mergedHeroPatchesKey) return mergedHeroCache;
  mergedHeroPatchesKey = key;
  mergedHeroCache = computeMergedCinematicHeroSlides(cms);
  return mergedHeroCache;
}

export const CINEMATIC_HERO_SERVER_SNAPSHOT: readonly CinematicShowcaseSlideDef[] = Object.freeze([
  ...computeMergedCinematicHeroSlides(VEGA_CMS_INITIAL_STATE),
]);

export function getMergedCinematicHeroSlides(): CinematicShowcaseSlideDef[] {
  return [...getMergedCinematicHeroSlidesStable()];
}

const subcategoryKey = (productId: ProductTypeId, brand: string) =>
  `${productId}::${brand.trim().toLowerCase()}`;

export function getMergedSubcategoriesForBrand(
  productId: ProductTypeId,
  brand: string,
): string[] {
  const cms = readVegaCms();
  const k = subcategoryKey(productId, brand);
  const alt = cms.subcategoryOverrides[k];
  if (alt?.length) return alt;
  const anyBrand = cms.subcategoryOverrides[`${productId}::*`];
  if (anyBrand?.length) return anyBrand;
  return getSubcategoriesForBrand(productId, brand);
}

let configuratorBrandsKey = "";
let configuratorBrandsCache: readonly string[] | null = null;

function computeConfiguratorStudioBrandsMerged(cms: VegaCmsState): readonly string[] {
  const extra = cms.configurator.extraStudioBrands ?? [];
  const seen = new Set<string>(CONFIGURATOR_STUDIO_BRANDS.map((b) => b));
  const out = [...CONFIGURATOR_STUDIO_BRANDS];
  for (const raw of extra) {
    const t = raw.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

export function getConfiguratorStudioBrandsMergedStable(): readonly string[] {
  const cms = readVegaCms();
  const key = JSON.stringify(cms.configurator.extraStudioBrands ?? []);
  if (configuratorBrandsCache && key === configuratorBrandsKey) return configuratorBrandsCache;
  configuratorBrandsKey = key;
  configuratorBrandsCache = computeConfiguratorStudioBrandsMerged(cms);
  return configuratorBrandsCache;
}

export const CONFIGURATOR_BRANDS_SERVER_SNAPSHOT: readonly string[] = Object.freeze([
  ...computeConfiguratorStudioBrandsMerged(VEGA_CMS_INITIAL_STATE),
]);

export function getConfiguratorStudioBrandsMerged(): readonly string[] {
  return [...getConfiguratorStudioBrandsMergedStable()];
}

export interface PartnerSectionCopy {
  titlePrimaryTr: string;
  titleAccentTr: string;
  titlePrimaryEn: string;
  titleAccentEn: string;
  sectionSubTr: string;
  sectionSubEn: string;
  logos: readonly StrategicPartnerLogo[];
}

let partnerKey = "";
let partnerCache: PartnerSectionCopy | null = null;

function computePartnerSectionMerged(cms: VegaCmsState): PartnerSectionCopy {
  const logos: readonly StrategicPartnerLogo[] = cms.partners.useCustomLogos
    ? cms.partners.customLogos
    : STRATEGIC_PARTNER_LOGOS;
  return {
    titlePrimaryTr: cms.partners.sectionTitlePrimaryTr ?? "Stratejik Çözüm",
    titleAccentTr: cms.partners.sectionTitleAccentTr ?? "Ortakları",
    titlePrimaryEn: cms.partners.sectionTitlePrimaryEn ?? "Strategic",
    titleAccentEn: cms.partners.sectionTitleAccentEn ?? "Partners",
    sectionSubTr: cms.partners.sectionSubTr ?? "Global mühendislik ekosistemi",
    sectionSubEn:
      cms.partners.sectionSubEn ?? "Global engineering ecosystem",
    logos,
  };
}

export function getPartnerSectionMergedStable(): PartnerSectionCopy {
  const cms = readVegaCms();
  const key = JSON.stringify(cms.partners);
  if (partnerCache && key === partnerKey) return partnerCache;
  partnerKey = key;
  partnerCache = computePartnerSectionMerged(cms);
  return partnerCache;
}

const partnerMergedForServer = computePartnerSectionMerged(VEGA_CMS_INITIAL_STATE);

export const PARTNER_SECTION_SERVER_SNAPSHOT: PartnerSectionCopy = Object.freeze({
  ...partnerMergedForServer,
}) as PartnerSectionCopy;

export function getPartnerSectionMerged(): PartnerSectionCopy {
  const s = getPartnerSectionMergedStable();
  return { ...s, logos: s.logos };
}

export interface ConfiguratorTitles {
  titleTr?: string;
  titleEn?: string;
  visible: boolean;
}

let configuratorTitlesKey = "";
let configuratorTitlesCache: ConfiguratorTitles | null = null;

export function getConfiguratorCmsTitlesStable(): ConfiguratorTitles {
  const c = readVegaCms().configurator;
  const key = JSON.stringify([c.sectionTitleTr ?? null, c.sectionTitleEn ?? null, c.sectionVisible]);
  if (configuratorTitlesCache && key === configuratorTitlesKey) return configuratorTitlesCache;
  configuratorTitlesKey = key;
  configuratorTitlesCache = {
    titleTr: c.sectionTitleTr,
    titleEn: c.sectionTitleEn,
    visible: c.sectionVisible,
  };
  return configuratorTitlesCache;
}

export const CONFIGURATOR_TITLES_SERVER_SNAPSHOT: ConfiguratorTitles = Object.freeze({
  titleTr: undefined,
  titleEn: undefined,
  visible: VEGA_CMS_INITIAL_STATE.configurator.sectionVisible,
}) as ConfiguratorTitles;

export function getConfiguratorCmsTitles(): ConfiguratorTitles {
  return { ...getConfiguratorCmsTitlesStable() };
}
