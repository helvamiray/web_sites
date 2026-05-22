import { Link } from "@tanstack/react-router";

interface HeaderProps {
  className?: string;
}

/**
 * Breadcrumb row for the Digital Twin page (Turkish copy per spec).
 */
export function Header({ className }: HeaderProps) {
  return (
    <nav
      className={`flex flex-wrap items-center gap-2 text-xs text-[#94a3b8] ${className ?? ""}`}
      aria-label="İçerik yolu"
    >
      <Link to="/" className="transition-colors hover:text-[#cbd5e1] hover:underline">
        Ana sayfa
      </Link>
      <span aria-hidden>/</span>
      <span className="text-[#cbd5e1]">Dijital ikiz — 3D</span>
    </nav>
  );
}
