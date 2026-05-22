import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getSubcategoriesForBrand, PRODUCT_TYPES, type ProductTypeId } from "@/constants/premiumProductSelection";
import { readVegaCms, subscribeVegaCms, writeVegaCms, type VegaCmsState } from "@/lib/vegaCmsStore";

export const Route = createFileRoute("/admin/alt-kategoriler")({
  component: AltKategoriRoute,
});

function overrideKey(productId: ProductTypeId, brandRaw: string): string {
  return `${productId}::${brandRaw.trim().toLowerCase()}`;
}

function AltKategoriRoute() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeVegaCms(() => setTick((n) => n + 1)), []);

  const [productId, setProductId] = useState<ProductTypeId>("klima");
  const [brand, setBrand] = useState<string>("Daikin");

  const key = overrideKey(productId, brand);

  const [linesText, setLinesText] = useState("");

  useEffect(() => {
    const st = readVegaCms();
    const o = st.subcategoryOverrides ?? {};
    const w = `${productId}::*`.toLowerCase();
    const k = key;
    const arr =
      (o[k]?.length ? o[k] : undefined) ??
      (o[w]?.length ? o[w] : undefined) ??
      getSubcategoriesForBrand(productId, brand);
    setLinesText(arr.join("\n"));
  }, [productId, brand, key, tick]);

  const persist = (): void => {
    const lines = linesText
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const prev = readVegaCms();
    const nextOverrides = { ...(prev.subcategoryOverrides ?? {}) };
    if (lines.length === 0) delete nextOverrides[key.toLowerCase()];
    else nextOverrides[key.toLowerCase()] = lines;
    const merged: VegaCmsState = { ...prev, subcategoryOverrides: nextOverrides };
    writeVegaCms(merged);
    setTick((n) => n + 1);
  };

  const persistWildcard = (): void => {
    const lines = linesText
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const prev = readVegaCms();
    const nextOverrides = { ...(prev.subcategoryOverrides ?? {}) };
    const wk = `${productId}::*`.toLowerCase();
    if (lines.length === 0) delete nextOverrides[wk];
    else nextOverrides[wk] = lines;
    writeVegaCms({ ...prev, subcategoryOverrides: nextOverrides });
    setTick((n) => n + 1);
  };

  const resetKey = (): void => {
    const prev = readVegaCms();
    const nextOverrides = { ...(prev.subcategoryOverrides ?? {}) };
    delete nextOverrides[key.toLowerCase()];
    writeVegaCms({ ...prev, subcategoryOverrides: nextOverrides });
    setTick((n) => n + 1);
  };

  const defaultsPreview = getSubcategoriesForBrand(productId, brand);

  return (
    <div className="grid gap-8 p-6 lg:p-10 lg:grid-cols-[minmax(0,380px)_1fr]">
      <aside className="admin-premium-glass-panel h-fit rounded-2xl p-6 space-y-5">
        <h3 className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.78_0.1_205)]">Bağlam</h3>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">Ürün hattı</span>
          <select
            className="w-full rounded-xl border border-white/12 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-[oklch(0.72_0.16_205/0.5)]"
            value={productId}
            onChange={(ev) => setProductId(ev.target.value as ProductTypeId)}
          >
            {PRODUCT_TYPES.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">
            Konfiguratör markası yazın (örn. Daikin veya*)
          </span>
          <input
            className="w-full rounded-xl border border-white/12 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-[oklch(0.72_0.16_205/0.5)]"
            value={brand}
            onChange={(ev) => setBrand(ev.target.value)}
          />
          <p className="text-[11px] text-white/42 leading-relaxed">
            Kombinasyon anahtarı:<br />
            <code className="text-[oklch(0.8_0.1_205)]">{key}</code>
          </p>
        </label>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">Şema</p>
          <p className="text-xs leading-relaxed text-white/54">
            Tüm markalar için aynı listeyi uygula: <strong className="text-white/75">{`${productId}::*`}</strong>
          </p>
          <button
            type="button"
            onClick={() => persistWildcard()}
            className="w-full rounded-xl border border-white/18 bg-transparent py-3 text-[11px] uppercase tracking-[0.16em] text-white/70 hover:bg-white/[0.04]"
          >
            Mevcut listeyi wildcard olarak yaz
          </button>
          <button
            type="button"
            onClick={() => resetKey()}
            className="w-full rounded-xl border border-white/12 py-3 text-[11px] uppercase tracking-[0.16em] text-amber-200/89 hover:bg-amber-500/[0.08]"
          >
            Bu marka için override sil
          </button>
        </div>
      </aside>

      <div className="admin-premium-glass-panel rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight font-[family-name:var(--font-sans)]">
              Alt seçenek editörü
            </h3>
            <p className="text-[12px] text-white/52 mt-1">
              Her satır tek bir alt kategori seçeneği. Konfiguratör sırasında bu diziler çağırılır.
            </p>
          </div>
          <button type="button" onClick={() => persist()} className="admin-premium-pill-btn !py-2.5 !px-7 text-[11px]">
            Kaydet
          </button>
        </div>

        <textarea
          rows={16}
          className="w-full flex-1 min-h-[18rem] rounded-xl border border-white/12 bg-black/38 px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[oklch(0.72_0.16_205/0.5)] resize-y font-mono"
          value={linesText}
          spellCheck={false}
          onChange={(ev) => setLinesText(ev.target.value)}
        />

        <p className="text-[11px] text-white/38">
          Tasarımdan gelen temel sıra:&nbsp;
          <span className="text-white/62">{defaultsPreview.slice(0, 4).join(" · ")}{defaultsPreview.length > 4 ? " …" : ""}</span>
        </p>
      </div>
    </div>
  );
}
