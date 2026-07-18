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

export async function addPackageAdmin(gameId: string, dto: CreatePackageDto): Promise<void> {
  await apiClient.post(`/admin/games/${gameId}/packages`, dto);
}

export async function getDigitalProducts(): Promise<DigitalProduct[]> {
  const { data } = await apiClient.get<DigitalProduct[]>("/digital-products");
  return data;
}

export async function getDigitalProductsAdmin(): Promise<DigitalProduct[]> {
  const { data } = await apiClient.get<DigitalProduct[]>("/admin/digital-products");
  return data;
}

export async function createDigitalProductAdmin(dto: CreateDigitalProductDto): Promise<DigitalProduct> {
  const { data } = await apiClient.post<DigitalProduct>("/admin/digital-products", dto);
  return data;
}

export async function updateDigitalProductAdmin(id: number, dto: Partial<CreateDigitalProductDto>): Promise<DigitalProduct> {
  const { data } = await apiClient.put<DigitalProduct>(`/admin/digital-products/${id}`, dto);
  return data;
}

export async function deleteDigitalProductAdmin(id: number): Promise<void> {
  await apiClient.delete(`/admin/digital-products/${id}`);
}

export async function orderDigitalProduct(productId: number, name: string, amountMmk: number): Promise<void> {
  await apiClient.post("/digital-orders", { digitalProductId: String(productId), productName: name, amountMmk });
}
