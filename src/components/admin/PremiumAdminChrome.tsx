import type { ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Cloudy,
  Cpu,
  Gauge,
  LayoutDashboard,
  Layers,
  LayoutGrid,
  LogOut,
  MapPinned,
  MessageSquare,
  Settings2,
  ShoppingCart,
  Sparkles,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { useInboxUnreadCount } from "@/hooks/useInboxUnreadCount";

import "@/styles/admin-premium-shell.css";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  match: (normalizedPath: string) => boolean;
};

const PRIMARY_NAV: NavItem[] = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (p) => p === "/admin",
  },
  {
    to: "/admin/urunler",
    label: "Ürünler",
    icon: LayoutGrid,
    match: (p) => p.startsWith("/admin/urunler"),
  },
  {
    to: "/admin/markalar",
    label: "Markalar",
    icon: Sparkles,
    match: (p) => p.startsWith("/admin/markalar"),
  },
  {
    to: "/admin/alt-kategoriler",
    label: "Alt Kategoriler",
    icon: Layers,
    match: (p) => p.startsWith("/admin/alt-kategoriler"),
  },
  {
    to: "/admin/siparisler",
    label: "Siparişler",
    icon: ShoppingCart,
    match: (p) => p.startsWith("/admin/siparisler"),
  },
  {
    to: "/admin/medya",
    label: "Medya Yönetimi",
    icon: Cloudy,
    match: (p) => p.startsWith("/admin/medya"),
  },
  {
    to: "/admin/homepage",
    label: "Ana Sayfa Yönetimi",
    icon: Cpu,
    match: (p) => p.startsWith("/admin/homepage"),
  },
  {
    to: "/admin/ayarlar",
    label: "Ayarlar",
    icon: Settings2,
    match: (p) => p.startsWith("/admin/ayarlar"),
  },
];

const TOOL_NAV: NavItem[] = [
  {
    to: "/admin/contact",
    label: "İletişim Kutusu",
    icon: Inbox,
    match: (p) => p.startsWith("/admin/contact"),
  },
  {
    to: "/admin/projects",
    label: "Proje Haritası",
    icon: MapPinned,
    match: (p) => p.startsWith("/admin/projects"),
  },
  {
    to: "/admin/scene",
    label: "Sahne Editörü",
    icon: Gauge,
    match: (p) => p.startsWith("/admin/scene"),
  },
];

const HEADER_META: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Komuta Köprüsü",
    subtitle: "Sistem vitrini ve katalog operasyonları",
  },
  "/admin/urunler": {
    title: "Ürün Yönetimi",
    subtitle: "Görseller, fiyat ve içerik — yerel olarak birleşik kataloga yansır",
  },
  "/admin/markalar": {
    title: "Marka Havuzları",
    subtitle: "Konfiguratör seçicilerine ek marka adları",
  },
  "/admin/alt-kategoriler": {
    title: "Alt Kategori Kontrolü",
    subtitle: "Marka bağlamında alt seçenek dizilerini özelleştir",
  },
  "/admin/siparisler": {
    title: "Sipariş Akışı",
    subtitle: "Operasyon bağlantıları için rezerve köprü",
  },
  "/admin/medya": {
    title: "Medya Kütüphanesi",
    subtitle: "Vitrin varlıkları ve ürün render arşivi",
  },
  "/admin/homepage": {
    title: "Ana Sayfa Senaryosu",
    subtitle: "Hero vitrinleri, Hakkımızda, ortaklık görünümü ve konfiguratör cephesi",
  },
  "/admin/ayarlar": {
    title: "Kontrol Senkronları",
    subtitle: "Oturum bilgisi ve CMS dışa / sıfırlama",
  },
  "/admin/contact": {
    title: "İletişim Kutusu",
    subtitle: "Gelen mesajlar ve talepler",
  },
  "/admin/projects": {
    title: "Proje Haritası",
    subtitle: "Bölgesel referansların konum bağlamı",
  },
  "/admin/scene": {
    title: "Sahne Yönlendirmesi",
    subtitle: "3D sahne araç yüzeyi",
  },
};

export function PremiumAdminChrome() {
  const pathnameRaw = useRouterState({ select: (s) => s.location.pathname });
  const pathname = pathnameRaw.replace(/\/$/, "") || "/";

  const { logout, username } = useAdminAuth();
  const inboxUnread = useInboxUnreadCount();

  const meta = HEADER_META[pathname] ?? {
    title: "VEGA Control",
    subtitle: "Mühendislik yüzeyi yönetimi",
  };

  return (
    <div className="admin-premium-root flex relative">
      <div className="admin-premium-grid" aria-hidden />
      <div className="admin-premium-veil" aria-hidden />

      <motion.aside
        className="admin-premium-sidebar"
        layout
        initial={false}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative z-[1] border-b border-[oklch(0.78_0.12_210/0.12)] px-5 py-7">
          <p className="admin-premium-brand">VEGA Mühendislik</p>
          <h2 className="mt-3 font-semibold tracking-tight text-[1rem] leading-tight text-white/95 font-[family-name:var(--font-sans)]">
            İklim Komuta Paneli
          </h2>
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="inline-flex rounded-full border border-[oklch(0.78_0.14_210/0.25)] bg-[oklch(0.16_0.04_260/0.5)] px-3 py-1 text-[11px] font-medium tracking-wide text-[oklch(0.86_0.1_205)]">
              Otorize oturum
            </span>
            {username ? (
              <span className="text-[11px] text-white/50 tracking-wide truncate max-w-[9rem]" title={username}>
                @{username}
              </span>
            ) : null}
          </div>
        </div>

        <nav className="relative z-[1] flex flex-1 flex-col gap-1 px-3 py-4 overflow-y-auto" aria-label="Ana navigasyon">
          {PRIMARY_NAV.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={to}
                to={to}
                className={`admin-premium-nav-link${active ? " is-active" : ""}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative z-[1] border-t border-[oklch(0.78_0.12_210/0.14)] px-3 pt-4 pb-2 space-y-1">
          <p className="px-3 text-[10px] uppercase tracking-[0.22em] text-white/38 font-medium">
            Araçlar
          </p>
          {TOOL_NAV.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname);
            const badge = to === "/admin/contact" && inboxUnread > 0;
            return (
              <Link
                key={to}
                to={to}
                className={`admin-premium-nav-link${active ? " is-active" : ""}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                <span className="flex-1 min-w-0">{label}</span>
                {badge ? (
                  <span
                    className="shrink-0 rounded-full bg-[oklch(0.78_0.18_75)] px-1.5 py-0.5 text-[10px] font-bold text-black"
                    aria-label={`Okunmamış: ${inboxUnread}`}
                  >
                    {inboxUnread > 99 ? "99+" : inboxUnread}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="relative z-[1] mt-auto border-t border-[oklch(0.78_0.12_210/0.14)] p-3">
          <Link
            to="/"
            className="admin-premium-nav-link mb-1"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span>Siteye dön</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="admin-premium-nav-link w-full text-left text-white/55 hover:text-white/90"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span>Çıkış</span>
          </button>
        </div>
      </motion.aside>

      <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[oklch(0.78_0.12_210/0.18)] px-8 py-6 backdrop-blur-md bg-[oklch(0.085_0.035_260/0.45)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[oklch(0.78_0.12_205/0.8)] mb-2">
                Yönlendirilmiş kontrol yüzeyi
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white font-[family-name:var(--font-sans)]">
                {meta.title}
              </h1>
              <p className="mt-1.5 text-sm text-white/55 max-w-2xl leading-relaxed">{meta.subtitle}</p>
            </div>
          </div>
        </header>

        <main className="relative z-[1] flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

interface PlaceholderOutletProps {
  children: ReactNode;
}

/** Login gibi Outlet kullanmayan tam ekran sayfalar için. */
export function PremiumAdminStandalone({ children }: PlaceholderOutletProps) {
  return <>{children}</>;
}
