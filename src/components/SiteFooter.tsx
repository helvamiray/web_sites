import { Link, useNavigate } from "@tanstack/react-router";
import type { MouseEvent } from "react";

import { navigateToHashSection } from "@/utils/navigateToHashSection";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";

const FOOTER_LINKS: { label: string; to?: string; hash?: string }[] = [
  { label: "Anasayfa", to: "/" },
  { label: "Teknoloji", hash: PRODUCT_CONFIGURATOR_HASH_ID },
  { label: "Ürünler", hash: PRODUCT_CONFIGURATOR_HASH_ID },
  { label: "Hakkımızda", hash: "hakkimizda" },
  { label: "İletişim", hash: "iletisim" },
];

export function SiteFooter() {
  const navigate = useNavigate();

  const onHashClick = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    navigateToHashSection(navigate, hash);
  };

  return (
    <footer className="site-footer hp-cinematic-footer midnight-section midnight-section--footer">
      <div className="hp-footer__inner">
        <div className="hp-footer__grid">
          <div>
            <p className="hp-footer__brand-title">Vega İklimlendirme</p>
            <p className="hp-footer__brand-tag">Premium mühendislik stüdyosu</p>
            <p className="hp-footer__location">Şişli, İstanbul</p>
          </div>

          <nav aria-label="Footer navigasyon">
            <ul className="hp-footer__nav-list">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="hp-footer__link">
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={`/#${link.hash}`}
                      className="hp-footer__link"
                      onClick={(e) => link.hash && onHashClick(e, link.hash)}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hp-footer__rule" aria-hidden />

        <p className="hp-footer__copy">
          © {new Date().getFullYear()} Vega İklimlendirme · Şişli, İstanbul · Tüm hakları saklıdır
        </p>
      </div>
    </footer>
  );
}
