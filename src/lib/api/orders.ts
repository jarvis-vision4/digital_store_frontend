import { apiClient } from "../api-client";
import type { Order, CreateOrderDto, RateOrderDto, DigitalOrder } from "@/types";

export async function getUserOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data;
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", dto);
  return data;
}

export async function rateOrder(orderId: string, dto: RateOrderDto): Promise<void> {
  await apiClient.post(`/orders/${orderId}/rate`, dto);
}

export async function getPublicReviews(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>("/reviews");
  return data;
}

export async function getAdminOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>("/admin/orders");
  return data;
}

export async function deliverOrderAdmin(orderId: string): Promise<void> {
  await apiClient.post(`/admin/orders/${orderId}/deliver`);
}

export async function cancelOrderAdmin(orderId: string): Promise<void> {
  await apiClient.post(`/admin/orders/${orderId}/cancel`);
}

export async function deleteOrderAdmin(orderId: string): Promise<void> {
  await apiClient.delete(`/admin/orders/${orderId}`);
}

export async function getUserDigitalOrders(): Promise<DigitalOrder[]> {
  const { data } = await apiClient.get<DigitalOrder[]>("/digital-orders");
  return data;
}

export async function getDigitalOrdersAdmin(): Promise<DigitalOrder[]> {
  const { data } = await apiClient.get<DigitalOrder[]>("/admin/digital-orders");
  return data;
}

export async function deleteDigitalOrderAdmin(id: number): Promise<void> {
  await apiClient.delete(`/admin/digital-orders/${id}`);
}

export async function deliverDigitalOrderAdmin(id: number): Promise<void> {
  await apiClient.post(`/admin/digital-orders/${id}/approve`);
}

export async function cancelDigitalOrderAdmin(id: number): Promise<void> {
  await apiClient.post(`/admin/digital-orders/${id}/cancel`);
}
