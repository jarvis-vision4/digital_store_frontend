export interface DigitalProductVariant {
  id: number;
  digitalProductId: number;
  name: string;
  durationDays: number;
  priceMmk: number;
  priceUsd: number | null;
  badge: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalProductFeature {
  id: number;
  digitalProductId: number;
  name: string;
  sortOrder: number;
  createdAt: string;
}

export interface DigitalProduct {
  id: number;
  name: string;
  category: string;
  description: string | null;
  image: string | null;
  priceMmk: number;
  rating: number;
  salesCount: number;
  badge: string | null;
  isAvailable: boolean;
  stockAvailable: boolean;
  inStock: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: DigitalProductVariant[];
  features: DigitalProductFeature[];
}

export interface CreateDigitalProductVariantDto {
  name: string;
  durationDays: number;
  priceMmk: number;
  priceUsd?: number;
  badge?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateDigitalProductFeatureDto {
  name: string;
  sortOrder?: number;
}

export interface CreateDigitalProductDto {
  name: string;
  category?: string;
  description?: string;
  image?: string;
  priceMmk: number;
  rating?: number;
  badge?: string;
  isAvailable?: boolean;
  variants?: CreateDigitalProductVariantDto[];
  features?: CreateDigitalProductFeatureDto[];
}