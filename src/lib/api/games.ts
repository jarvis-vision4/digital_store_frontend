import { apiClient } from "../api-client";
import type { Game, DigitalProduct, CreateGameDto, CreatePackageDto, CreateDigitalProductDto } from "@/types";

export async function getGames(): Promise<Game[]> {
  const { data } = await apiClient.get<Game[]>("/games");
  return data;
}

export async function getGame(id: string): Promise<Game> {
  const { data } = await apiClient.get<Game>(`/games/${id}`);
  return data;
}

export async function createGameAdmin(dto: CreateGameDto): Promise<Game> {
  const { data } = await apiClient.post<Game>("/admin/games", dto);
  return data;
}

export async function updateGameAdmin(id: string, dto: Partial<CreateGameDto>): Promise<Game> {
  const { data } = await apiClient.put<Game>(`/admin/games/${id}`, dto);
  return data;
}

export async function deleteGameAdmin(id: string): Promise<void> {
  await apiClient.delete(`/admin/games/${id}`);
}

export async function uploadGameImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<{ url: string }>("/admin/games/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

export async function addPackageAdmin(gameId: string, dto: CreatePackageDto): Promise<void> {
  await apiClient.post(`/admin/games/${gameId}/packages`, dto);
}

export async function deletePackageAdmin(gameId: string, pkgId: number): Promise<void> {
  await apiClient.delete(`/admin/games/${gameId}/packages/${pkgId}`);
}

export async function updatePackageAdmin(pkgId: number, dto: Partial<CreatePackageDto> & { isActive?: boolean }): Promise<void> {
  await apiClient.put(`/admin/packages/${pkgId}`, dto);
}

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
