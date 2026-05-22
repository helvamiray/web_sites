import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  ConfiguratorBrandGallery,
  ConfiguratorCategoryBoard,
  ConfiguratorProductTypeGrid,
  ConfiguratorRevealStage,
} from "@/components/sections/configurator";
import { PRODUCTS } from "@/data/products";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";
import {
  CONFIGURATOR_HERO_IMAGE,
  CONFIGURATOR_TECH_CARDS,
  getConfiguratorRepresentativeProductId,
  getCategoriesFor,
  PRODUCT_TYPES,
  type ProductTypeId,
} from "@/constants/premiumProductSelection";
import { useConfiguratorStudioBrandsMerged, useSyncedConfiguratorTitles } from "@/hooks/useSyncedSiteCms";
import { useLanguage } from "@/i18n/LanguageContext";
import { getMergedSubcategoriesForBrand } from "@/lib/cmsRuntime";
import { useCart } from "@/providers/CartContext";

type SelectionStep = "type" | "brand" | "category" | "reveal";

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

const PROGRESS = [
  { key: "p1", label: "Ürün" },
  { key: "p2", label: "Marka" },
  { key: "p3", label: "Alt kategori" },
  { key: "p4", label: "Ürün ön izleme" },
  { key: "p5", label: "Sepete ekle" },
] as const;

function rankStep(s: SelectionStep): number {
  switch (s) {
    case "type":
      return 1;
    case "brand":
      return 2;
    case "category":
      return 3;
    case "reveal":
      return 4;
  }
}

/** Apple × Porsche konfiguratör sırası — koyu cam vitrin; doğrudan seçim ile başlar. */
export function PremiumProductSelectionSection() {
  const reduceMotion = useReducedMotion();
  const { add, openCart } = useCart();
  const { lang } = useLanguage();
  const configuratorTitles = useSyncedConfiguratorTitles();
  const studioBrands = useConfiguratorStudioBrandsMerged();
  const [step, setStep] = useState<SelectionStep>("type");
  const [productId, setProductId] = useState<ProductTypeId | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const productMeta = useMemo(
    () => (productId ? (PRODUCT_TYPES.find((p) => p.id === productId) ?? null) : null),
    [productId],
  );

  const subCategories = useMemo(() => {
    if (!productId || !brand) return [];
    return getMergedSubcategoriesForBrand(productId, brand);
  }, [productId, brand]);

  const fallbackCategories = useMemo(() => (productId ? getCategoriesFor(productId) : []), [productId]);
  const effectiveSubcats = subCategories.length > 0 ? subCategories : fallbackCategories;

  const heroAsset = productId ? CONFIGURATOR_HERO_IMAGE[productId] : null;
  const techCards = productId ? CONFIGURATOR_TECH_CARDS[productId] : [];

  const cartProductId = useMemo(() => {
    if (!productId || !brand) return null;
    return getConfiguratorRepresentativeProductId(productId, brand);
  }, [productId, brand]);

  const resolvedProduct = useMemo(
    () => (cartProductId ? PRODUCTS.find((p) => p.id === cartProductId) ?? null : null),
    [cartProductId],
  );

  const headline =
    lang === "tr"
      ? (configuratorTitles.titleTr ?? "Ürün konfigürasyonu")
      : (configuratorTitles.titleEn ?? "Product configuration");

  const fadePanel = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.52, ease: EASE_SOFT } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.4, ease: EASE_SOFT } },
      };

  const pickType = useCallback((id: ProductTypeId) => {
    setProductId(id);
    setBrand(null);
    setCategory(null);
    setStep("brand");
  }, []);

  const pickBrand = useCallback((b: string) => {
    setBrand(b);
    setCategory(null);
    setStep("category");
  }, []);

  const pickCategory = useCallback((c: string) => {
    setCategory(c);
    setStep("reveal");
  }, []);

  const goBack = useCallback(() => {
    if (step === "reveal") {
      setCategory(null);
      setStep("category");
      return;
    }
    if (step === "category") {
      setCategory(null);
      setStep("brand");
      return;
    }
    if (step === "brand") {
      setProductId(null);
      setBrand(null);
      setCategory(null);
      setStep("type");
    }
  }, [step]);

  const resetFlow = useCallback(() => {
    setProductId(null);
    setBrand(null);
    setCategory(null);
    setStep("type");
  }, []);

  const handleAddConfigured = useCallback(() => {
    if (!resolvedProduct) return;
    add(resolvedProduct, 1);
    openCart();
  }, [add, openCart, resolvedProduct]);

  return (
    <section
      id={PRODUCT_CONFIGURATOR_HASH_ID}
      className="premium-product-selection pps-studio midnight-section midnight-section--products"
    >
      <div className="pps-studio__veil" aria-hidden />
      <div className="premium-product-selection__inner pps-studio__inner">
        {configuratorTitles.visible ? (
          <h2 className="pps-studio-heading mb-6 text-lg font-semibold tracking-tight text-white/92 text-center font-[family-name:var(--font-sans)]">
            {headline}
          </h2>
        ) : (
          <h2 className="pps-studio-sr-only">{headline}</h2>
        )}

        <ol className="pps-studio-steps" aria-label="Adımlar">
          {PROGRESS.map((p, i) => {
            const idx = i + 1;
            const rank = rankStep(step);
            const atReveal = step === "reveal";

            let state: "done" | "active" | "todo" = "todo";
            if (atReveal) {
              state = idx === 5 ? "active" : "done";
            } else if (idx < rank) {
              state = "done";
            } else if (idx === rank) {
              state = "active";
            }

            const dim = state === "todo";

            return (
              <motion.li
                key={p.key}
                className={`pps-studio-steps__pill${state === "active" ? " is-active" : ""}${state === "done" ? " is-done" : ""}${dim ? " is-todo" : ""}`}
                initial={false}
                animate={{ opacity: dim ? 0.38 : 1 }}
              >
                <span className="pps-studio-steps__n">{idx}</span>
                <span className="pps-studio-steps__t">{p.label}</span>
              </motion.li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          {step !== "reveal" ? (
            <motion.div key="wizard" {...fadePanel} className="pps-studio-wizard">
              <ConfiguratorProductTypeGrid products={PRODUCT_TYPES} activeId={productId} onPick={pickType} />

              <AnimatePresence>
                {(step === "brand" || step === "category") && productId ? (
                  <motion.div key="brands-wrap" {...fadePanel}>
                    <ConfiguratorBrandGallery brands={studioBrands} selected={brand} onPick={pickBrand} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {step === "category" && brand && effectiveSubcats.length ? (
                  <motion.div key="subs-wrap" {...fadePanel}>
                    <ConfiguratorCategoryBoard
                      categories={effectiveSubcats}
                      selected={category}
                      onPick={pickCategory}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {(step === "brand" || step === "category") && (
                <div className="pps-studio-foot">
                  <button type="button" className="pps-studio-quiet" onClick={goBack}>
                    ← Geri
                  </button>
                  <button type="button" className="pps-studio-quiet is-ghost" onClick={resetFlow}>
                    Akışı sıfırla
                  </button>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {step === "reveal" && productId && brand && category && heroAsset && productMeta ? (
            <motion.div key="studio-reveal" {...fadePanel} className="pps-studio-reveal">
              <aside className="pps-studio-recap">
                <div className="pps-studio-recap__row">
                  <span className="pps-studio-chip-static">{productMeta.label}</span>
                  <span className="pps-studio-chip-static">{brand}</span>
                  <span className="pps-studio-chip-static">{category}</span>
                </div>
                <p className="pps-studio-recap__hint">
                  Sepet SKU: <strong>{resolvedProduct?.name ?? "—"}</strong>
                </p>
                <div className="pps-studio-recap__actions">
                  <button type="button" className="pps-studio-quiet" onClick={goBack}>
                    ← Alt kategoriye dön
                  </button>
                  <button type="button" className="pps-studio-quiet is-ghost" onClick={resetFlow}>
                    Yeni konfigürasyon
                  </button>
                </div>
              </aside>

              <ConfiguratorRevealStage
                brand={brand}
                category={category}
                imageSrc={heroAsset.src}
                imageAlt={heroAsset.alt}
                techCards={techCards}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {step === "reveal" && resolvedProduct ? (
            <motion.div
              key="cart-affix"
              className="pps-studio-cart-affix"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_SOFT }}
            >
              <button type="button" className="pps-studio-cart-btn" onClick={handleAddConfigured}>
                Konfigürasyona Ekle
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
