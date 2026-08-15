import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as digitalProductsApi from "@/lib/api/digital-products";
import type { CreateDigitalProductDto } from "@/types";

export const digitalProductsKeys = {
  list: ["digital-products", "list"] as const,
  admin: ["digital-products", "admin"] as const,
};

export function useDigitalProducts() {
  return useQuery({ queryKey: digitalProductsKeys.list, queryFn: digitalProductsApi.getDigitalProducts });
}

export function useDigitalProductsAdmin() {
  return useQuery({ queryKey: digitalProductsKeys.admin, queryFn: digitalProductsApi.getDigitalProductsAdmin });
}

export function useCreateDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, image }: { dto: CreateDigitalProductDto; image?: File }) =>
      digitalProductsApi.createDigitalProductAdmin(dto, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: digitalProductsKeys.admin }),
  });
}

export function useUpdateDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto, image }: { id: number; dto: Partial<CreateDigitalProductDto>; image?: File }) =>
      digitalProductsApi.updateDigitalProductAdmin(id, dto, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: digitalProductsKeys.admin }),
  });
}

export function useDeleteDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => digitalProductsApi.deleteDigitalProductAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: digitalProductsKeys.admin }),
  });
}

export function useOrderDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, name, amountMmk }: { productId: number; name: string; amountMmk: number }) =>
      digitalProductsApi.orderDigitalProduct(productId, name, amountMmk),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
