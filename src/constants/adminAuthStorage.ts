/** Oturum sadece bu sekme için (sessionStorage). */
export const VEGA_ADMIN_SESSION_KEY = "vega_admin_session_v2";

export function readAdminSessionUsername(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(VEGA_ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { username?: string };
    return typeof parsed.username === "string" ? parsed.username : null;
  } catch {
    return null;
  }
}

export function writeAdminSession(username: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(VEGA_ADMIN_SESSION_KEY, JSON.stringify({ username }));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(VEGA_ADMIN_SESSION_KEY);
}

export function isAdminSessionPresent(): boolean {
  return readAdminSessionUsername() != null;
}
