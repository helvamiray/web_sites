import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ProductTypeId } from "@/constants/premiumProductSelection";
import {
  CONFIGURATOR_HERO_IMAGE,
  PRODUCT_TYPES,
} from "@/constants/premiumProductSelection";
import {
  STUDIO_CART_PRODUCT_ID,
  STUDIO_PREVIEW_METRICS,
} from "@/constants/engineeringConfigurationStudio";
import { getProductById } from "@/lib/productService";
import { useCart } from "@/providers/CartContext";

interface StudioPreviewPanelProps {
  selectedId: ProductTypeId | null;
}

export function StudioPreviewPanel({ selectedId }: StudioPreviewPanelProps) {
  const { add, openCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedId) return;
    const catalogId = STUDIO_CART_PRODUCT_ID[selectedId];
    const product = getProductById(catalogId);
    if (!product) {
      toast.error("Ürün yüklenemedi");
      return;
    }
    add(product, 1);
    openCart();
    toast.success("Sepete eklendi", { description: product.name });
  };

  const meta = selectedId ? PRODUCT_TYPES.find((p) => p.id === selectedId) : undefined;
  const img = selectedId ? CONFIGURATOR_HERO_IMAGE[selectedId] : null;
  const metrics = selectedId ? STUDIO_PREVIEW_METRICS[selectedId] : [];
  const primaryProduct = selectedId ? getProductById(STUDIO_CART_PRODUCT_ID[selectedId]) : null;

  return (
    <div className="relative min-h-[320px] lg:min-h-[420px]">
      <AnimatePresence mode="wait">
        {selectedId && img && meta ? (
          <motion.div
            key={selectedId}
            className="ecs-studio-preview"
            initial={{ opacity: 0, x: 36, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="ecs-studio__label mb-3 block text-left"
              style={{ letterSpacing: "0.28em" }}
            >
              ÖN İZLEME
            </span>
            <h3 className="font-serif text-left text-2xl font-medium tracking-tight text-[#f5f7fb]">
              {meta.label}
            </h3>
            <p className="mt-1 text-left text-xs leading-relaxed text-[#8ea3b8]">{meta.description}</p>

            <div className="ecs-studio-preview__image-wrap mt-4">
              <div className="ecs-studio-node left-[8%] top-[12%]" style={{ animationDelay: "0s" }} aria-hidden />
              <div className="ecs-studio-node right-[14%] top-[22%]" style={{ animationDelay: "1.2s" }} aria-hidden />
              <div className="ecs-studio-node left-[18%] bottom-[16%]" style={{ animationDelay: "2.1s" }} aria-hidden />
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </div>

            <div className="ecs-studio-preview__metric-grid">
              {metrics.map((m) => (
                <div key={m.label + m.value} className="ecs-studio-preview__metric">
                  <p className="ecs-studio-preview__metric-label">{m.label}</p>
                  <p className="ecs-studio-preview__metric-value">{m.value}</p>
                  {m.hint ? <p className="ecs-studio-preview__metric-hint">{m.hint}</p> : null}
                </div>
              ))}
            </div>

            <div className="ecs-studio-preview__actions">
              {primaryProduct ? (
                <Link
                  to="/urunler/$slug"
                  params={{ slug: primaryProduct.id }}
                  className="ecs-studio-btn ecs-studio-btn--primary min-h-11 min-w-[8rem] no-underline"
                >
                  Ürünü İncele
                </Link>
              ) : (
                <span className="ecs-studio-btn ecs-studio-btn--primary pointer-events-none opacity-50">
                  Ürünü İncele
                </span>
              )}
              <button
                type="button"
                onClick={handleAddToCart}
                className="ecs-studio-btn ecs-studio-btn--ghost min-h-11 min-w-[8rem]"
              >
                Sepete Ekle
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="flex min-h-[320px] flex-col justify-center rounded-[calc(var(--ecs-radius)+0.15rem)] border border-white/[0.08] bg-[rgba(6,20,33,0.35)] px-6 py-10 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="ecs-studio__label mb-2 text-center">HAZIR</p>
            <p className="text-center font-serif text-xl font-medium text-[#f5f7fb]">
              Yapılandırma bekleniyor
            </p>
            <p className="mx-auto mt-3 max-w-xs text-center text-sm text-[#8ea3b8]">
              Sol taraftan bir ürün ailesi seçerek teknik ön izlemeyi ve vitrin görselini açın.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
