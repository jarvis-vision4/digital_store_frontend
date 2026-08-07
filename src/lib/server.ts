const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";

/**
 * Server-safe fetch: unlike the client `apiClient` (which reads `localStorage`
 * for the Bearer token), this runs only on the server. Public endpoints don't
 * need a token. Used by Server Components / Server Actions to render data on
 * the server (SSR) instead of in the browser.
 */
export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}