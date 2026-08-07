"use server";

import { serverFetch } from "@/lib/server";
import type { Game, DigitalProduct, PromotionalBanner } from "@/types";

/**
 * Server Actions for reading PUBLIC store data on the server.
 * These run during SSR so pages render full HTML on first paint,
 * rather than fetching in the browser with useEffect.
 */

export async function getGames(): Promise<Game[]> {
  return serverFetch<Game[]>("/games");
}

export async function getGame(id: string): Promise<Game> {
  return serverFetch<Game>(`/games/${id}`);
}

export async function getActiveBanners(): Promise<PromotionalBanner[]> {
  return serverFetch<PromotionalBanner[]>("/banners");
}

export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  return serverFetch<DigitalProduct[]>("/digital-products");
}