import { useSyncExternalStore } from "react";

import type { CinematicShowcaseSlideDef } from "@/constants/cinematicShowcaseHeroSlides";
import {
  MANIFESTO_SERVER_SNAPSHOT_EN,
  MANIFESTO_SERVER_SNAPSHOT_TR,
  getMergedManifestoCopyStable,
  type ManifestoResolvedCopy,
} from "@/lib/aboutManifestoCmsMerge";
import {
  type PartnerSectionCopy,
  CINEMATIC_HERO_SERVER_SNAPSHOT,
  CONFIGURATOR_BRANDS_SERVER_SNAPSHOT,
  CONFIGURATOR_TITLES_SERVER_SNAPSHOT,
  PARTNER_SECTION_SERVER_SNAPSHOT,
  getConfiguratorCmsTitlesStable,
  getConfiguratorStudioBrandsMergedStable,
  getMergedCinematicHeroSlidesStable,
  getPartnerSectionMergedStable,
} from "@/lib/cmsRuntime";
import { subscribeVegaCms } from "@/lib/vegaCmsStore";

const heroServerSnapshot = (): readonly CinematicShowcaseSlideDef[] => CINEMATIC_HERO_SERVER_SNAPSHOT;

export function useSyncedCinematicHeroSlides(): readonly CinematicShowcaseSlideDef[] {
  return useSyncExternalStore(
    subscribeVegaCms,
    getMergedCinematicHeroSlidesStable,
    heroServerSnapshot,
  );
}

const partnersServerSnap = (): PartnerSectionCopy => PARTNER_SECTION_SERVER_SNAPSHOT;

export function useSyncedPartnerSection(): PartnerSectionCopy {
  return useSyncExternalStore(
    subscribeVegaCms,
    getPartnerSectionMergedStable,
    partnersServerSnap,
  );
}

export function useSyncedConfiguratorTitles() {
  return useSyncExternalStore(
    subscribeVegaCms,
    getConfiguratorCmsTitlesStable,
    () => CONFIGURATOR_TITLES_SERVER_SNAPSHOT,
  );
}

export function useSyncedManifestoCopy(isTr: boolean): ManifestoResolvedCopy {
  return useSyncExternalStore(
    subscribeVegaCms,
    (): ManifestoResolvedCopy => getMergedManifestoCopyStable(isTr),
    (): ManifestoResolvedCopy => (isTr ? MANIFESTO_SERVER_SNAPSHOT_TR : MANIFESTO_SERVER_SNAPSHOT_EN),
  );
}

export function useConfiguratorStudioBrandsMerged(): readonly string[] {
  return useSyncExternalStore(
    subscribeVegaCms,
    getConfiguratorStudioBrandsMergedStable,
    () => CONFIGURATOR_BRANDS_SERVER_SNAPSHOT,
  );
}
