import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  STRATEGIC_PARTNER_LOGOS,
  type StrategicPartnerLogo,
} from "@/data/strategicPartnerLogos";
import type { VegaCmsState } from "@/lib/vegaCmsStore";
import {
  readVegaCms,
  subscribeVegaCms,
  writeVegaCms,
  type HeroSlidePatch,
} from "@/lib/vegaCmsStore";
import { CINEMATIC_SHOWCASE_HERO_SLIDES } from "@/constants/cinematicShowcaseHeroSlides";

export const Route = createFileRoute("/admin/homepage")({
  component: HomepageCmsRoute,
});

type TabKey = "hero" | "about" | "partners" | "configurator";

function HomepageCmsRoute() {
  const [tab, setTab] = useState<TabKey>("hero");
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeVegaCms(() => setTick((n) => n + 1)), []);
  void tick;

  const cms = readVegaCms();

  const slideIds = useMemo(() => CINEMATIC_SHOWCASE_HERO_SLIDES.map((s) => s.id), []);
  const [slideId, setSlideId] = useState(slideIds[0] ?? "klima");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "hero", label: "Hero vitrin" },
    { key: "about", label: "Hakkımızda" },
    { key: "partners", label: "Ortak logoları" },
    { key: "configurator", label: "Konfiguratör cephesi" },
  ];

  const patchHero = (partial: HeroSlidePatch) => {
    const prev = readVegaCms();
    writeVegaCms({
      ...prev,
      heroSlidePatches: {
        ...prev.heroSlidePatches,
        [slideId]: { ...(prev.heroSlidePatches[slideId] ?? {}), ...partial },
      },
    });
    setTick((n) => n + 1);
  };

  const patchAboutField = (
    field: keyof NonNullable<VegaCmsState["about"]>,
    value: string,
  ): void => {
    const prev = readVegaCms();
    writeVegaCms({
      ...prev,
      about: { ...prev.about, [field]: value },
    });
    setTick((n) => n + 1);
  };

  const persistPartnersJson = (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as unknown;
      const arr =
        parsed && typeof parsed === "object" && Array.isArray(parsed)
          ? parsed.filter(Boolean)
          : [];
      const cleaned = arr.map((entry) => {
        const obj = entry as Partial<StrategicPartnerLogo>;
        return {
          id: String(obj.id ?? "logo"),
          label: String(obj.label ?? ""),
          src: String(obj.src ?? ""),
        };
      }) as StrategicPartnerLogo[];
      const prev = readVegaCms();
      writeVegaCms({ ...prev, partners: { ...prev.partners, customLogos: cleaned } });
      setTick((n) => n + 1);
    } catch {
      alert("Partner JSON doğrulanamadı.");
    }
  };

  const patchPartners = (
    setter: Partial<Pick<VegaCmsState["partners"], keyof VegaCmsState["partners"]>>,
  ): void => {
    const prev = readVegaCms();
    writeVegaCms({
      ...prev,
      partners: { ...prev.partners, ...setter },
    });
    setTick((n) => n + 1);
  };

  const patchConfigurator = (
    setter: Partial<Pick<VegaCmsState["configurator"], keyof VegaCmsState["configurator"]>>,
  ): void => {
    const prev = readVegaCms();
    writeVegaCms({ ...prev, configurator: { ...prev.configurator, ...setter } });
    setTick((n) => n + 1);
  };

  const currentPatch = cms.heroSlidePatches[slideId] ?? {};

  return (
    <div className="p-8 lg:p-12 space-y-8 font-[family-name:var(--font-sans)]">
      <nav className="flex flex-wrap gap-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.22em] ${
                tab === key
                  ? "bg-gradient-to-br from-[oklch(0.66_0.16_205)] to-[oklch(0.58_0.14_250)] text-black font-semibold"
                  : "border border-white/15 text-white/55 hover:text-white/88"
              }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "hero" ? (
        <div className="admin-premium-glass-panel space-y-5 rounded-2xl p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 md:col-span-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                Aktif vitrin sırası
              </span>
              <select
                className="w-full rounded-xl border border-white/12 bg-black/35 px-3 py-2 text-sm text-white"
                value={slideId}
                onChange={(e) => setSlideId(e.target.value)}
              >
                {slideIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <HeroTextRow
            label="Başlık (TR)"
            value={currentPatch.titleTr ?? ""}
            onCommit={(value) => patchHero({ titleTr: value })}
          />
          <HeroTextRow
            label="Başlık (EN)"
            value={currentPatch.titleEn ?? ""}
            onCommit={(value) => patchHero({ titleEn: value })}
          />
          <HeroTextRow
            label="Headline ana (TR)"
            value={currentPatch.headlinePrimaryTr ?? ""}
            onCommit={(value) => patchHero({ headlinePrimaryTr: value })}
          />
          <HeroTextRow
            label="Headline aksan (TR)"
            value={currentPatch.headlineAccentTr ?? ""}
            onCommit={(value) => patchHero({ headlineAccentTr: value })}
          />
          <HeroTextRow
            label="Subtitle (TR)"
            value={currentPatch.subtitleTr ?? ""}
            onCommit={(value) => patchHero({ subtitleTr: value })}
          />
          <HeroTextRow
            label="Açıklama (TR)"
            value={currentPatch.descriptionTr ?? ""}
            multiline
            onCommit={(value) => patchHero({ descriptionTr: value })}
          />
          <HeroTextRow
            label="Görsel URL"
            value={currentPatch.showcaseImageSrc ?? ""}
            onCommit={(value) => patchHero({ showcaseImageSrc: value })}
          />
        </div>
      ) : null}

      {tab === "about" ? (
        <div className="admin-premium-glass-panel rounded-2xl space-y-4 p-8">
          {(
            [
              ["aboutTitleTr", "Başlık TR"],
              ["aboutTitleEn", "Başlık EN"],
              ["aboutLeadTr", "Lead TR"],
              ["aboutLeadEn", "Lead EN"],
              ["missionTitleTr", "Misyon başlığı TR"],
              ["visionLeadTr", "Vizyon metni TR"],
            ] as const
          ).map(([field, label]) => (
            <HeroTextRow
              key={field}
              label={label}
              value={cms.about[field] ?? ""}
              multiline
              onCommit={(value) => patchAboutField(field, value)}
            />
          ))}
        </div>
      ) : null}

      {tab === "partners" ? (
        <div className="admin-premium-glass-panel rounded-2xl space-y-4 p-8">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={cms.partners.useCustomLogos}
              onChange={(e) => patchPartners({ useCustomLogos: e.target.checked })}
            />
            <span>Özel logo listesi vitrinde çalışsın</span>
          </label>
          <HeroTextRow
            label="Birincil başlık (TR)"
            value={cms.partners.sectionTitlePrimaryTr ?? ""}
            onCommit={(value) => patchPartners({ sectionTitlePrimaryTr: value })}
          />
          <HeroTextRow
            label="Aksen başlık (TR)"
            value={cms.partners.sectionTitleAccentTr ?? ""}
            onCommit={(value) => patchPartners({ sectionTitleAccentTr: value })}
          />
          <PartnerJsonEditor defaults={cms.partners.customLogos} onCommit={persistPartnersJson} />
          <details className="text-xs text-white/38">
            <summary>Şema referansı</summary>
            <pre className="mt-2 overflow-x-auto">{JSON.stringify(STRATEGIC_PARTNER_LOGOS[0], null, 2)}</pre>
          </details>
        </div>
      ) : null}

      {tab === "configurator" ? (
        <div className="admin-premium-glass-panel rounded-2xl space-y-5 p-8">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={cms.configurator.sectionVisible}
              onChange={(e) => patchConfigurator({ sectionVisible: e.target.checked })}
            />
            <span>Ana görünür başlık</span>
          </label>
          <HeroTextRow
            label="Başlık TR"
            value={cms.configurator.sectionTitleTr ?? ""}
            onCommit={(value) => patchConfigurator({ sectionTitleTr: value })}
          />
          <HeroTextRow
            label="Başlık EN"
            value={cms.configurator.sectionTitleEn ?? ""}
            onCommit={(value) => patchConfigurator({ sectionTitleEn: value })}
          />
        </div>
      ) : null}
    </div>
  );
}

function HeroTextRow({
  label,
  value,
  multiline,
  onCommit,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  const commit = (): void => onCommit(local);

  const shared =
    "w-full rounded-xl border border-white/12 bg-black/35 px-3 py-3 text-white focus:border-[oklch(0.72_0.16_205/0.5)] outline-none text-sm placeholder:text-white/35";

  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/43">{label}</span>
        <button type="button" className="text-[11px] text-[oklch(0.78_0.12_205)] uppercase" onClick={() => commit()}>
          Uygula
        </button>
      </div>
      {multiline ? (
        <textarea rows={4} className={shared} value={local} onChange={(e) => setLocal(e.target.value)} />
      ) : (
        <input className={shared} value={local} onChange={(e) => setLocal(e.target.value)} />
      )}
    </label>
  );
}

function PartnerJsonEditor({
  defaults,
  onCommit,
}: {
  defaults: StrategicPartnerLogo[];
  onCommit: (raw: string) => void;
}) {
  const [raw, setRaw] = useState(JSON.stringify(defaults.length ? defaults : STRATEGIC_PARTNER_LOGOS, null, 2));
  useEffect(
    () => setRaw(JSON.stringify(defaults.length ? defaults : STRATEGIC_PARTNER_LOGOS, null, 2)),
    [defaults],
  );

  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/43">
          Ortak dizisi (JSON)
        </span>
        <button
          type="button"
          className="rounded-full border border-white/14 px-3 py-1 text-[10px] uppercase"
          onClick={() => onCommit(raw)}
        >
          JSON&apos;ı çöz ve kaydet
        </button>
      </div>
      <textarea
        spellCheck={false}
        rows={12}
        className="font-mono w-full rounded-xl border border-white/12 bg-black/45 px-4 py-3 text-[11px] text-[oklch(0.9_0.02_255)] outline-none resize-y focus:border-[oklch(0.72_0.16_205/0.5)]"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
    </label>
  );
}
