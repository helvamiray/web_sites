import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, Package } from "lucide-react";
import { type Product, type ProductCategory, CATEGORY_LABEL } from "@/data/products";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/providers/CartContext";
import { toast } from "sonner";
import { IconShoppingCart } from "@tabler/icons-react";

const CAT_COLORS: Record<ProductCategory, string> = {
  vrf: "var(--electric-cyan,#00f0ff)",
  "isi-pompasi": "var(--gold)",
  kombi: "var(--navy-primary)",
  klima: "var(--vega-cyan)",
  radyator: "var(--navy-light)",
  boru: "#5a8a7a",
  tank: "#7a6a5a",
  yangin: "var(--cat-fire)",
};

export interface TwinProductCardProps {
  product: Product;
  active: boolean;
  onFocus: (id: string) => void;
  cardIndex: number;
}

/**
 * Compact “digital twin dashboard” product row — primary action is focus the 3D scene
 * (no navigation on card body click).
 */
export function TwinProductCard({ product: p, active, onFocus, cardIndex }: TwinProductCardProps) {
  const { add, openCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const name = lang === "tr" ? p.name : p.name_en;
  const category = CATEGORY_LABEL[p.category][lang];
  const accentColor = CAT_COLORS[p.category] ?? "var(--navy-primary)";
  const hasImg = Boolean(p.image && p.image !== "/placeholder.svg");

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(p);
    setTimeout(openCart, 400);
    toast.success(`${name} ${t("toast.added")}`, {
      action: { label: t("toast.openCart"), onClick: () => openCart() },
    });
  };

  const openDetailPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigate({ to: "/urunler/$slug", params: { slug: p.id } });
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onFocus(p.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFocus(p.id);
        }
      }}
      className={[
        "group relative flex gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-300",
        "bg-background/45 backdrop-blur-md border-white/[0.09] shadow-[0_8px_28px_rgba(0,0,0,0.35)]",
        "hover:border-cyan/35 hover:bg-background/55",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40",
        active ? "ring-2 ring-offset-2 ring-offset-background" : "",
      ].join(" ")}
      style={
        active
          ? {
              boxShadow: `0 0 0 1px ${accentColor}44, 0 12px 40px rgba(0,0,0,0.45)`,
              borderColor: `${accentColor}66`,
            }
          : undefined
      }
      aria-current={active ? "true" : undefined}
      aria-label={`${name} — 3D odak`}
    >
      <div
        className="relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-black/30"
        aria-hidden={!hasImg}
      >
        {hasImg ? (
          <img
            src={p.image}
            alt=""
            decoding="async"
            loading={cardIndex === 0 ? "eager" : "lazy"}
            fetchPriority={cardIndex === 0 ? "high" : "low"}
            className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-7 w-7 text-white/30" strokeWidth={1.25} aria-hidden />
          </div>
        )}
        {active && (
          <span
            className="absolute inset-x-0 bottom-0 h-0.5 opacity-90"
            style={{ background: accentColor }}
            aria-hidden
          />
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-[9px] uppercase tracking-[0.22em] text-cyan/80 truncate">{p.brand}</p>
            <h3 className="font-display text-[13px] leading-snug text-foreground/95 line-clamp-2">{name}</h3>
          </div>
          <button
            type="button"
            onClick={openDetailPage}
            className="shrink-0 rounded-md p-1.5 text-foreground/45 transition-colors hover:bg-white/[0.06] hover:text-cyan"
            title={lang === "en" ? "Product page" : "Ürün sayfası"}
            aria-label={`${name} — ${t("card.specs")}`}
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="font-mono text-[9px] uppercase tracking-wider text-foreground/45 truncate max-w-[10rem]"
            title={category}
          >
            {category}
          </span>
          {active && (
            <span
              className="font-display text-[8px] uppercase tracking-[0.2em] text-amber/90"
              aria-live="polite"
            >
              ● 3D odak
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 rounded-md border border-cyan/30 bg-cyan/[0.08] px-2 py-1 font-display text-[9px] uppercase tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/15"
            aria-label={`${name} — ${t("card.add")}`}
          >
            <IconShoppingCart size={12} stroke={1.75} aria-hidden />
            {t("card.add")}
          </button>
        </div>
      </div>
    </article>
  );
}
