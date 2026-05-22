import { Link, useNavigate } from "@tanstack/react-router";
import { navigateToHashSection } from "@/utils/navigateToHashSection";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";

const linkClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent px-2 text-[11px] font-medium uppercase tracking-wider text-foreground/55 underline-offset-4 transition-colors hover:text-cyan hover:underline";

export function VegaCatalogFooter() {
  const navigate = useNavigate();

  const goProducts = () => {
    navigateToHashSection(navigate, PRODUCT_CONFIGURATOR_HASH_ID);
  };

  return (
    <footer
      className="mt-auto border-t border-white/10 bg-[var(--bg-primary)]/95 py-10"
      style={{ fontFamily: "var(--font-main, 'Red Hat Display', sans-serif)" }}
    >
      <div className="container flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">Vega İklimlendirme</p>
          <p className="mt-1 text-xs text-foreground/55">Şişli, İstanbul</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Katalog alt bağlantılar">
          <Link to="/" className={linkClass}>
            Ana sayfa
          </Link>
          <button type="button" className={linkClass} onClick={goProducts}>
            Ürünler
          </button>
          <Link to="/dijital-ikiz" className={linkClass}>
            Dijital ikiz
          </Link>
          <Link to="/iletisim" className={linkClass}>
            İletişim
          </Link>
        </nav>
      </div>

      <p className="container mt-8 text-center text-[10px] uppercase tracking-widest text-foreground/40">
        © {new Date().getFullYear()} Vega İklimlendirme. Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
