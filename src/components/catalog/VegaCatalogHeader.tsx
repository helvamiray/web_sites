import { Link, useNavigate } from "@tanstack/react-router";
import { navigateToHashSection } from "@/utils/navigateToHashSection";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";

const navBtn =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent px-3 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

export function VegaCatalogHeader() {
  const navigate = useNavigate();

  const goProducts = () => {
    navigateToHashSection(navigate, PRODUCT_CONFIGURATOR_HASH_ID);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg-primary)]/90 backdrop-blur-md"
      style={{ fontFamily: "var(--font-main, 'Red Hat Display', sans-serif)" }}
    >
      <div className="container flex flex-wrap items-center justify-between gap-3 py-3 md:py-4">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground transition-colors hover:text-cyan"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--cyber-green, #00ff88)" }}
          />
          <span>Vega İklimlendirme</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 md:gap-2" aria-label="Katalog üst menü">
          <Link to="/" className={navBtn}>
            Ana sayfa
          </Link>
          <button type="button" className={navBtn} onClick={goProducts}>
            Ürünler
          </button>
          <Link to="/dijital-ikiz" className={`${navBtn} text-cyan`} aria-current="page">
            Dijital ikiz
          </Link>
          <Link to="/iletisim" className={navBtn}>
            İletişim
          </Link>
        </nav>
      </div>
    </header>
  );
}
