/**
 * Client-side token persistence. There is no refresh/logout endpoint on the
 * backend (see frontend_specification.md §1.5) — "logout" only clears this.
 */

const TOKEN_KEY = "stockpro_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}
