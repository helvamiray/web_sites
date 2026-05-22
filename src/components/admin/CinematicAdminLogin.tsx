import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, UserRound } from "lucide-react";

import { useAdminAuth } from "@/context/AdminAuthContext";
import "@/styles/admin-premium-shell.css";

export function CinematicAdminLogin() {
  const { login, isAuthed } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthed) return;
    void navigate({ to: "/admin", replace: true });
  }, [isAuthed, navigate]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = login(username.trim(), password);
    if (!ok) {
      setError("Kimlik doğrulanamadı.");
      return;
    }
    void navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="admin-premium-root admin-login-canvas grid min-h-screen place-items-center px-6 py-12">
      <div className="admin-premium-grid" aria-hidden />
      <motion.div className="admin-premium-veil z-0 opacity-95" aria-hidden layout />

      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      >
        <div className="absolute -left-[10%] top-[12%] h-[42vmin] w-[42vmin] rounded-full bg-[oklch(0.55_0.16_215/0.12)] blur-3xl" />
        <div className="absolute right-[-6%] bottom-[8%] h-[52vmin] w-[52vmin] rounded-full bg-[oklch(0.5_0.12_250/0.1)] blur-3xl" />
      </motion.div>

      <motion.div
        className="admin-premium-glass-panel relative z-[2] w-full max-w-[420px] p-10"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[oklch(0.78_0.14_205)] font-medium">
            VEGA · mühendislik kontrol yüzü
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white leading-tight font-[family-name:var(--font-sans)]">
            Otorizasyon Terminali
          </h1>
          <p className="mt-2 text-sm text-white/52 leading-relaxed">
            Yerel oturum. Katalog düzenleri bu tarayıcıda saklanır.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-xs tracking-wide uppercase text-white/45">Operatör</span>
            <span className="relative flex overflow-hidden rounded-xl border border-white/12 bg-black/35">
              <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-[oklch(0.78_0.1_205/0.6)] pointer-events-none" />
              <input
                name="username"
                autoComplete="username"
                value={username}
                onChange={(ev) => {
                  setUsername(ev.target.value);
                  setError(null);
                }}
                className="w-full border-0 bg-transparent py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/36"
                placeholder="Kullanıcı adı"
              />
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-xs tracking-wide uppercase text-white/45">Ana anahtar</span>
            <span className="relative flex overflow-hidden rounded-xl border border-white/12 bg-black/35">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[oklch(0.78_0.1_205/0.6)] pointer-events-none" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                  setError(null);
                }}
                className="w-full border-0 bg-transparent py-2.5 pl-10 pr-4 text-[15px] text-white outline-none placeholder:text-white/36"
                placeholder="••••••"
              />
            </span>
          </label>

          {error ? <p className="text-sm text-amber-300/95">{error}</p> : null}

          <button type="submit" className="admin-premium-pill-btn w-full">
            Erişimi Onayla
          </button>
        </form>
      </motion.div>

      <p className="relative z-[2] mt-10 text-[11px] text-white/32 tracking-[0.12em] uppercase text-center">
        İklim kurgusu · Yerel bağlam
      </p>
    </div>
  );
}
