"use server";

import { serverFetch } from "@/lib/server";
import type { DigitalProduct, PromotionalBanner, Order } from "@/types";

/**
 * Server Actions for reading PUBLIC store data on the server.
 * These run during SSR so pages render full HTML on first paint,
 * rather than fetching in the browser with useEffect.
 */

export async function getActiveBanners(): Promise<PromotionalBanner[]> {
  return serverFetch<PromotionalBanner[]>("/banners");
}

export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  return serverFetch<DigitalProduct[]>("/digital-products");
}

export async function getDigitalProductById(id: number): Promise<DigitalProduct> {
  return serverFetch<DigitalProduct>(`/digital-products/${id}`);
}

export async function getPublicReviews(): Promise<Order[]> {
  return serverFetch<Order[]>("/reviews");
}
