export type GameCategory =
  | "mobile_games"
  | "pc_games"
  | "gift_card"
  | "mobile_app"
  | "redeem_code"
  | "social_service";

export interface GamePackage {
  id: number;
  gameId: string;
  packageName: string;
  priceMmk: number;
  stockQuantity: number;
  originalPrice: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  image: string;
  posterUrl: string | null;
  description: string | null;
  minAmount: string;
  popular: boolean;
  isActive: boolean;
  sortOrder: number;
  packages: GamePackage[];
  createdAt: string;
  updatedAt: string;
}

export interface DigitalProduct {
  id: number;
  name: string;
  category: string;
  description: string | null;
  image: string | null;
  priceMmk: number;
  isAvailable: boolean;
  stockAvailable: boolean;
  inStock: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDigitalProductDto {
  name: string;
  category?: string;
  description?: string;
  image?: string;
  priceMmk: number;
  isAvailable?: boolean;
}

export interface CreateGamePackageDto {
  packageName: string;
  priceMmk: number;
  stockQuantity?: number;
  originalPrice?: number;
}

export interface CreateGameDto {
  id: string;
  name: string;
  category: GameCategory;
  image: string;
  posterUrl?: string;
  description?: string;
  minAmount?: string;
  popular?: boolean;
  sortOrder?: number;
  packages: CreateGamePackageDto[];
}

export interface CreatePackageDto {
  packageName: string;
  priceMmk: number;
  stockQuantity?: number;
  originalPrice?: number;
}
