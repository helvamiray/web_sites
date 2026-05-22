import { createFileRoute } from "@tanstack/react-router";

import {
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
  getExpectedAdminPassword,
  getExpectedAdminUsername,
} from "@/constants/adminCredentials";
import { notifyAdminAuthChanged } from "@/context/AdminAuthContext";
import { VEGA_CMS_STORAGE_KEY, readVegaCms, subscribeVegaCms, writeVegaCms, type VegaCmsState } from "@/lib/vegaCmsStore";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/ayarlar")({
  component: AyarlarRoute,
});

function AyarlarRoute() {
  const [snapshot, setSnapshot] = useState(JSON.stringify(readVegaCms(), null, 2));
  const [tick, setTick] = useState(0);

  void tick;

  useEffect(() => subscribeVegaCms(() => setTick((n) => n + 1)), []);

  const resetCms = (): void => {
    if (!window.confirm("Tüm ana sayfa CMS verilerini varsayılana döndür?")) return;
    const baseline: VegaCmsState = {
      version: 1,
      heroSlidePatches: {},
      about: {},
      partners: { useCustomLogos: false, customLogos: [] },
      configurator: { extraStudioBrands: [], sectionVisible: true },
      subcategoryOverrides: {},
      brandPoolExtras: {},
      mediaLibrary: [],
    };
    writeVegaCms(baseline);
    setSnapshot(JSON.stringify(baseline, null, 2));
    setTick((n) => n + 1);
  };

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-4xl mx-auto">
      <div className="admin-premium-glass-panel rounded-2xl p-8 space-y-3">
        <h3 className="text-xl font-semibold text-white tracking-tight font-[family-name:var(--font-sans)]">
          Erişim notları
        </h3>
        <p className="text-xs text-white/52 leading-relaxed">
          Beklenen kullanıcı:&nbsp;<code className="text-[oklch(0.8_0.1_205)]">{getExpectedAdminUsername()}</code>{" "}
          (varsayılan <code>{DEFAULT_ADMIN_USERNAME}</code>)
        </p>
        <p className="text-xs text-white/52 leading-relaxed">
          Beklenen parola yapısı `.env.local` ile değişir. Şu anda çalışan değerlendirilmiş parola özeti:&nbsp;
          <code>{getExpectedAdminPassword()}</code>
          {!import.meta.env.VITE_ADMIN_PASSWORD ? (
            <>
              {" "}(varsayılan <code>{DEFAULT_ADMIN_PASSWORD}</code>)
            </>
          ) : null}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="admin-premium-pill-btn" onClick={() => resetCms()}>
          CMS sıfırla
        </button>
        <button
          type="button"
          className="rounded-full border border-white/15 px-5 py-2 text-[11px] uppercase tracking-[0.16em]"
          onClick={() => notifyAdminAuthChanged()}
        >
          Oturumu yeniden doğrula
        </button>
      </div>

      <details className="admin-premium-glass-panel rounded-2xl px-8 py-4">
        <summary className="cursor-pointer text-[11px] uppercase tracking-[0.24em] text-white/54">
          Medya yükleme notu ({VEGA_CMS_STORAGE_KEY})
        </summary>
        <p className="mt-3 text-xs leading-relaxed text-white/54">
          data URL yaklaşımı kota sınırlamalarına duyarlıdır. Üretimde bucket arayüzü veya doğrudan public URL daha
          uygunken bu panel sahada parametre seçim yüzleri için eksiksiz bağlam yakalar.
        </p>
        <textarea
          className="mt-4 h-72 w-full rounded-xl border border-white/12 bg-black/45 p-4 font-mono text-[11px] text-white/70"
          value={snapshot}
          readOnly
          spellCheck={false}
          onFocus={() => setSnapshot(JSON.stringify(readVegaCms(), null, 2))}
        />
      </details>
    </div>
  );
}
