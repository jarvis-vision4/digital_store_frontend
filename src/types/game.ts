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
