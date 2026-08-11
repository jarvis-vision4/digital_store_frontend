import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ordersApi from "@/lib/api/orders";
import type { CreateOrderDto, RateOrderDto } from "@/types";

export const ordersKeys = {
  mine: ["orders", "mine"] as const,
  admin: ["orders", "admin"] as const,
  digitalMine: ["orders", "digital", "mine"] as const,
  digitalAdmin: ["orders", "digital", "admin"] as const,
  reviews: ["orders", "reviews"] as const,
};

export function useUserOrders() {
  return useQuery({ queryKey: ordersKeys.mine, queryFn: ordersApi.getUserOrders });
}

export function useAdminOrders() {
  return useQuery({ queryKey: ordersKeys.admin, queryFn: ordersApi.getAdminOrders });
}

export function useUserDigitalOrders() {
  return useQuery({ queryKey: ordersKeys.digitalMine, queryFn: ordersApi.getUserDigitalOrders });
}

export function useAdminDigitalOrders() {
  return useQuery({ queryKey: ordersKeys.digitalAdmin, queryFn: ordersApi.getDigitalOrdersAdmin });
}

export function usePublicReviews() {
  return useQuery({ queryKey: ordersKeys.reviews, queryFn: ordersApi.getPublicReviews });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => ordersApi.createOrder(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.mine });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useRateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, dto }: { orderId: string; dto: RateOrderDto }) => ordersApi.rateOrder(orderId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.mine });
      qc.invalidateQueries({ queryKey: ordersKeys.reviews });
    },
  });
}

export function useDeliverOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.deliverOrderAdmin(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.admin }),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelOrderAdmin(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.admin });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.deleteOrderAdmin(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.admin }),
  });
}

export function useDeliverDigitalOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersApi.deliverDigitalOrderAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.digitalAdmin }),
  });
}

export function useCancelDigitalOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersApi.cancelDigitalOrderAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.digitalAdmin }),
  });
}

export function useDeleteDigitalOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersApi.deleteDigitalOrderAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.digitalAdmin }),
  });
}
