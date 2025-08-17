import { API_BASE } from "../config";

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
const res = await fetch(`${API_BASE}${path}`, {
headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  // allow endpoints that return no body (204) or plain text
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as T;
  return res.json() as Promise<T>;
}
