import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  clearAdminSession,
  isAdminSessionPresent,
  readAdminSessionUsername,
  writeAdminSession,
} from "@/constants/adminAuthStorage";
import { verifyAdminCredentials } from "@/constants/adminCredentials";

interface AdminAuthValue {
  isAuthed: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

function subscribeAdminAuth(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onEvt = (): void => {
    cb();
  };
  window.addEventListener("vega-admin-session", onEvt);
  return () => {
    window.removeEventListener("vega-admin-session", onEvt);
  };
}

export function notifyAdminAuthChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("vega-admin-session"));
}

function AdminAuthProviderInner({ children }: { children: ReactNode }) {
  const isAuthed = useSyncExternalStore(
    subscribeAdminAuth,
    isAdminSessionPresent,
    (): boolean => false,
  );

  const username = useSyncExternalStore(subscribeAdminAuth, readAdminSessionUsername, (): null => null);

  const login = useCallback((user: string, password: string) => {
    const ok = verifyAdminCredentials(user, password);
    if (!ok) return false;
    writeAdminSession(user.trim());
    notifyAdminAuthChanged();
    return true;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    notifyAdminAuthChanged();
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({ isAuthed, username, login, logout }),
    [isAuthed, username, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  return <AdminAuthProviderInner>{children}</AdminAuthProviderInner>;
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth kullanılmadan önce AdminAuthProvider eksik.");
  }
  return ctx;
}
