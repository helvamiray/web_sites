import type { VegaCmsAboutCopy } from "@/lib/vegaCmsStore";
import { readVegaCms } from "@/lib/vegaCmsStore";

export interface ManifestoResolvedCopy {
  aboutTitle: string;
  aboutLead: string;
  aboutBody: string;
  missionTitle: string;
  missionLead: string;
  missionClose: string;
  visionTitle: string;
  visionLead: string;
  visionTag: string;
}

const BASE_TR = {
  aboutTitle: "Biz kimiz",
  aboutLead:
    "Konfor, enerji ve güvenliği aynı teknik düzlemde kurgulayan bir mühendislik stüdyosuyuz. Parametrik seçim, sahada ölçülebilir performans ve uzun ömürlü sistem mimarisi.",
  aboutBody:
    "VRF omurgasından yangın hidroliğine kadar her vitrin, doğrulanmış ürün verisi ve disiplinli montaj senaryolarıyla desteklenir.",
  missionTitle: "Misyon",
  missionLead:
    "Her projede düşük gürültü, yüksek verim ve net enerji muhasebesi sunmak; müşteriyle aynı teknik dili konuşarak kararları hızlandırmak.",
  missionClose: "Saha gerçekliği — kağıt iddiası değil, ölçülebilir teslim.",
  visionTitle: "Vizyon",
  visionLead:
    "Türkiye’nin en güvenilir bölgesel iklim mühendisliği referansı olmak; ısı pompası ve düşük karbon omurgasında ölçeklenebilir dijital ikiz katmanları eklemek.",
  visionTag: "2030 · karbon-disiplinli hedef ekseni",
} as const;

const BASE_EN = {
  aboutTitle: "Who we are",
  aboutLead:
    "We are an engineering studio that composes comfort, energy, and safety on a single technical plane—parametric selection, measurable field performance, and durable system architecture.",
  aboutBody:
    "From VRF backbones to fire hydraulics, every showcase is backed by validated product data and disciplined installation scenarios.",
  missionTitle: "Mission",
  missionLead:
    "Deliver low-noise, high-efficiency systems with clear energy accounting—speaking the same technical language as clients to accelerate decisions.",
  missionClose: "Field truth — measurable delivery, not paper claims.",
  visionTitle: "Vision",
  visionLead:
    "Become Turkey’s most trusted regional climate-engineering reference—scaling low-carbon and heat-pump backbones with additive digital-twin layers.",
  visionTag: "2030 · carbon-disciplined target axis",
} as const;

export function mergeAboutManifestoCopy(
  patch: VegaCmsAboutCopy | undefined,
  isTr: boolean,
): ManifestoResolvedCopy {
  const base = isTr ? BASE_TR : BASE_EN;
  const cms = patch ?? {};

  const pickTr = (): ManifestoResolvedCopy => ({
    aboutTitle: cms.aboutTitleTr ?? base.aboutTitle,
    aboutLead: cms.aboutLeadTr ?? base.aboutLead,
    aboutBody: cms.aboutBodyTr ?? base.aboutBody,
    missionTitle: cms.missionTitleTr ?? base.missionTitle,
    missionLead: cms.missionLeadTr ?? base.missionLead,
    missionClose: cms.missionCloseTr ?? base.missionClose,
    visionTitle: cms.visionTitleTr ?? base.visionTitle,
    visionLead: cms.visionLeadTr ?? base.visionLead,
    visionTag: cms.visionTagTr ?? base.visionTag,
  });

  const pickEn = (): ManifestoResolvedCopy => ({
    aboutTitle: cms.aboutTitleEn ?? base.aboutTitle,
    aboutLead: cms.aboutLeadEn ?? base.aboutLead,
    aboutBody: cms.aboutBodyEn ?? base.aboutBody,
    missionTitle: cms.missionTitleEn ?? base.missionTitle,
    missionLead: cms.missionLeadEn ?? base.missionLead,
    missionClose: cms.missionCloseEn ?? base.missionClose,
    visionTitle: cms.visionTitleEn ?? base.visionTitle,
    visionLead: cms.visionLeadEn ?? base.visionLead,
    visionTag: cms.visionTagEn ?? base.visionTag,
  });

  return isTr ? pickTr() : pickEn();
}

let cachedAboutSnapshotKey = "";
let manifestoStableTr: ManifestoResolvedCopy | null = null;
let manifestoStableEn: ManifestoResolvedCopy | null = null;

/** `useSyncExternalStore` — `about` değişmediyse aynı nesne referansı. */
export function getMergedManifestoCopyStable(isTr: boolean): ManifestoResolvedCopy {
  const about = readVegaCms().about;
  const key = JSON.stringify(about);
  if (key !== cachedAboutSnapshotKey) {
    cachedAboutSnapshotKey = key;
    manifestoStableTr = mergeAboutManifestoCopy(about, true);
    manifestoStableEn = mergeAboutManifestoCopy(about, false);
  }
  return isTr ? manifestoStableTr! : manifestoStableEn!;
}

export const MANIFESTO_SERVER_SNAPSHOT_TR: ManifestoResolvedCopy = Object.freeze(
  mergeAboutManifestoCopy(undefined, true),
);
export const MANIFESTO_SERVER_SNAPSHOT_EN: ManifestoResolvedCopy = Object.freeze(
  mergeAboutManifestoCopy(undefined, false),
);
