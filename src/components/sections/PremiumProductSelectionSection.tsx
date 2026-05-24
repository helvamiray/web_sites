import { useCallback, useMemo, useState, type ReactNode } from "react";

import { PRODUCTS } from "@/data/products";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";
import {
  CONFIGURATOR_HERO_IMAGE,
  CONFIGURATOR_TECH_CARDS,
  CONFIGURATOR_TYPE_THUMB,
  getConfiguratorBrandLogoUrl,
  getConfiguratorRepresentativeProductId,
  getCategoriesFor,
  PRODUCT_TYPES,
  type ProductTypeId,
} from "@/constants/premiumProductSelection";
import { useConfiguratorStudioBrandsMerged, useSyncedConfiguratorTitles } from "@/hooks/useSyncedSiteCms";
import { useLanguage } from "@/i18n/LanguageContext";
import { getMergedSubcategoriesForBrand } from "@/lib/cmsRuntime";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/CartContext";
import { intersectBrandsForProductType } from "@/utils/intersectBrandsForProductType";

interface Copy {
  stepType: string;
  stepBrand: string;
  stepCategory: string;
  stepPreview: string;
  stepCart: string;
  summaryTitle: string;
  summaryEmpty: string;
  summaryPartial: string;
  summarySku: string;
  addToCart: string;
  resetFlow: string;
  backCategory: string;
}

const COPY: Record<"tr" | "en", Copy> = {
  tr: {
    stepType: "Ürün tipi",
    stepBrand: "Marka",
    stepCategory: "Alt kategori",
    stepPreview: "Ön izleme",
    stepCart: "Sepete ekle",
    summaryTitle: "Özet",
    summaryEmpty: "Soldan ürün tipini seçerek başlayın.",
    summaryPartial: "Seçimleriniz sağda güncellenir.",
    summarySku: "Sepet ürünü",
    addToCart: "Sepete ekle",
    resetFlow: "Akışı sıfırla",
    backCategory: "Alt kategoriye dön",
  },
  en: {
    stepType: "Product type",
    stepBrand: "Brand",
    stepCategory: "Subcategory",
    stepPreview: "Preview",
    stepCart: "Add to cart",
    summaryTitle: "Summary",
    summaryEmpty: "Start by selecting a product type on the left.",
    summaryPartial: "Your selections update here.",
    summarySku: "Cart item",
    addToCart: "Add to cart",
    resetFlow: "Reset flow",
    backCategory: "Back to subcategory",
  },
};

interface SplitStepShellProps {
  stepIndex: number;
  title: string;
  body: ReactNode;
}

function SplitStepShell({ stepIndex, title, body }: SplitStepShellProps) {
  return (
    <div className="pps-split__step" data-split-step="">
      <p className="pps-split__step-head">
        <span className="pps-split__step-num">{stepIndex}</span>
        <span className="pps-split__step-title">{title}</span>
      </p>
      <div className="pps-split__step-body">{body}</div>
    </div>
  );
}

/** Split-screen accordion configurator — dark teal tones, minimal chrome */
export function PremiumProductSelectionSection() {
  const { add, openCart } = useCart();
  const { lang } = useLanguage();
  const configuratorTitles = useSyncedConfiguratorTitles();
  const studioBrands = useConfiguratorStudioBrandsMerged();
  const t = COPY[lang === "tr" ? "tr" : "en"];

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

  const brandsFiltered = useMemo(() => {
    if (!productId) return [];
    return intersectBrandsForProductType(productId, studioBrands);
  }, [productId, studioBrands]);

  const heroAsset = productId ? CONFIGURATOR_HERO_IMAGE[productId] : null;
  const typeThumb = productId ? CONFIGURATOR_TYPE_THUMB[productId] : null;
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

  const selectionComplete = Boolean(productId && brand && category && heroAsset && productMeta);

  const pickType = useCallback((id: ProductTypeId) => {
    setProductId(id);
    setBrand(null);
    setCategory(null);
  }, []);

  const pickBrand = useCallback((b: string) => {
    setBrand(b);
    setCategory(null);
  }, []);

  const pickCategory = useCallback((c: string) => {
    setCategory(c);
  }, []);

  const clearCategory = useCallback(() => {
    setCategory(null);
  }, []);

  const resetFlow = useCallback(() => {
    setProductId(null);
    setBrand(null);
    setCategory(null);
  }, []);

  const handleAddConfigured = useCallback(() => {
    if (!resolvedProduct) return;
    add(resolvedProduct, 1);
    openCart();
  }, [add, openCart, resolvedProduct]);

  return (
    <section
      id={PRODUCT_CONFIGURATOR_HASH_ID}
      className="premium-product-selection premium-product-selection--split"
    >
      <div className="pps-split__inner">
        <header className="pps-split__header">
          {configuratorTitles.visible ? (
            <h2 className="pps-split__heading">{headline}</h2>
          ) : (
            <h2 className="pps-split__sr-only">{headline}</h2>
          )}
          <button type="button" className="pps-split__reset" onClick={resetFlow} data-lux-cursor="">
            {t.resetFlow}
          </button>
        </header>

        <div className="pps-split__grid">
          <div className="pps-split__left" role="region" aria-label={headline}>
            <SplitStepShell
              stepIndex={1}
              title={t.stepType}
              body={
                <ul className="pps-split__rows" role="list">
                  {PRODUCT_TYPES.map((p) => {
                    const thumb = CONFIGURATOR_TYPE_THUMB[p.id];
                    const active = productId === p.id;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          className={cn("pps-split__row", active && "is-selected")}
                          onClick={() => pickType(p.id)}
                          data-lux-cursor=""
                          aria-pressed={active}
                        >
                          <span className="pps-split__row-icon" aria-hidden>
                            <img src={thumb.src} alt="" width={40} height={40} loading="lazy" />
                          </span>
                          <span className="pps-split__row-text">
                            <span className="pps-split__row-title">{p.label}</span>
                            <span className="pps-split__row-desc">{p.description}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              }
            />

            {productId ? (
              <SplitStepShell
                stepIndex={2}
                title={t.stepBrand}
                body={
                  <ul className="pps-split__rows pps-split__rows--compact" role="list">
                    {brandsFiltered.map((b) => {
                      const active = brand === b;
                      const logo = getConfiguratorBrandLogoUrl(b);
                      return (
                        <li key={b}>
                          <button
                            type="button"
                            className={cn("pps-split__row pps-split__row--brand", active && "is-selected")}
                            onClick={() => pickBrand(b)}
                            data-lux-cursor=""
                            aria-pressed={active}
                          >
                            <span className="pps-split__row-icon pps-split__row-icon--round" aria-hidden>
                              {logo ? (
                                <img src={logo} alt="" width={36} height={36} loading="lazy" />
                              ) : (
                                <span className="pps-split__row-mono">{b.slice(0, 2)}</span>
                              )}
                            </span>
                            <span className="pps-split__row-text">
                              <span className="pps-split__row-title">{b}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                }
              />
            ) : null}

            {productId && brand && effectiveSubcats.length > 0 ? (
              <SplitStepShell
                stepIndex={3}
                title={t.stepCategory}
                body={
                  <ul className="pps-split__rows pps-split__rows--dense" role="list">
                    {effectiveSubcats.map((c) => {
                      const active = category === c;
                      return (
                        <li key={c}>
                          <button
                            type="button"
                            className={cn("pps-split__row pps-split__row--text", active && "is-selected")}
                            onClick={() => pickCategory(c)}
                            data-lux-cursor=""
                            aria-pressed={active}
                          >
                            <span className="pps-split__row-glyph" aria-hidden>
                              ·
                            </span>
                            <span className="pps-split__row-title">{c}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                }
              />
            ) : null}

            {selectionComplete && typeThumb ? (
              <SplitStepShell
                stepIndex={4}
                title={t.stepPreview}
                body={
                  <div className="pps-split__preview-inline">
                    <img
                      className="pps-split__preview-inline-img"
                      src={typeThumb.src}
                      alt={typeThumb.alt}
                      width={120}
                      height={120}
                      loading="lazy"
                    />
                    <div className="pps-split__preview-inline-meta">
                      <p className="pps-split__preview-inline-line">
                        <span className="pps-split__preview-label">{productMeta.label}</span>
                        <span className="pps-split__preview-sep">·</span>
                        <span>{brand}</span>
                      </p>
                      <p className="pps-split__preview-inline-sub">{category}</p>
                    </div>
                  </div>
                }
              />
            ) : null}

            {selectionComplete ? (
              <SplitStepShell
                stepIndex={5}
                title={t.stepCart}
                body={
                  <div className="pps-split__cart-step">
                    <button
                      type="button"
                      className="pps-split__cta"
                      onClick={handleAddConfigured}
                      disabled={!resolvedProduct}
                      data-lux-cursor=""
                    >
                      {t.addToCart}
                    </button>
                    <button type="button" className="pps-split__link" onClick={clearCategory} data-lux-cursor="">
                      {t.backCategory}
                    </button>
                  </div>
                }
              />
            ) : null}
          </div>

          <aside className="pps-split__right" aria-label={t.summaryTitle}>
            <p className="pps-split__summary-kicker">{t.summaryTitle}</p>

            {!productId ? (
              <p className="pps-split__summary-muted">{t.summaryEmpty}</p>
            ) : (
              <>
                <div className="pps-split__summary-stack">
                  {productMeta ? (
                    <p className="pps-split__summary-line">
                      <span className="pps-split__summary-key">{t.stepType}</span>
                      <span className="pps-split__summary-val">{productMeta.label}</span>
                    </p>
                  ) : null}
                  {brand ? (
                    <p className="pps-split__summary-line">
                      <span className="pps-split__summary-key">{t.stepBrand}</span>
                      <span className="pps-split__summary-val">{brand}</span>
                    </p>
                  ) : null}
                  {category ? (
                    <p className="pps-split__summary-line">
                      <span className="pps-split__summary-key">{t.stepCategory}</span>
                      <span className="pps-split__summary-val">{category}</span>
                    </p>
                  ) : null}
                </div>

                {!category ? <p className="pps-split__summary-muted">{t.summaryPartial}</p> : null}

                {heroAsset ? (
                  <div className="pps-split__hero">
                    <img src={heroAsset.src} alt={heroAsset.alt} width={320} height={200} loading="lazy" />
                  </div>
                ) : null}

                {category && techCards.length > 0 ? (
                  <ul className="pps-split__specs">
                    {techCards.slice(0, 3).map((card) => (
                      <li key={card.title} className="pps-split__spec">
                        <span className="pps-split__spec-title">{card.title}</span>
                        <span className="pps-split__spec-value">{card.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <p className="pps-split__sku">
                  {t.summarySku}: <strong>{resolvedProduct?.name ?? "—"}</strong>
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
