import { Fragment, useEffect, useMemo, useState } from "react";

import { CONTACT_TYPE_LABEL_TR, contactService, type ContactSubmission } from "@/lib/contactService";

function previewText(text: string | undefined, max = 72): string {
  if (!text?.trim()) return "—";
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

export function AdminContactsPage() {
  const [rows, setRows] = useState<ContactSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = (): void => setRows(contactService.getAll());

  useEffect(() => {
    refresh();
  }, []);

  const sorted = useMemo(() => rows, [rows]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!sorted.some((r) => !r.read)) return;
            if (!window.confirm("Tüm mesajlar okundu olarak işaretlensin mi?")) return;
            contactService.markAllRead();
            refresh();
          }}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/74 hover:bg-white/[0.05]"
        >
          Tümünü okundu
        </button>
      </div>

      <div className="admin-premium-glass-panel overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[960px] text-sm font-[family-name:var(--font-sans)]">
          <thead className="border-b border-white/10 bg-black/35 text-[11px] uppercase tracking-[0.18em] text-white/45">
            <tr>
              <th className="p-3 text-left w-8" aria-hidden />
              <th className="p-3 text-left">Tarih</th>
              <th className="p-3 text-left">Ad</th>
              <th className="p-3 text-left">E-posta</th>
              <th className="p-3 text-left">Tür</th>
              <th className="p-3 text-left">Mesaj önizleme</th>
              <th className="p-3 text-left">Okundu</th>
              <th className="p-3 text-left">Sil</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const expanded = expandedId === r.id;
              const msgPreview = previewText(r.message);
              return (
                <Fragment key={r.id}>
                  <tr
                    className="border-t border-white/8 cursor-pointer hover:bg-white/[0.03]"
                    onClick={() => toggleExpand(r.id)}
                  >
                    <td className="p-3 text-white/50">{expanded ? "▼" : "▶"}</td>
                    <td className="p-3 whitespace-nowrap text-white/82">
                      {new Date(r.submittedAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="p-3 max-w-[140px] break-words">{r.name}</td>
                    <td className="p-3 max-w-[180px] break-all text-[oklch(0.78_0.12_205)]">{r.email}</td>
                    <td className="p-3 whitespace-nowrap">{CONTACT_TYPE_LABEL_TR[r.type]}</td>
                    <td className="p-3 max-w-[240px] text-white/72 text-xs">{msgPreview}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={r.read}
                        onChange={(e) => {
                          if (e.target.checked) {
                            contactService.markRead(r.id);
                          } else {
                            contactService.setRead(r.id, false);
                          }
                          refresh();
                        }}
                      />
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("Emin misiniz?")) return;
                          contactService.delete(r.id);
                          if (expandedId === r.id) setExpandedId(null);
                          refresh();
                        }}
                        className="rounded-lg border border-red-400/40 px-3 py-1 text-xs uppercase tracking-[0.1em] text-red-300"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                  {expanded ? (
                    <tr className="border-t border-white/8 bg-black/42">
                      <td colSpan={8} className="p-4 text-left text-sm space-y-3">
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <span className="text-white/52">Telefon: </span>
                            {r.phone ?? "—"}
                          </div>
                          <div>
                            <span className="text-white/52">Şirket: </span>
                            {r.company ?? "—"}
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-white/52">Kategori: </span>
                            {r.category ?? "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/52 text-[11px] uppercase tracking-[0.12em] mb-1">
                            Mesaj
                          </div>
                          <div className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/45 p-4 text-white/82">
                            {r.message?.trim() ? r.message : "—"}
                          </div>
                        </div>
                        {r.cartItems && r.cartItems.length > 0 ? (
                          <div>
                            <div className="text-white/52 text-[11px] uppercase tracking-[0.12em] mb-1">
                              Sepet
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-white/70">
                              {r.cartItems.map((item, i) => (
                                <li key={i}>
                                  {item.productName} × {item.qty}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="admin-premium-pill-btn !py-2 !text-[11px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              contactService.markRead(r.id);
                              refresh();
                            }}
                          >
                            Okundu
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-white/48">
                  Henüz mesaj bulunmuyor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
