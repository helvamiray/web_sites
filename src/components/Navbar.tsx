import { useState, useEffect, useCallback, useMemo, type MouseEvent } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { IconMenu2, IconTopologyStarRing3 } from "@tabler/icons-react";
import { useReducedMotion, motion } from "framer-motion";
import { ShoppingCart, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { Drawer, DrawerHeader, DrawerItems, drawerTheme } from "flowbite-react";
import { twMerge } from "tailwind-merge";

import { useCart } from "@/providers/CartContext";
import { navigateToHashSection } from "@/utils/navigateToHashSection";
import { PRODUCT_CONFIGURATOR_HASH_ID } from "@/constants/landingSections";
import { VEGA_CONTACTS, VEGA_SOCIAL_HREF } from "@/utils/contacts";

type CinematicNavKey =
  | "home"
  | "teknoloji"
  | "hakkimizda"
  | "dijital-ikiz"
  | "urunler"
  | "projeler"
  | "iletisim";

type CinematicNavItem =
  | {
      key: CinematicNavKey;
      label: string;
      kind: "home";
    }
  | {
      key: CinematicNavKey;
      label: string;
      kind: "hash";
      hash: string;
    }
  | {
      key: CinematicNavKey;
      label: string;
      kind: "route";
      path: string;
    };

const CINEMATIC_NAV_ITEMS: readonly CinematicNavItem[] = [
  { key: "home", label: "Ana Sayfa", kind: "home" },
  { key: "teknoloji", label: "Teknoloji", kind: "hash", hash: PRODUCT_CONFIGURATOR_HASH_ID },
  { key: "hakkimizda", label: "Hakkımızda", kind: "hash", hash: "hakkimizda" },
  { key: "dijital-ikiz", label: "Dijital İkiz", kind: "route", path: "/dijital-ikiz" },
  { key: "urunler", label: "Ürünler", kind: "hash", hash: PRODUCT_CONFIGURATOR_HASH_ID },
  { key: "projeler", label: "Projelerimiz", kind: "hash", hash: "projeler" },
  { key: "iletisim", label: "İletişim", kind: "hash", hash: "iletisim" },
] as const;

const TEL_HREF = `tel:${VEGA_CONTACTS.phone.replace(/\s/g, "")}`;
const MAIL_HREF = `mailto:${VEGA_CONTACTS.email}`;

function buildVegaDrawerTheme(isLight: boolean, premiumIndustrial = false) {
  if (premiumIndustrial && !isLight) {
    const panelBase = `${drawerTheme.root.base} z-[140] !max-w-[min(100vw,22rem)] w-[min(100vw,22rem)] !backdrop-blur-xl !border-l !border-white/20 !p-0 shadow-2xl !bg-[rgba(26,35,126,0.94)]`;
    const backdrop = "fixed inset-0 z-[135] bg-[#0d1638]/55 backdrop-blur-md";
    const titleText = `${drawerTheme.header.inner.titleText} !mb-0 flex w-full items-center border-b border-white/20 px-4 py-4 text-lg font-bold tracking-wide text-white`;
    const closeButton = `${drawerTheme.header.inner.closeButton} !text-white hover:!bg-white/10 hover:!text-white`;
    const titleIcon = "me-2.5 h-4 w-4 shrink-0 text-white";
    const closeIcon = "h-4 w-4 shrink-0 text-white";

    return {
      ...drawerTheme,
      root: {
        ...drawerTheme.root,
        base: panelBase,
        backdrop,
      },
      header: {
        ...drawerTheme.header,
        inner: {
          ...drawerTheme.header.inner,
          titleText,
          closeButton,
          titleIcon,
          closeIcon,
        },
      },
    };
  }

  if (premiumIndustrial && isLight) {
    const panelBase = `${drawerTheme.root.base} z-[140] !max-w-[min(100vw,22rem)] w-[min(100vw,22rem)] !backdrop-blur-xl !border-l !border-zinc-200/95 !p-0 shadow-2xl !bg-white`;
    const backdrop = "fixed inset-0 z-[135] bg-black/25 backdrop-blur-sm";
    const titleText = `${drawerTheme.header.inner.titleText} !mb-0 flex w-full items-center border-b border-zinc-200 px-4 py-4 text-lg font-bold tracking-wide text-zinc-900`;
    const closeButton = `${drawerTheme.header.inner.closeButton} !text-zinc-700 hover:!bg-zinc-100 hover:!text-zinc-950`;
    const titleIcon = "me-2.5 h-4 w-4 shrink-0 text-zinc-900";
    const closeIcon = "h-4 w-4 shrink-0 text-zinc-800";

    return {
      ...drawerTheme,
      root: {
        ...drawerTheme.root,
        base: panelBase,
        backdrop,
      },
      header: {
        ...drawerTheme.header,
        inner: {
          ...drawerTheme.header.inner,
          titleText,
          closeButton,
          titleIcon,
          closeIcon,
        },
      },
    };
  }

  const panelBase = `${drawerTheme.root.base} z-[140] !max-w-[min(100vw,22rem)] w-[min(100vw,22rem)] !backdrop-blur-xl !border-l !p-0 shadow-2xl`;
  const panel = isLight
    ? `${panelBase} !bg-white !border-zinc-200/95`
    : `${panelBase} !bg-black/95 !border-white/10`;
  const backdrop = isLight
    ? "fixed inset-0 z-[135] bg-black/30 backdrop-blur-sm"
    : "fixed inset-0 z-[135] bg-black/55 backdrop-blur-xl";
  const titleText = isLight
    ? `${drawerTheme.header.inner.titleText} !mb-0 flex w-full items-center border-b border-zinc-200 px-4 py-4 text-lg font-bold tracking-wide text-zinc-900`
    : `${drawerTheme.header.inner.titleText} !mb-0 flex w-full items-center border-b border-white/10 px-4 py-4 text-lg font-bold tracking-wide text-white`;
  const closeButton = isLight
    ? `${drawerTheme.header.inner.closeButton} !text-zinc-700 hover:!bg-zinc-100 hover:!text-zinc-950`
    : `${drawerTheme.header.inner.closeButton} !text-slate-300 hover:!bg-white/10 hover:!text-white`;
  const titleIcon = isLight
    ? "me-2.5 h-4 w-4 shrink-0 text-zinc-900"
    : "me-2.5 h-4 w-4 shrink-0 text-white";
  const closeIcon = isLight ? "h-4 w-4 shrink-0 text-zinc-800" : "h-4 w-4 shrink-0 text-slate-200";

  return {
    ...drawerTheme,
    root: {
      ...drawerTheme.root,
      base: panel,
      backdrop,
    },
    header: {
      ...drawerTheme.header,
      inner: {
        ...drawerTheme.header.inner,
        titleText,
        closeButton,
        titleIcon,
        closeIcon,
      },
    },
  };
}

/** Studio Vega — luxury OS-style drawer (homepage premium shell only). */
function buildCinematicDrawerTheme() {
  const basePanel = twMerge(
    drawerTheme.root.base,
    "z-[140] !max-w-none !w-[min(100vw,22.5rem)] !p-0 !shadow-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] vega-cine-drawer",
  );
  const backdrop = twMerge("fixed inset-0 z-[135] vega-cine-drawer__backdrop");

  return {
    ...drawerTheme,
    root: {
      ...drawerTheme.root,
      base: basePanel,
      backdrop,
      position: {
        ...drawerTheme.root.position,
        left: {
          on: "left-0 top-0 h-screen w-[min(100vw,22.5rem)] max-w-[100vw] translate-x-0",
          off: "left-0 top-0 h-screen w-[min(100vw,22.5rem)] max-w-[100vw] -translate-x-full",
        },
      },
    },
    header: {
      ...drawerTheme.header,
      inner: {
        ...drawerTheme.header.inner,
        titleText: "sr-only",
        titleIcon: "hidden",
        closeButton: twMerge(
          drawerTheme.header.inner.closeButton,
          "!static vega-cine-drawer__close !h-auto !w-auto !rounded-xl !p-0 !bg-transparent hover:!bg-transparent hover:!text-inherit dark:hover:!bg-transparent",
        ),
        closeIcon: "!h-5 !w-5 shrink-0 opacity-95",
      },
    },
    items: {
      ...drawerTheme.items,
      base: twMerge(drawerTheme.items.base, "flex min-h-0 flex-1 flex-col !p-0"),
    },
  };
}

function VegaLogoMark() {
  return (
    <>
      <span
        aria-hidden="true"
        className="flex-shrink-0 rounded-full"
        style={{
          width: "7px",
          height: "7px",
          background: "var(--me-accent, #57dfff)",
        }}
      />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <polygon
          points="16,3 29,27 3,27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <polygon points="16,11 23,24 9,24" fill="currentColor" opacity="0.35" />
      </svg>
      <div className="grav-nav-wordmark">
        <span
          className="grav-nav-brand"
          style={{
            fontFamily: "var(--font-premium-display)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Vega
        </span>
        <span
          className="grav-nav-sub"
          style={{
            fontFamily: "var(--font-premium-display)",
            letterSpacing: "0.01em",
          }}
        >
          İklimlendirme
        </span>
      </div>
    </>
  );
}

function VegaEnerjiNavLogoImg() {
  return (
    <img
      src="/img/14.png"
      alt="Vega Enerji"
      className="grav-nav-vega-enerji-img block h-9 w-auto max-w-[min(44vw,11rem)] object-contain object-left sm:h-10"
      decoding="async"
      fetchPriority="high"
    />
  );
}

function isNavItemActive(
  pathname: string,
  hash: string,
  item: CinematicNavItem,
): boolean {
  const normalizedHash = hash || "";

  if (item.kind === "home") {
    return pathname === "/" && normalizedHash === "";
  }
  if (item.kind === "route") {
    return pathname === item.path;
  }
  return pathname === "/" && normalizedHash === `#${item.hash}`;
}

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash ?? "" });
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { count, openCart } = useCart();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const useVegaEnerjiBrand = pathname === "/";
  const premiumIndustrial = pathname === "/";
  const isLight = false;
  const piDarkDrawer = premiumIndustrial && !isLight;

  const drawerNavBtn = useMemo(
    () =>
      piDarkDrawer
        ? "w-full rounded-lg px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
        : isLight
          ? "w-full rounded-lg px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-zinc-900 transition-colors hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/35"
          : "w-full rounded-lg px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-white transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45",
    [isLight, piDarkDrawer],
  );

  const cinematicDrawerTheme = useMemo(() => buildCinematicDrawerTheme(), []);
  const vegaDrawerTheme = useMemo(
    () => buildVegaDrawerTheme(isLight, premiumIndustrial),
    [isLight, premiumIndustrial],
  );

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  const goHomeAndClose = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate({ to: "/" });
    closeDrawer();
  };

  const goHashAndClose = (id: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateToHashSection(navigate, id);
    closeDrawer();
  };

  const itemVariants = useMemo(() => {
    const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
    return {
      hidden: prefersReducedMotion
        ? { opacity: 1, x: 0 }
        : { opacity: 0, x: -12 },
      visible: prefersReducedMotion
        ? (_i: number) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0, delay: 0 },
          })
        : (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
              delay: 0.05 * i + 0.12,
              duration: 0.48,
              ease,
            },
          }),
    };
  }, [prefersReducedMotion]);

  return (
    <nav
      className={`grav-navbar lux-navbar-cinematic${scrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label="Ana navigasyon"
    >
      <Link
        to="/"
        className="grav-nav-logo min-w-0"
        aria-label={useVegaEnerjiBrand ? "Vega Enerji Ana Sayfa" : "Vega İklimlendirme Ana Sayfa"}
        preload="intent"
        preloadDelay={0}
        onClick={() => {
          if (isOpen) closeDrawer();
        }}
      >
        {useVegaEnerjiBrand ? <VegaEnerjiNavLogoImg /> : <VegaLogoMark />}
      </Link>

      <div className="grav-nav-actions shrink-0">
        <button className="grav-nav-cart" onClick={openCart} aria-label={`Sepet — ${count} ürün`}>
          <ShoppingCart size={18} />
          {count > 0 && (
            <span className="grav-cart-badge" aria-hidden="true">
              {count}
            </span>
          )}
        </button>
        <button
          type="button"
          className="grav-nav-cta lux-cinematic-target"
          onClick={() => navigateToHashSection(navigate, "iletisim")}
          aria-label="Teklif Al — İletişim bölümüne git"
        >
          Teklif Al
        </button>
        <button
          type="button"
          className={`flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 ${piDarkDrawer ? "text-white hover:bg-white/10 focus-visible:ring-white/40" : isLight ? "text-zinc-900 hover:bg-black/[0.06] focus-visible:ring-zinc-400/50" : "text-white hover:bg-white/10 focus-visible:ring-white/40"}`}
          aria-expanded={isOpen}
          aria-controls="vega-flowbite-drawer"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <IconMenu2 size={28} stroke={1.75} className="shrink-0" aria-hidden />
        </button>
      </div>

      {premiumIndustrial ? (
        <Drawer
          id="vega-flowbite-drawer"
          open={isOpen}
          onClose={closeDrawer}
          position="left"
          theme={cinematicDrawerTheme}
          key="vega-cine-drawer"
          className="outline-none"
        >
          <DrawerHeader title="Menü" className="vega-cine-drawer__header" />
          <DrawerItems className="vega-cine-drawer__items">
            <div className="vega-cine-drawer__layers" aria-hidden />
            <div className="vega-cine-drawer__particles" aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <svg
              className="vega-cine-drawer__schematic"
              viewBox="0 0 400 220"
              preserveAspectRatio="xMidYMax slice"
              aria-hidden
            >
              <path
                d="M0 150 H400 M48 40 V190 M200 24 V200 M320 60 V180"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                opacity="0.9"
              />
              <path
                d="M80 80 H280 M80 100 H240 M100 120 H260"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="3 5"
                opacity="0.75"
              />
              <circle cx="200" cy="150" r="36" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            </svg>

            <div className="vega-cine-drawer__scroll">
              <div className="vega-cine-drawer__brand">
                <p className="vega-cine-drawer__brand-kicker">Studio Vega</p>
                <p className="vega-cine-drawer__brand-title">
                  <span className="vega-cine-drawer__brand-line">Engineering</span>
                  <span className="vega-cine-drawer__brand-line"> the atmosphere.</span>
                </p>
                <p className="vega-cine-drawer__brand-tag">Digital Climate Systems</p>
              </div>

              <Link
                to="/dijital-ikiz"
                preload="intent"
                className="vega-cine-drawer__twin"
                onClick={() => closeDrawer()}
              >
                <span className="vega-cine-drawer__twin-shimmer" aria-hidden />
                <span className="vega-cine-drawer__twin-inner relative z-[1]">
                  <span>
                    <span className="vega-cine-drawer__twin-label">Exclusive</span>
                    <span className="vega-cine-drawer__twin-title">Digital Twin Access</span>
                  </span>
                  <span className="vega-cine-drawer__twin-glyph" aria-hidden>
                    <IconTopologyStarRing3 size={20} stroke={1.35} />
                  </span>
                </span>
              </Link>

              <nav aria-label="Sayfa bağlantıları">
                <ul className="vega-cine-nav">
                  {CINEMATIC_NAV_ITEMS.map((item, i) => {
                    const active = isNavItemActive(pathname, hash, item);
                    const className = `vega-cine-nav__link${active ? " is-active" : ""}`;

                    if (item.kind === "home") {
                      return (
                        <motion.li
                          key={item.key}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate={isOpen ? "visible" : "hidden"}
                        >
                          <Link
                            to="/"
                            preload="intent"
                            className={className}
                            onClick={goHomeAndClose}
                            aria-current={active ? "page" : undefined}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      );
                    }
                    if (item.kind === "route") {
                      return (
                        <motion.li
                          key={item.key}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate={isOpen ? "visible" : "hidden"}
                        >
                          <Link
                            to={item.path}
                            preload="intent"
                            className={className}
                            onClick={() => closeDrawer()}
                            aria-current={active ? "page" : undefined}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      );
                    }
                    return (
                      <motion.li
                        key={item.key}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate={isOpen ? "visible" : "hidden"}
                      >
                        <a
                          href={`/#${item.hash}`}
                          className={className}
                          onClick={(e) => goHashAndClose(item.hash, e)}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <footer className="vega-cine-drawer__footer">
              <p className="vega-cine-drawer__footer-label">Bağlantı</p>
              <div className="vega-cine-drawer__social">
                <a
                  href={VEGA_SOCIAL_HREF.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vega-cine-drawer__pill"
                >
                  <Instagram aria-hidden className="shrink-0" strokeWidth={1.5} />
                  Instagram
                </a>
                <a
                  href={VEGA_SOCIAL_HREF.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vega-cine-drawer__pill"
                >
                  <Linkedin aria-hidden className="shrink-0" strokeWidth={1.5} />
                  LinkedIn
                </a>
                <a href={MAIL_HREF} className="vega-cine-drawer__pill">
                  <Mail aria-hidden className="shrink-0" strokeWidth={1.5} />
                  Mail
                </a>
                <a href={TEL_HREF} className="vega-cine-drawer__pill">
                  <Phone aria-hidden className="shrink-0" strokeWidth={1.5} />
                  Phone
                </a>
              </div>
            </footer>
          </DrawerItems>
        </Drawer>
      ) : (
        <Drawer
          id="vega-flowbite-drawer"
          open={isOpen}
          onClose={closeDrawer}
          position="right"
          theme={vegaDrawerTheme}
          key="std-drawer"
          className="outline-none"
        >
          <DrawerHeader title="Menü" />
          <DrawerItems className="overflow-y-auto px-3 pb-8 pt-2">
            <nav className="flex flex-col gap-2" aria-label="Sayfa bağlantıları">
              <Link
                to="/"
                preload="intent"
                preloadDelay={0}
                className={drawerNavBtn}
                onClick={goHomeAndClose}
              >
                ANASAYFA
              </Link>
              <a
                href={`/#${PRODUCT_CONFIGURATOR_HASH_ID}`}
                className={drawerNavBtn}
                onClick={(e) => goHashAndClose(PRODUCT_CONFIGURATOR_HASH_ID, e)}
              >
                TEKNOLOJİ
              </a>
              <a href="/#hakkimizda" className={drawerNavBtn} onClick={(e) => goHashAndClose("hakkimizda", e)}>
                HAKKIMIZDA
              </a>
              <Link
                to="/dijital-ikiz"
                preload="intent"
                preloadDelay={0}
                className={drawerNavBtn}
                onClick={() => closeDrawer()}
              >
                DİJİTAL İKİZ
              </Link>
              <button
                type="button"
                className={drawerNavBtn}
                onClick={() => {
                  navigateToHashSection(navigate, PRODUCT_CONFIGURATOR_HASH_ID);
                  closeDrawer();
                }}
              >
                ÜRÜNLER
              </button>
              <a href="/#projeler" className={drawerNavBtn} onClick={(e) => goHashAndClose("projeler", e)}>
                PROJELERİMİZ
              </a>
              <a href="/#iletisim" className={drawerNavBtn} onClick={(e) => goHashAndClose("iletisim", e)}>
                İLETİŞİM
              </a>
            </nav>
          </DrawerItems>
        </Drawer>
      )}
    </nav>
  );
}

export default Navbar;
