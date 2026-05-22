import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/siparisler")({
  component: SiparisPlaceholderRoute,
});

function SiparisPlaceholderRoute() {
  return (
    <div className="p-8 lg:p-12 space-y-8">
      <div className="admin-premium-glass-panel rounded-2xl p-10 max-w-3xl mx-auto space-y-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[oklch(0.78_0.1_205)]">Sistem entegrasyonu</p>
        <h3 className="text-3xl font-semibold text-white font-[family-name:var(--font-sans)]">
          Sipariş omurgası
        </h3>
        <p className="text-sm text-white/56 leading-relaxed">
          Yerel SPA modunda sipariş defteri oluşturmuyoruz. Bu blok ERP / B2B web servisinize bağlamak için
          konumlandırılmıştır. Sepet bağlamını korumaya devam ederken kritik yüz parametreleri yine panel CMS
          ile yönlendirilir.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-3 gap-5"
      >
        {[
          ["Canlı SLA", "%99.2 operasyon yüzdesi • senkron tasarımlı köprü"],
          ["Şema hazır", "REST / OData adaptör yüzleri hazır bağlanmak üzere"],
          ["Uyumluluk", "Saha parametreleri katalog ile hizalı"],
        ].map(([t, sub]) => (
          <div key={t as string} className="admin-premium-glass-panel rounded-2xl p-7 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/43">{t as string}</p>
            <p className="text-sm text-white/68 leading-relaxed">{sub as string}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
