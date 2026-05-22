import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import {
  productService,
  type AdminProduct,
  type ProductCurrency,
  type ProductSpec,
} from "@/lib/adminProductService";
import { CATEGORY_LABEL, PRODUCTS, type ProductCategory } from "@/data/products";
import { getAdminMergedProductRows, normalizeProductCategory, subscribeVegaProductCatalog } from "@/lib/productService";
import { setStoredProductOrder } from "@/lib/productCatalogOrder";

type FormState = {
  name: string;
  nameEn: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  price: string;
  currency: ProductCurrency;
  images: string[];
  specs: ProductSpec[];
  inStock: boolean;
  featured: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  nameEn: "",
  slug: "",
  category: "klima",
  brand: "",
  description: "",
  descriptionEn: "",
  shortDescription: "",
  price: "",
  currency: "TRY",
  images: [],
  specs: [{ key: "", value: "" }],
  inStock: true,
  featured: false,
});

const slugifyValue = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Türkçe ondalık virgülü ve boşlukları tolere eder; geçersizse undefined. */
function parsePriceInput(raw: string): number | undefined {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (normalized === "") return undefined;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

function fallbackSlug(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `urun-${crypto.randomUUID().slice(0, 10)}`;
  }
  return `urun-${Date.now()}`;
}

const toFormState = (product: AdminProduct): FormState => ({
  name: product.name,
  nameEn: product.nameEn ?? "",
  slug: product.slug,
  category: normalizeProductCategory(product.category),
  brand: product.brand,
  description: product.description,
  descriptionEn: product.descriptionEn ?? "",
  shortDescription: product.shortDescription,
  price: typeof product.price === "number" ? String(product.price) : "",
  currency: product.currency ?? "TRY",
  images: product.images,
  specs: product.specs.length > 0 ? product.specs : [{ key: "", value: "" }],
  inStock: product.inStock,
  featured: product.featured,
});

const formatMoney = (price?: number, currency?: ProductCurrency) => {
  if (typeof price !== "number") return "—";
  if (currency === "USD") return `$${price.toLocaleString("en-US")}`;
  if (currency === "EUR") return `EUR ${price.toLocaleString("de-DE")}`;
  return `₺ ${price.toLocaleString("tr-TR")}`;
};

function reorderMergedIds(rows: readonly AdminProduct[], draggedId: string, targetId: string): string[] {
  const ids = rows.map((p) => p.id);
  const fromIdx = ids.indexOf(draggedId);
  const toIdx = ids.indexOf(targetId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return ids;
  const next = [...ids];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const refresh = useCallback(() => setProducts(getAdminMergedProductRows()), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    refresh();
    return subscribeVegaProductCatalog(refresh);
  }, [refresh]);

  const categories = useMemo(() => {
    const all = new Set<string>();
    products.forEach((p) => all.add(p.category));
    return Array.from(all).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (!q) return true;
      return `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q);
    });
  }, [products, search, categoryFilter]);

  const reorderEnabled =
    typeof window !== "undefined" &&
    search.trim() === "" &&
    categoryFilter === "all";

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setForm(toFormState(product));
    setError(null);
    setFormOpen(true);
  };

  const validate = () => {
    if (!form.name.trim()) return "Ürün adı gerekli";
    if (!form.brand.trim()) return "Marka gerekli";
    if (!form.description.trim()) return "Açıklama gerekli";
    if (form.price.trim() !== "") {
      const p = parsePriceInput(form.price);
      if (p === undefined) return "Geçerli bir fiyat girin (örn. 12999 veya 12999,99)";
    }
    return null;
  };

  const handleSave = () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    const slugCandidate = form.slug.trim() || slugifyValue(form.name);
    const slug = slugCandidate || fallbackSlug();

    const parsedPrice = parsePriceInput(form.price);

    const payload = {
      name: form.name.trim(),
      nameEn: form.nameEn.trim() || undefined,
      slug,
      category: form.category,
      brand: form.brand.trim(),
      description: form.description.trim(),
      descriptionEn: form.descriptionEn.trim() || undefined,
      shortDescription: form.shortDescription.trim(),
      price: parsedPrice,
      currency: form.currency,
      images: form.images,
      specs: form.specs.filter((s) => s.key.trim() || s.value.trim()),
      inStock: form.inStock,
      featured: form.featured,
    };

    try {
      const catalogHomepageId =
        editingId != null && PRODUCTS.some((hp) => hp.id === editingId);

      if (editingId) {
        const stored = productService.getById(editingId);
        if (stored) {
          productService.update(editingId, payload);
        } else if (catalogHomepageId) {
          productService.upsertCatalogProduct(editingId, payload);
        } else {
          productService.update(editingId, payload);
        }
      } else {
        productService.create(payload);
      }
      setError(null);
      refresh();
      setFormOpen(false);
      setEditingId(null);
    } catch (err: unknown) {
      console.error(err);
      const isQuota = err instanceof DOMException && err.name === "QuotaExceededError";
      const isSecurity = err instanceof DOMException && err.name === "SecurityError";
      const msg =
        isQuota || (err instanceof Error && /quota/i.test(err.message))
          ? "Tarayıcı deposu doldu. Görselleri azaltın veya daha küçük dosya kullanın (yerel depolama ~5 MB)."
          : isSecurity
            ? "Tarayıcı yerel depoya yazmayı engelledi. Çerezleri / site verisini kontrol edin."
            : err instanceof Error
              ? err.message
              : "Kayıt sırasında beklenmeyen bir hata oluştu.";
      setError(msg);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const converted = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result ?? ""));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );

    setForm((prev) => ({ ...prev, images: [...prev.images, ...converted] }));
    event.target.value = "";
  };

  return (
    <>
      <section className="space-y-6 p-6 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim, marka veya kategori ara..."
              className="min-w-48 flex-1 rounded-xl border border-white/14 bg-black/35 px-4 py-3 text-[15px] text-white outline-none backdrop-blur-sm placeholder:text-white/35 focus:border-[oklch(0.72_0.16_205/0.6)] transition-colors font-[family-name:var(--font-sans)]"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-white/14 bg-black/35 px-4 py-3 text-[15px] text-white backdrop-blur-sm focus:border-[oklch(0.72_0.16_205/0.5)] outline-none cursor-pointer font-[family-name:var(--font-sans)]"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[normalizeProductCategory(c)]?.tr ?? c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={openCreate}
              className="admin-premium-pill-btn"
            >
              Yeni Ürün
            </button>
          </div>

          {!reorderEnabled ? (
            <p className="text-xs text-white/45 tracking-wide">
              Liste sırası için aramayı temizleyin ve tüm kategorileri seçin — ardından sürükleyin.
            </p>
          ) : (
            <p className="text-xs text-[oklch(0.78_0.1_205/0.8)] tracking-wide uppercase">
              Sürükle-bırak ile katalog birleştirilmiş sırası güncellenir.
            </p>
          )}

          <motion.div
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {filtered.map((p) => (
              <motion.div
                layout
                key={p.id}
                draggable={reorderEnabled}
                onDragStart={() => setDragId(p.id)}
                onDragOver={(ev) => {
                  if (!reorderEnabled || !dragId) return;
                  ev.preventDefault();
                }}
                onDrop={(ev) => {
                  ev.preventDefault();
                  if (!reorderEnabled || !dragId || dragId === p.id) {
                    setDragId(null);
                    return;
                  }
                  const ordered = reorderMergedIds(products, dragId, p.id);
                  setStoredProductOrder(ordered);
                  setDragId(null);
                  refresh();
                }}
                className={`admin-premium-glass-panel group/card relative overflow-hidden rounded-2xl cursor-default ${
                  reorderEnabled ? "cursor-grab active:cursor-grabbing" : ""
                }`}
              >
                <div className="absolute inset-x-4 top-3 flex justify-between gap-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/42">
                    {reorderEnabled ? (
                      <>
                        <GripVertical className="h-4 w-4 shrink-0 text-[oklch(0.78_0.1_205/0.7)]" />
                        sıra
                      </>
                    ) : null}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      className="rounded-lg border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white/76 hover:border-[oklch(0.72_0.16_205/0.5)] hover:text-white transition-colors"
                      onClick={() => openEdit(p)}
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
                        productService.delete(p.id);
                        refresh();
                      }}
                      className="rounded-lg border border-red-400/35 bg-transparent px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-red-300/95 hover:bg-red-500/10 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <div className="p-6 pt-12 space-y-4">
                  <div className="flex gap-5">
                    <div className="relative h-[4.85rem] w-[4.85rem] shrink-0 rounded-xl border border-white/12 overflow-hidden bg-black/55">
                      {p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          decoding="async"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] uppercase text-white/38">
                          Görsel yok
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 space-y-1.5 pt-2">
                      <h3 className="text-[15px] font-semibold text-white tracking-tight line-clamp-2 font-[family-name:var(--font-sans)]">
                        {p.name}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.16em] text-[oklch(0.78_0.1_205)]">
                        {p.brand}
                      </p>
                      <span className="inline-flex rounded-full border border-white/12 px-3 py-0.5 text-[10px] font-medium uppercase text-white/50">
                        {CATEGORY_LABEL[normalizeProductCategory(p.category)]?.tr ?? p.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] text-white/55 line-clamp-3 leading-snug">{p.shortDescription}</p>
                  <div className="flex justify-between gap-3 text-[12px] text-white/60 font-[family-name:var(--font-sans)]">
                    <span>{formatMoney(p.price, p.currency)}</span>
                    <span className={p.inStock ? "text-[oklch(0.78_0.12_205)]" : "text-amber-300/95"}>
                      {p.inStock ? "Stok · aktif" : "Stok dışı"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 ? (
              <div className="col-span-full admin-premium-glass-panel px-12 py-16 rounded-2xl text-center">
                <p className="text-white/54">Ürün bulunamadı.</p>
              </div>
            ) : null}
          </motion.div>
        </section>
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {editingId ? "Ürünü Düzenle" : "Yeni Ürün"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm text-white/70">Ad (TR) *</span>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      ...(!editingId ? { slug: slugifyValue(e.target.value) } : {}),
                    }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Ad (EN)</span>
                <input
                  value={form.nameEn}
                  onChange={(e) => setForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="Boşsa TR adı kullanılır"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">URL slug</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugifyValue(e.target.value) }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Katalog kategorisi *</span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value as ProductCategory }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                >
                  {(Object.keys(CATEGORY_LABEL) as ProductCategory[]).map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_LABEL[key].tr} — {CATEGORY_LABEL[key].en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Marka *</span>
                <input
                  value={form.brand}
                  onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Kısa açıklama</span>
                <input
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Açıklama (TR) *</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Açıklama (EN)</span>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => setForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="Boşsa TR açıklama kullanılır"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Fiyat</span>
                <input
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  type="number"
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Para birimi</span>
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, currency: e.target.value as ProductCurrency }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-white/70">Görseller</div>
                <p className="text-xs text-white/50">
                  Bilgisayarınızdan bir veya birden fazla görsel seçin (JPEG, PNG, WebP, GIF). Çok
                  büyük görseller tarayıcı kotasını aşarsa kayıt başarısız olabilir — mümkünse 500
                  KB altı tutun.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="block w-full max-w-md text-sm text-white/80 file:mr-3 file:rounded-md file:border-0 file:bg-cyan/90 file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-cyan"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {form.images.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`Uploaded ${idx + 1}`}
                      className="h-16 w-16 rounded object-cover"
                      decoding="async"
                      loading="lazy"
                      fetchPriority="low"
                    />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-black/80 text-xs"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Teknik özellikler</div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }))
                  }
                  className="rounded border border-white/20 px-2 py-1 text-xs"
                >
                  Özellik ekle
                </button>
              </div>
              {form.specs.map((spec, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    value={spec.key}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.map((s, i) =>
                          i === idx ? { ...s, key: e.target.value } : s,
                        ),
                      }))
                    }
                    placeholder="Anahtar"
                    className="rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.map((s, i) =>
                          i === idx ? { ...s, value: e.target.value } : s,
                        ),
                      }))
                    }
                    placeholder="Değer"
                    className="rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        specs:
                          prev.specs.length === 1
                            ? [{ key: "", value: "" }]
                            : prev.specs.filter((_, i) => i !== idx),
                      }))
                    }
                    className="rounded border border-white/20 px-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm((prev) => ({ ...prev, inStock: e.target.checked }))}
                />
                <span>Stokta</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                />
                <span>Öne çıkan</span>
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-amber-300">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-md border border-white/20 px-3 py-2"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-md bg-cyan px-3 py-2 text-black font-medium"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
