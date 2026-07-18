export type OrderStatus = "Pending" | "Success" | "Cancelled";

export interface Order {
  id: string;
  userId: number;
  gameId: string | null;
  gameName: string;
  packageName: string;
  amountMmk: number;
  playerId: string | null;
  zoneId: string | null;
  status: OrderStatus;
  deliveryContent: string | null;
  rating: number | null;
  reviewText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  gameId: string;
  gameName: string;
  packageName: string;
  amountMmk: number;
  playerId: string;
  zoneId: string;
}

export interface RateOrderDto {
  rating: number;
  reviewText?: string;
}

export interface DigitalOrder {
  id: number;
  userId: number;
  digitalProductId: string;
  productName: string;
  amountMmk: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: { username: string; email: string };
}
