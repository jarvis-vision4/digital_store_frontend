import { apiClient } from "../api-client";
import type { DigitalProduct, CreateDigitalProductDto } from "@/types";

export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  const { data } = await apiClient.get<DigitalProduct[]>("/digital-products");
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
  if (dto.isAvailable !== undefined) fd.append("isAvailable", String(dto.isAvailable));
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
  if (dto.category) fd.append("category", dto.category);
  if (dto.description) fd.append("description", dto.description);
  if (dto.priceMmk !== undefined) fd.append("priceMmk", String(dto.priceMmk));
  if (dto.isAvailable !== undefined) fd.append("isAvailable", String(dto.isAvailable));
  if (image) fd.append("image", image);
  const { data } = await apiClient.put<DigitalProduct>(`/admin/digital-products/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteDigitalProductAdmin(id: number): Promise<void> {
  await apiClient.delete(`/admin/digital-products/${id}`);
}

export async function orderDigitalProduct(productId: number, name: string, amountMmk: number): Promise<void> {
  await apiClient.post("/digital-orders", { digitalProductId: String(productId), productName: name, amountMmk });
}
