import { ExternalLink, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resolveTwinProductId } from "@/data/twinProductBridge";
import { useCart } from "@/providers/CartContext";
import type { TwinConfiguratorProduct } from "@/types";

export interface ProductCardProps {
  product: TwinConfiguratorProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { add, openCart } = useCart();

  const handleAddToCart = () => {
    const resolved = resolveTwinProductId(product.id);
    if (!resolved) {
      toast.error("Ürün sepette kullanılamıyor", {
        description: "Bu öğe için katalog eşlemesi tanımlı değil.",
      });
      return;
    }
    add(resolved, 1);
    openCart();
    toast.success("Sepete eklendi", {
      description: `${resolved.name}`,
    });
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <a
        href={product.href}
        className="absolute right-3 top-3 rounded-md p-1.5 text-[#94a3b8] transition-colors hover:bg-white/10 hover:text-white"
        aria-label={`Dış bağlantı: ${product.name}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <ExternalLink className="size-4" aria-hidden />
      </a>

      <div className="flex items-center gap-4 pr-8">
        <div className="size-[60px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <img
            src={product.imageUrl}
            alt=""
            width={60}
            height={60}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#06b6d4]">
            {product.brandDisplay}
          </p>
          <h3 className="mt-1 text-base font-medium leading-snug text-white">{product.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">
            {product.tags.map((tag, i) => (
              <span key={tag.id} className="inline-flex flex-wrap items-center gap-1">
                {i > 0 ? <span aria-hidden>·</span> : null}
                {tag.emphasis ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-[#f59e0b]" aria-hidden />
                    {tag.label}
                  </span>
                ) : (
                  tag.label
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
      >
        <ShoppingCart className="size-4" aria-hidden />
        SEPETE EKLE
      </button>
    </article>
  );
}
