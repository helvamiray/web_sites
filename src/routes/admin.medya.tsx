import { createFileRoute } from "@tanstack/react-router";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import type { VegaCmsMediaItem } from "@/lib/vegaCmsStore";
import { readVegaCms, subscribeVegaCms, writeVegaCms } from "@/lib/vegaCmsStore";

export const Route = createFileRoute("/admin/medya")({
  component: MedyaRoute,
});

function MedyaRoute() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeVegaCms(() => setTick((n) => n + 1)), []);
  void tick;

  const items = readVegaCms().mediaLibrary ?? [];

  const handleUpload =
    (category: VegaCmsMediaItem["category"]) =>
    async (ev: ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      ev.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      const url = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = (): void => reject(reader.error ?? new Error("Medya yükleme hatası."));
        reader.readAsDataURL(file);
      }).catch(() => "");
      if (!url) return;
      const prev = readVegaCms();
      const row: VegaCmsMediaItem = {
        id: crypto.randomUUID?.() ?? `m-${Date.now()}`,
        label: file.name,
        url,
        category,
        createdAt: new Date().toISOString(),
      };
      writeVegaCms({ ...prev, mediaLibrary: [row, ...prev.mediaLibrary] });
      setTick((n) => n + 1);
    };

  const removeItem = (id: string): void => {
    const prev = readVegaCms();
    writeVegaCms({ ...prev, mediaLibrary: prev.mediaLibrary.filter((m) => m.id !== id) });
    setTick((n) => n + 1);
  };

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="grid gap-6 md:grid-cols-3">
        {(["product-render", "logo", "homepage"] as VegaCmsMediaItem["category"][]).map((cat) => (
          <label
            key={cat}
            className="admin-premium-glass-panel relative flex cursor-pointer flex-col gap-4 rounded-2xl p-6"
          >
            <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">{cat}</span>
            <span className="admin-premium-pill-btn mt-auto justify-center cursor-pointer bg-[oklch(0.76_0.16_205)]">
              Dosya seç
            </span>
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={handleUpload(cat)} />
          </label>
        ))}
      </div>

      <div className="admin-premium-glass-panel rounded-2xl divide-y divide-white/[0.08] overflow-hidden">
        <div className="px-8 py-4 text-[11px] uppercase tracking-[0.26em] text-white/42 font-medium">
          Kütüphane önbelleği
        </div>
        {items.length === 0 ? (
          <p className="px-8 py-10 text-white/52 text-center">Henüz varlık yok.</p>
        ) : (
          items.map((m) => (
            <div key={m.id} className="grid gap-6 px-8 py-5 md:grid-cols-[7rem_minmax(0,1fr)_auto] items-center hover:bg-[oklch(0.9_0.05_205/0.04)]">
              <img src={m.url} alt="" className="aspect-square w-full rounded-xl border border-white/12 object-cover" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-white/88 truncate">{m.label}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/43">{m.category}</div>
              </div>
              <button
                type="button"
                className="rounded-full border border-red-400/42 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-red-300"
                onClick={() => removeItem(m.id)}
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
