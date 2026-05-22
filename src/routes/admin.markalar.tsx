import { createFileRoute } from "@tanstack/react-router";
import { type ChangeEvent, useEffect, useState } from "react";

import { BRANDS_BY_PRODUCT, PRODUCT_TYPES, type ProductTypeId } from "@/constants/premiumProductSelection";
import { readVegaCms, subscribeVegaCms, writeVegaCms, type VegaCmsState } from "@/lib/vegaCmsStore";

export const Route = createFileRoute("/admin/markalar")({
  component: AdminMarkalarRoute,
});

function AdminMarkalarRoute() {
  const [tick, setTick] = useState(0);

  useEffect(() => subscribeVegaCms(() => setTick((n) => n + 1)), []);

  void tick;

  const state = readVegaCms();

  const setStudioExtras = (csv: string) => {
    const prev = readVegaCms();
    const parts = parseParts(csv);
    const merged: VegaCmsState = {
      ...prev,
      configurator: { ...prev.configurator, extraStudioBrands: parts },
    };
    writeVegaCms(merged);
    setTick((n) => n + 1);
  };

  const setExtrasFor = (id: ProductTypeId, csv: string) => {
    const parts = parseParts(csv);
    const prev = readVegaCms();
    const merged: VegaCmsState = {
      ...prev,
      brandPoolExtras: { ...prev.brandPoolExtras, [id]: parts },
    };
    writeVegaCms(merged);
    setTick((n) => n + 1);
  };

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <p className="text-sm text-white/48 max-w-xl leading-relaxed font-[family-name:var(--font-sans)]">
        Ürün seçici cam vitrininde kullanılan çekirdek marka listesini genişletebilirsiniz. Ayrı ürün hatlarına özel katalog marka genişletmelerini aşağıda saklayabilirsiniz.
      </p>

      <div className="admin-premium-glass-panel rounded-2xl p-6 space-y-3 max-w-3xl">
        <h3 className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.78_0.1_205)]">
          Konfiguratör stüdyo markaları
        </h3>
        <p className="text-xs text-white/45">
          Varsayılan seçiciye eklenecek yeni markalar. Virgül veya satır ile ayırın.
        </p>
        <StudioBrandField initial={(state.configurator.extraStudioBrands ?? []).join(", ")} onDebounced={setStudioExtras} />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {PRODUCT_TYPES.map(({ id, label, description }) => {
          const base = BRANDS_BY_PRODUCT[id]?.join(", ") ?? "—";
          const extraCsv = (state.brandPoolExtras[id] ?? []).join(", ");
          return (
            <div key={id} className="admin-premium-glass-panel rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.78_0.1_205)]">{label}</h3>
                <p className="text-xs text-white/45 mt-1">{description}</p>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                  Liste referans · katalog markaları
                </div>
                <p className="text-xs leading-relaxed text-white/62 rounded-lg border border-white/10 px-4 py-3 bg-black/30">
                  {base}
                </p>
              </div>
              <label className="block space-y-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Ek katalog markaları
                </span>
                <BrandExtraField initial={extraCsv} onDebounced={(v) => setExtrasFor(id, v)} />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function parseParts(csv: string): string[] {
  return csv
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function StudioBrandField({
  initial,
  onDebounced,
}: {
  initial: string;
  onDebounced: (csv: string) => void;
}) {
  const [val, setVal] = useState(initial);
  useEffect(() => setVal(initial), [initial]);
  const onChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    const v = ev.target.value;
    setVal(v);
    onDebounced(v);
  };
  return (
    <textarea
      rows={5}
      value={val}
      onChange={onChange}
      className="w-full rounded-xl border border-white/12 bg-black/35 px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[oklch(0.72_0.16_205/0.5)] backdrop-blur-sm font-[family-name:var(--font-sans)] resize-y placeholder:text-white/38"
      placeholder="Örn. LG HVAC, Toshiba Carrier ..."
    />
  );
}

function BrandExtraField({
  initial,
  onDebounced,
}: {
  initial: string;
  onDebounced: (csv: string) => void;
}) {
  const [val, setVal] = useState(initial);

  useEffect(() => setVal(initial), [initial]);

  const onChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    const v = ev.target.value;
    setVal(v);
    onDebounced(v);
  };

  return (
    <textarea
      rows={5}
      value={val}
      onChange={onChange}
      className="w-full rounded-xl border border-white/12 bg-black/35 px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[oklch(0.72_0.16_205/0.5)] backdrop-blur-sm font-[family-name:var(--font-sans)] resize-y placeholder:text-white/38"
      placeholder="Örn. Honeywell Türkiye, Daikin VRV ..."
    />
  );
}
