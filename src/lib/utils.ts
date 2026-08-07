import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMmk(amount: number): string {
  return new Intl.NumberFormat("my-MM", {
    style: "currency",
    currency: "MMK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1")
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

/**
 * Resolve a backend-served upload path (e.g. "/uploads/games/x.png") into a
 * full URL pointing at the API server. Returns absolute URLs and emoji/text
 * unchanged.
 */
export function resolveImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${API_ORIGIN}${path}`;
  return path;
}
