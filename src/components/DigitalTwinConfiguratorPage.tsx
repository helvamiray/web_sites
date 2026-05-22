import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { Header } from "@/components/Header";
import { ProductCatalog } from "@/components/ProductCatalog";
import { DigitalTwinExperienceProvider } from "@/context/DigitalTwinExperienceContext";

interface DigitalTwinConfiguratorPageProps {
  className?: string;
}

/**
 * Inner layout for `/dijital-ikiz` — glass panels, navy shell, catalog + R3F viewer per spec.
 */
export function DigitalTwinConfiguratorPage({ className }: DigitalTwinConfiguratorPageProps) {
  return (
    <DigitalTwinExperienceProvider>
      <div className={className} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Header className="mb-8" />

        <header className="mb-10 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#94a3b8]">
            İNTERAKTİF DİJİTAL İKİZ
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl md:leading-tight">
            Ürün seçin — villada <span className="text-[#22c55e]">parlayan</span> bileşeni izleyin
          </h1>
          <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-[#94a3b8]">
            Katalog görseli (mümkünse) klima iç ünitelerinde doku olarak uygulanır. Sahne Poly Haven
            IBL ve PBR ile ağ üzerinden yüklenir.
          </p>
        </header>

        <section
          id="systems"
          className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-8"
        >
          <div className="order-1 lg:order-none lg:sticky lg:top-24 lg:self-start">
            <DigitalTwinViewer />
          </div>
          <div className="order-2 max-h-none overflow-visible lg:order-none lg:max-h-[min(680px,calc(100vh-8rem))] lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
            <ProductCatalog />
          </div>
        </section>
      </div>
    </DigitalTwinExperienceProvider>
  );
}
