import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as digitalProductsApi from "@/lib/api/digital-products";
import type { CreateDigitalProductDto } from "@/types";

export const digitalProductsKeys = {
  list: ["digital-products", "list"] as const,
  detail: (id: number) => ["digital-products", "detail", id] as const,
  admin: ["digital-products", "admin"] as const,
};

export function useDigitalProducts() {
  return useQuery({ queryKey: digitalProductsKeys.list, queryFn: digitalProductsApi.getDigitalProducts });
}

export function useDigitalProduct(id: number) {
  return useQuery({ queryKey: digitalProductsKeys.detail(id), queryFn: () => digitalProductsApi.getDigitalProductById(id), enabled: !!id });
}

export function useDigitalProductsAdmin() {
  return useQuery({ queryKey: digitalProductsKeys.admin, queryFn: digitalProductsApi.getDigitalProductsAdmin });
}

export function useCreateDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, image }: { dto: CreateDigitalProductDto; image?: File }) =>
      digitalProductsApi.createDigitalProductAdmin(dto, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useUpdateDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto, image }: { id: number; dto: Partial<CreateDigitalProductDto>; image?: File }) =>
      digitalProductsApi.updateDigitalProductAdmin(id, dto, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useDeleteDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => digitalProductsApi.deleteDigitalProductAdmin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useOrderDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      name,
      amountMmk,
      variant,
    }: {
      productId: number;
      name: string;
      amountMmk: number;
      variant?: { id: number; name: string };
    }) => digitalProductsApi.orderDigitalProduct(productId, name, amountMmk, variant),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAddVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      dto,
    }: {
      productId: number;
      dto: { name: string; durationDays: number; priceMmk: number; priceUsd?: number; badge?: string; sortOrder?: number };
    }) => digitalProductsApi.addVariantAdmin(productId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useUpdateVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      dto,
    }: {
      variantId: number;
      dto: { name: string; durationDays: number; priceMmk: number; priceUsd?: number; badge?: string; sortOrder?: number; isActive?: boolean };
    }) => digitalProductsApi.updateVariantAdmin(variantId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useDeleteVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId: number) => digitalProductsApi.deleteVariantAdmin(variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useAddFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, name }: { productId: number; name: string }) =>
      digitalProductsApi.addFeatureAdmin(productId, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}

export function useDeleteFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (featureId: number) => digitalProductsApi.deleteFeatureAdmin(featureId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: digitalProductsKeys.admin });
      qc.invalidateQueries({ queryKey: digitalProductsKeys.list });
    },
  });
}
