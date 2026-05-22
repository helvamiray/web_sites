/**
 * Yerel geliştirme için güvenli olmayan varsayılanlar vardır.
 * Üretimde `.env.local` ile `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` zorunlu tutun.
 */
export const DEFAULT_ADMIN_USERNAME = "Miray";
export const DEFAULT_ADMIN_PASSWORD = "123";

export function getExpectedAdminUsername(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_USERNAME?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_USERNAME;
}

export function getExpectedAdminPassword(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_PASSWORD?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_PASSWORD;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return (
    username.trim() === getExpectedAdminUsername() && password === getExpectedAdminPassword()
  );
}
