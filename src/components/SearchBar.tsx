import { Search } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  id = "twin-product-search",
  className,
}: SearchBarProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]"
        aria-hidden
      />
      <label htmlFor={id} className="sr-only">
        Ürün ara
      </label>
      <input
        id={id}
        type="search"
        autoComplete="off"
        placeholder="Ürün ara: kombi, klima, ısı pompası..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md placeholder:text-[#94a3b8] focus:border-[#3b82f6]/60 focus:ring-2 focus:ring-[#3b82f6]/25"
      />
    </div>
  );
}
