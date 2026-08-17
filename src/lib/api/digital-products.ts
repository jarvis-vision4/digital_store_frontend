import { apiClient } from "../api-client";
import type { DigitalProduct, CreateDigitalProductDto, DigitalProductVariant, DigitalProductFeature } from "@/types";

export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  const { data } = await apiClient.get<DigitalProduct[]>("/digital-products");
  return data;
}

export async function getDigitalProductById(id: number): Promise<DigitalProduct> {
  const { data } = await apiClient.get<DigitalProduct>(`/digital-products/${id}`);
  return data;
}

export async function getDigitalProductsAdmin(): Promise<DigitalProduct[]> {
  const { data } = await apiClient.get<DigitalProduct[]>("/admin/digital-products");
  return data;
}

export async function createDigitalProductAdmin(
  dto: CreateDigitalProductDto,
  image?: File,
): Promise<DigitalProduct> {
  const fd = new FormData();
  fd.append("name", dto.name);
  if (dto.category) fd.append("category", dto.category);
  if (dto.description) fd.append("description", dto.description);
  fd.append("priceMmk", String(dto.priceMmk));
  if (dto.rating !== undefined) fd.append("rating", String(dto.rating));
  if (dto.badge) fd.append("badge", dto.badge);
  if (dto.isAvailable !== undefined) fd.append("isAvailable", String(dto.isAvailable));
  if (dto.variants?.length) fd.append("variants", JSON.stringify(dto.variants));
  if (dto.features?.length) fd.append("features", JSON.stringify(dto.features));
  if (image) fd.append("image", image);
  const { data } = await apiClient.post<DigitalProduct>("/admin/digital-products", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateDigitalProductAdmin(
  id: number,
  dto: Partial<CreateDigitalProductDto>,
  image?: File,
): Promise<DigitalProduct> {
  const fd = new FormData();
  if (dto.name) fd.append("name", dto.name);
  if (dto.category !== undefined) fd.append("category", dto.category);
  if (dto.description !== undefined) fd.append("description", dto.description);
  if (dto.priceMmk !== undefined) fd.append("priceMmk", String(dto.priceMmk));
  if (dto.rating !== undefined) fd.append("rating", String(dto.rating));
  if (dto.badge !== undefined) fd.append("badge", dto.badge);
  if (dto.isAvailable !== undefined) fd.append("isAvailable", String(dto.isAvailable));
  if (dto.variants !== undefined) fd.append("variants", JSON.stringify(dto.variants));
  if (dto.features !== undefined) fd.append("features", JSON.stringify(dto.features));
  if (image) fd.append("image", image);
  const { data } = await apiClient.put<DigitalProduct>(`/admin/digital-products/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteDigitalProductAdmin(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/admin/digital-products/${id}`);
  return data;
}

export async function orderDigitalProduct(
  productId: number,
  name: string,
  amountMmk: number,
  variant?: { id: number; name: string },
): Promise<void> {
  await apiClient.post("/digital-orders", {
    digitalProductId: String(productId),
    ...(variant ? { digitalProductVariantId: String(variant.id), variantName: variant.name } : {}),
    productName: name,
    amountMmk,
  });
}

export async function addVariantAdmin(
  productId: number,
  dto: { name: string; durationDays: number; priceMmk: number; priceUsd?: number; badge?: string; sortOrder?: number },
): Promise<DigitalProductVariant> {
  const { data } = await apiClient.post<DigitalProductVariant>(`/admin/digital-products/${productId}/variants`, dto);
  return data;
}

export async function updateVariantAdmin(
  variantId: number,
  dto: { name: string; durationDays: number; priceMmk: number; priceUsd?: number; badge?: string; sortOrder?: number; isActive?: boolean },
): Promise<DigitalProductVariant> {
  const { data } = await apiClient.put<DigitalProductVariant>(`/admin/digital-product-variants/${variantId}`, dto);
  return data;
}

export async function deleteVariantAdmin(variantId: number): Promise<void> {
  await apiClient.delete(`/admin/digital-product-variants/${variantId}`);
}

export async function addFeatureAdmin(productId: number, dto: { name: string; sortOrder?: number }): Promise<DigitalProductFeature> {
  const { data } = await apiClient.post<DigitalProductFeature>(`/admin/digital-products/${productId}/features`, dto);
  return data;
}

export async function deleteFeatureAdmin(featureId: number): Promise<void> {
  await apiClient.delete(`/admin/digital-product-features/${featureId}`);
}