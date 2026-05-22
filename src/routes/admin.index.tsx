import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cpu, LayoutGrid } from "lucide-react";

import { BRANDS_BY_PRODUCT, PRODUCT_TYPES, type ProductTypeId } from "@/constants/premiumProductSelection";
import { getAdminMergedProductRows } from "@/lib/productService";
import { readVegaCms } from "@/lib/vegaCmsStore";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardRoute,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function AdminDashboardRoute() {
  const products = typeof window !== "undefined" ? getAdminMergedProductRows() : [];
  const cms = readVegaCms();

  const brandExtras = cms.brandPoolExtras;
  let extraBrandCount = 0;
  (Object.keys(brandExtras) as ProductTypeId[]).forEach((k) => {
    extraBrandCount += brandExtras[k]?.length ?? 0;
  });

  const subcatKeys = Object.keys(cms.subcategoryOverrides).filter(
    (k) => cms.subcategoryOverrides[k]?.length,
  );

  const dashboardCards = [
    {
      label: "Aktif ürün yüzleri",
      value: products.length.toString(),
      accent: "Katalog ile birlikte görülen satırlar",
      to: "/admin/urunler" as const,
    },
    {
      label: "Medya blokları",
      value: cms.mediaLibrary.length.toString(),
      accent: "Vitrine hazır yükleme varlığı",
      to: "/admin/medya" as const,
    },
    {
      label: "Marka güçlemeleri",
      value: `${extraBrandCount}`,
      accent: `${PRODUCT_TYPES.length} ürün hattından biriken ek markalar`,
      to: "/admin/markalar" as const,
    },
    {
      label: "Alt kategori bağlamı",
      value: `${subcatKeys.length}`,
      accent: "Marka seçim yüzünde özelleştirilmiş çizimler",
      to: "/admin/alt-kategoriler" as const,
    },
  ];

  const studioBrandBase = BRANDS_BY_PRODUCT;

  const quickFacts = PRODUCT_TYPES.slice(0, 3).map((t) => ({
    title: t.label,
    hint: `${(studioBrandBase[t.id]?.length ?? 0) + (brandExtras[t.id]?.length ?? 0)} seçilebilir marka`,
    to: "/admin/markalar" as const,
  }));

  return (
    <div className="p-8 lg:p-10 space-y-10 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div />
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/homepage"
            className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.78_0.12_210/0.3)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[oklch(0.8_0.08_205)] hover:border-[oklch(0.78_0.14_205/0.55)] hover:text-white transition-colors font-[family-name:var(--font-sans)]"
          >
            <Cpu className="h-4 w-4" strokeWidth={1.35} aria-hidden /> Ana sahne parametreleri
          </Link>
          <Link
            to="/admin/urunler"
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-br from-[oklch(0.66_0.16_205)] to-[oklch(0.58_0.14_250)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black hover:brightness-105 font-semibold transition-all font-[family-name:var(--font-sans)]"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden /> Katalog yüzünü düzenle
          </Link>
        </div>
      </div>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {dashboardCards.map((c, idx) => (
          <motion.div key={c.label} transition={{ duration: 0.45, ease: EASE, delay: idx * 0.06 }}>
            <Link to={c.to}>
              <div className="admin-premium-glass-panel h-full p-6 flex flex-col justify-between rounded-2xl min-h-[9.5rem]">
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/42">{c.label}</p>
                <p className="text-4xl font-semibold text-white mt-6 font-[family-name:var(--font-sans)]">
                  {c.value}
                </p>
                <p className="text-xs text-white/48 mt-2 leading-relaxed">{c.accent}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)]">
        <motion.div
          className="admin-premium-glass-panel p-8 rounded-2xl space-y-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <h3 className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.78_0.1_205)]">
            Hareket özeti
          </h3>
          <p className="text-lg text-white/88 leading-snug font-[family-name:var(--font-sans)]">
            Vitrin sırasını sürükleyerek değiştirebilir, hero metinlerini sinematik alana taşıyabilirsiniz.
            Her kayıtta tarayıcı `localStorage` senkronu tetiklenir.
          </p>
          <p className="text-sm text-white/48 leading-relaxed">
            Yerel araç olarak tasarlanan panel; sahada doğrulanabilir parametreler için üretilmiştir —
            bulut gerektirmeden tasarımcı bağlamını yakalar.
          </p>
        </motion.div>

        <motion.ul
          className="admin-premium-glass-panel divide-y divide-white/[0.08] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
        >
          <li className="px-8 py-4 text-[11px] uppercase tracking-[0.26em] text-white/42">
            Canlı seçim blokları
          </li>
          {quickFacts.map((f, i) => (
            <motion.li
              key={f.title}
              className="px-8 py-5 flex items-start justify-between gap-4 hover:bg-[oklch(0.9_0.05_205/0.04)] transition-colors border-t border-transparent"
              transition={{ duration: 0.45, ease: EASE, delay: 0.08 + i * 0.04 }}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-white/86 font-[family-name:var(--font-sans)]">
                  {f.title}
                </div>
                <div className="text-xs text-white/45">{f.hint}</div>
              </div>
              <Link className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-[oklch(0.78_0.1_205)]" to={f.to}>
                Yönlendir →
              </Link>
            </motion.li>
          ))}
          <li className="px-8 py-4 text-[11px] text-white/40">
            Not: sipariş yönlendirmeleri yakında bağlanabilecek ERP köprüsü için yer tutuyor.
          </li>
        </motion.ul>
      </div>
    </div>
  );
}
