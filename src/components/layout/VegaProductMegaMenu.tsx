import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Fan,
  Flame,
  ThermometerSun,
  Wind,
  Wrench,
} from "lucide-react";
import { animate, createScope, stagger, createTimeline } from "animejs";

import {
  PRODUCTS,
  CATEGORY_LABEL,
  type Product,
  type ProductCategory,
} from "@/data/products";
import { SHOWROOM_BRAND_NODES, showroomBrandMatchesProductBrand } from "@/data/showroomCatalog";
import { useShowroomFilterOptional } from "@/context/ShowroomFilterContext";
import { navigateToHashSection } from "@/utils/navigateToHashSection";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";

const MEGA_ICONS = {
  wind: Wind,
  fan: Fan,
  heat: ThermometerSun,
  flame: Flame,
  wrench: Wrench,
} as const;

type MegaIconKey = keyof typeof MEGA_ICONS;

type MegaRow =
  | {
      id: string;
      title: string;
      tag: string;
      iconKey: MegaIconKey;
      kind: "single";
      category: ProductCategory;
    }
  | {
      id: string;
      title: string;
      tag: string;
      iconKey: MegaIconKey;
      kind: "mechanical";
      categories: readonly ProductCategory[];
    };

const MEGA_ROWS: MegaRow[] = [
  {
    id: "klima",
    title: "Klima",
    tag: "Split ve merkezi sistemler",
    iconKey: "wind",
    kind: "single",
    category: "klima",
  },
  {
    id: "fancoil",
    title: "Fancoil",
    tag: "VRF ve iç ünite",
    iconKey: "fan",
    kind: "single",
    category: "vrf",
  },
  {
    id: "isi-pompasi",
    title: "Isı Pompası",
    tag: "Hava / su kaynaklı",
    iconKey: "heat",
    kind: "single",
    category: "isi-pompasi",
  },
  {
    id: "yangin",
    title: "Yangın",
    tag: "Güvenlik ve söndürme",
    iconKey: "flame",
    kind: "single",
    category: "yangin",
  },
  {
    id: "mekanik",
    title: "Mekanik Malzeme",
    tag: "Pompa, tank, tesisat",
    iconKey: "wrench",
    kind: "mechanical",
    categories: ["boru", "tank", "radyator", "kombi"],
  },
];

const MECHANICAL_ANCHOR: ProductCategory = "boru";
const SPEC_PREVIEW_COUNT = 4;
const MIN_TOUCH_PX = 44;

function productsForRow(row: MegaRow): Product[] {
  if (row.kind === "single") return PRODUCTS.filter((p) => p.category === row.category);
  return PRODUCTS.filter((p) => row.categories.includes(p.category));
}

/** Yalnızca bu kategoride(ler) gerçekten ürünü olan markalar — constraint-based */
function brandsWithProductsInScope(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) set.add(p.brand);
  return [...set].sort((a, b) => a.localeCompare(b, "tr"));
}

function logoForBrand(brand: string): string | undefined {
  const node = SHOWROOM_BRAND_NODES.find((n) => showroomBrandMatchesProductBrand(n.key, brand));
  return node?.logo;
}

function catalogCategoryForRow(row: MegaRow): ProductCategory {
  return row.kind === "single" ? row.category : MECHANICAL_ANCHOR;
}

interface VegaProductMegaMenuProps {
  isLight: boolean;
  premiumIndustrial?: boolean;
}

function MegaSpecCard({ product }: { product: Product }) {
  const previewSpecs = product.specs.slice(0, SPEC_PREVIEW_COUNT);
  const catLabel = CATEGORY_LABEL[product.category].tr;

  return (
    <article data-mega-model className="vega-mega-spec-card">
      <header className="vega-mega-spec-card__head">
        <span className="vega-mega-spec-card__sku" title="Ürün kodu">
          {product.id}
        </span>
        <h3 className="vega-mega-spec-card__title">{product.name}</h3>
        <p className="vega-mega-spec-card__meta">
          <span className="vega-mega-spec-card__brand">{product.brand}</span>
          <span className="vega-mega-spec-card__sep" aria-hidden>
            ·
          </span>
          <span className="vega-mega-spec-card__cat">{catLabel}</span>
        </p>
      </header>
      <dl className="vega-mega-spec-list">
        {previewSpecs.map((line, idx) => (
          <div key={`${product.id}-spec-${idx}`} className="vega-mega-spec-list__row">
            <dt className="sr-only">{`Özellik ${idx + 1}`}</dt>
            <dd>{line}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function VegaProductMegaMenu({ isLight, premiumIndustrial }: VegaProductMegaMenuProps) {
  const navigate = useNavigate();
  const showroomFilter = useShowroomFilterOptional();
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedRow, setSelectedRow] = useState<MegaRow | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setWizardStep(1);
    setSelectedRow(null);
    setSelectedBrand(null);
  }, []);

  const goCatalog = useCallback(
    (row: MegaRow) => {
      showroomFilter?.setPendingCatalogCategory(catalogCategoryForRow(row));
      navigateToHashSection(navigate, PRODUCT_CONFIGURATOR_HASH_ID);
      close();
    },
    [close, navigate, showroomFilter],
  );

  const scopedProducts = useMemo(() => (selectedRow ? productsForRow(selectedRow) : []), [selectedRow]);

  const brands = useMemo(() => brandsWithProductsInScope(scopedProducts), [scopedProducts]);

  const modelProducts = useMemo(() => {
    if (!selectedBrand) return [];
    return scopedProducts.filter((p) => p.brand === selectedBrand);
  }, [scopedProducts, selectedBrand]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (panelRef.current && !panelRef.current.contains(t)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

  const onCategoryClick = (row: MegaRow) => {
    const nextProducts = productsForRow(row);
    if (nextProducts.length === 0) return;
    setSelectedRow(row);
    setSelectedBrand(null);
    setWizardStep(2);
  };

  const onBrandClick = (brand: string) => {
    const models = scopedProducts.filter((p) => p.brand === brand);
    if (models.length === 0) return;
    setSelectedBrand(brand);
    setWizardStep(3);
  };

  const goBack = () => {
    if (wizardStep === 3) {
      setWizardStep(2);
      setSelectedBrand(null);
      return;
    }
    if (wizardStep === 2) {
      setWizardStep(1);
      setSelectedRow(null);
      setSelectedBrand(null);
    }
  };

  const goTab = (step: 1 | 2 | 3) => {
    if (step === 1) {
      setWizardStep(1);
      setSelectedRow(null);
      setSelectedBrand(null);
      return;
    }
    if (step === 2 && selectedRow) {
      setWizardStep(2);
      setSelectedBrand(null);
      return;
    }
    if (step === 3 && selectedRow && selectedBrand) {
      setWizardStep(3);
    }
  };

  /** Açılış — kategori kartları (stagger) */
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = panel.querySelectorAll<HTMLElement>("[data-mega-cat-card]");
    const scope = createScope({
      root: panel,
      mediaQueries: { desktop: "(min-width: 1024px)" },
    });

    scope.add((s) => {
      cards.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
      });
      const duration = s.matches.desktop ? 520 : 380;
      const step = s.matches.desktop ? 88 : 56;
      const a = animate(cards, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration,
        ease: "out(3)",
        delay: stagger(step, { from: "first" }),
      });
      return () => a.revert();
    });

    return () => {
      scope.revert();
    };
  }, [open]);

  /**
   * Timeline — Adım 2: seçili kategori vurgusu → marka paneli → logo stagger
   */
  useLayoutEffect(() => {
    if (!open || wizardStep !== 2 || !selectedRow) return;
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const catCard = panel.querySelector<HTMLElement>(`[data-mega-cat-id="${selectedRow.id}"]`);
    const pane = panel.querySelector<HTMLElement>("[data-mega-brands-pane]");
    const brandEls = panel.querySelectorAll<HTMLElement>("[data-mega-brand]");

    const scope = createScope({
      root: panel,
      mediaQueries: { desktop: "(min-width: 1024px)" },
    });

    scope.add((s) => {
      if (pane) {
        pane.style.opacity = "0";
        pane.style.transform = "translateX(20px)";
      }
      brandEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
      });

      const dPulse = s.matches.desktop ? 300 : 220;
      const dPane = s.matches.desktop ? 420 : 320;
      const dBrand = s.matches.desktop ? 480 : 360;
      const st = s.matches.desktop ? 100 : 72;

      const tl = createTimeline({ autoplay: true });
      if (catCard) {
        tl.add(catCard, {
          scale: [1, 1.02, 1],
          duration: dPulse,
          ease: "out(3)",
        });
      }
      if (pane) {
        tl.add(
          pane,
          {
            opacity: [0, 1],
            translateX: [20, 0],
            duration: dPane,
            ease: "out(3)",
          },
          "-=120",
        );
      }
      if (brandEls.length > 0) {
        tl.add(brandEls, {
          opacity: [0, 1],
          translateY: [18, 0],
          duration: dBrand,
          ease: "out(3)",
          delay: stagger(st, { from: "first" }),
        });
      }

      return () => tl.revert();
    });

    return () => scope.revert();
  }, [open, wizardStep, selectedRow?.id]);

  /**
   * Timeline — Adım 3: model / spec kartları
   */
  useLayoutEffect(() => {
    if (!open || wizardStep !== 3 || !selectedRow || !selectedBrand) return;
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const modelsPane = panel.querySelector<HTMLElement>("[data-mega-models-pane]");
    const modelEls = panel.querySelectorAll<HTMLElement>("[data-mega-model]");

    const scope = createScope({
      root: panel,
      mediaQueries: { desktop: "(min-width: 1024px)" },
    });

    scope.add((s) => {
      if (modelsPane) {
        modelsPane.style.opacity = "0";
        modelsPane.style.transform = "translateX(22px)";
      }
      modelEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(16px)";
      });

      const dPane = s.matches.desktop ? 360 : 260;
      const dCard = s.matches.desktop ? 440 : 340;
      const st = s.matches.desktop ? 80 : 56;

      const tl = createTimeline({ autoplay: true });
      if (modelsPane) {
        tl.add(modelsPane, {
          opacity: [0, 1],
          translateX: [22, 0],
          duration: dPane,
          ease: "out(3)",
        });
      }
      if (modelEls.length > 0) {
        tl.add(modelEls, {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: dCard,
          ease: "out(3)",
          delay: stagger(st, { from: "first" }),
        });
      }

      return () => tl.revert();
    });

    return () => scope.revert();
  }, [open, wizardStep, selectedRow?.id, selectedBrand]);

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  const panelClass = [
    "vega-mega-panel",
    premiumIndustrial ? "premium-mega" : "",
    !premiumIndustrial && isLight ? "vega-mega-panel--light" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative">
      <button
        type="button"
        id={`${menuId}-trigger`}
        className="vega-mega-trigger vega-mega-trigger--touch"
        style={{ minHeight: MIN_TOUCH_PX }}
        aria-expanded={open}
        aria-controls={`${menuId}-panel`}
        aria-haspopup="true"
        onClick={() => {
          setOpen((prev) => {
            if (prev) {
              setWizardStep(1);
              setSelectedRow(null);
              setSelectedBrand(null);
            }
            return !prev;
          });
        }}
        onKeyDown={onTriggerKeyDown}
      >
        Ürünler
        <ChevronDown className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className={`vega-mega-backdrop${premiumIndustrial ? " premium-mega" : ""}`}
            aria-label="Menüyü kapat"
            tabIndex={-1}
            onClick={close}
          />

          <div
            ref={panelRef}
            id={`${menuId}-panel`}
            className={panelClass}
            role="region"
            aria-label="Ürün yapılandırıcı"
          >
            <div className="vega-mega-tabs" role="tablist" aria-label="Yapılandırma adımları">
              <button
                type="button"
                role="tab"
                aria-selected={wizardStep === 1}
                className={`vega-mega-tab${wizardStep === 1 ? " vega-mega-tab--active" : ""}`}
                style={{ minHeight: MIN_TOUCH_PX }}
                onClick={() => goTab(1)}
              >
                <span className="vega-mega-tab__num">1</span>
                <span className="vega-mega-tab__label">Kategori</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={wizardStep === 2}
                aria-disabled={!selectedRow}
                disabled={!selectedRow}
                className={`vega-mega-tab${wizardStep === 2 ? " vega-mega-tab--active" : ""}`}
                style={{ minHeight: MIN_TOUCH_PX }}
                onClick={() => goTab(2)}
              >
                <span className="vega-mega-tab__num">2</span>
                <span className="vega-mega-tab__label">Marka</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={wizardStep === 3}
                aria-disabled={!selectedRow || !selectedBrand}
                disabled={!selectedRow || !selectedBrand}
                className={`vega-mega-tab${wizardStep === 3 ? " vega-mega-tab--active" : ""}`}
                style={{ minHeight: MIN_TOUCH_PX }}
                onClick={() => goTab(3)}
              >
                <span className="vega-mega-tab__num">3</span>
                <span className="vega-mega-tab__label">Model</span>
              </button>
            </div>

            <div className="vega-mega-panel__grid vega-mega-panel__grid--asym">
              <div className="vega-mega-panel__cards">
                {MEGA_ROWS.map((row) => {
                  const Icon = MEGA_ICONS[row.iconKey];
                  const active = selectedRow?.id === row.id;
                  const hasStock = productsForRow(row).length > 0;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      data-mega-cat-card
                      data-mega-cat-id={row.id}
                      disabled={!hasStock}
                      aria-disabled={!hasStock}
                      className={`vega-mega-card${active ? " vega-mega-card--active" : ""}${!hasStock ? " vega-mega-card--disabled" : ""}`}
                      style={{ minHeight: MIN_TOUCH_PX }}
                      onClick={() => onCategoryClick(row)}
                    >
                      <span className="vega-mega-card__icon" aria-hidden>
                        <Icon strokeWidth={1.35} className="size-6" />
                      </span>
                      <span className="vega-mega-card__title">{row.title}</span>
                      <span className="vega-mega-card__tag">{row.tag}</span>
                    </button>
                  );
                })}
              </div>

              <div className="vega-mega-panel__detail">
                {wizardStep === 1 ? (
                  <p className="vega-mega-detail-placeholder">
                    Kategori seçin. Yalnızca stokta geçerli kombinasyonlar gösterilir.
                  </p>
                ) : null}

                {wizardStep >= 2 && selectedRow ? (
                  <div data-mega-brands-pane className="vega-mega-wizard-pane">
                    <button
                      type="button"
                      className="vega-mega-wizard-back vega-mega-wizard-back--touch"
                      style={{ minHeight: MIN_TOUCH_PX }}
                      onClick={goBack}
                    >
                      ← Geri
                    </button>

                    <p className="vega-mega-section-label">
                      Markalar
                      <span className="vega-mega-section-label__hint"> · {selectedRow.title}</span>
                    </p>

                    {brands.length === 0 ? (
                      <p className="vega-mega-empty">Bu kategori için marka bulunamadı.</p>
                    ) : (
                      <div className="vega-mega-brand-grid">
                        {brands.map((b) => {
                          const src = logoForBrand(b);
                          const active = selectedBrand === b && wizardStep === 3;
                          return (
                            <button
                              key={b}
                              type="button"
                              data-mega-brand
                              className={`vega-mega-brand-tile vega-mega-brand-tile--touch${active ? " vega-mega-brand-tile--active" : ""}`}
                              style={{ minWidth: MIN_TOUCH_PX, minHeight: MIN_TOUCH_PX }}
                              onClick={() => onBrandClick(b)}
                            >
                              {src ? (
                                <img src={src} alt="" className="vega-mega-brand-tile__logo" loading="lazy" />
                              ) : (
                                <span className="vega-mega-brand-tile__name">{b}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null}

                {wizardStep === 3 && selectedRow && selectedBrand ? (
                  <div data-mega-models-pane className="vega-mega-wizard-pane vega-mega-models-block">
                    <p className="vega-mega-section-label">
                      Teknik özet
                      <span className="vega-mega-section-label__hint">
                        {" "}
                        · {selectedBrand}
                      </span>
                    </p>

                    {modelProducts.length === 0 ? (
                      <p className="vega-mega-empty">Bu marka için model bulunamadı.</p>
                    ) : (
                      <div className="vega-mega-spec-stack">
                        {modelProducts.map((p) => (
                          <MegaSpecCard key={p.id} product={p} />
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      className="vega-mega-cta vega-mega-cta--touch"
                      style={{ minHeight: MIN_TOUCH_PX }}
                      onClick={() => goCatalog(selectedRow)}
                    >
                      Katalogda aç
                    </button>
                  </div>
                ) : null}

                {wizardStep === 2 && selectedRow ? (
                  <button
                    type="button"
                    className="vega-mega-cta vega-mega-cta--secondary vega-mega-cta--touch"
                    style={{ minHeight: MIN_TOUCH_PX }}
                    onClick={() => goCatalog(selectedRow)}
                  >
                    Kategoriyi katalogda aç
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
