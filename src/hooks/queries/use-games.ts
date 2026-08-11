import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as gamesApi from "@/lib/api/games";
import type { CreateGameDto, CreatePackageDto, CreateDigitalProductDto } from "@/types";

export const gamesKeys = {
  list: ["games", "list"] as const,
  detail: (id: string) => ["games", "detail", id] as const,
  digital: ["games", "digital"] as const,
  digitalAdmin: ["games", "digital", "admin"] as const,
};

export function useGames() {
  return useQuery({ queryKey: gamesKeys.list, queryFn: gamesApi.getGames });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: gamesKeys.detail(id),
    queryFn: () => gamesApi.getGame(id),
    enabled: !!id,
  });
}

export function useDigitalProducts() {
  return useQuery({ queryKey: gamesKeys.digital, queryFn: gamesApi.getDigitalProducts });
}

export function useDigitalProductsAdmin() {
  return useQuery({ queryKey: gamesKeys.digitalAdmin, queryFn: gamesApi.getDigitalProductsAdmin });
}

export function useCreateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateGameDto) => gamesApi.createGameAdmin(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.list }),
  });
}

export function useUpdateGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateGameDto> }) => gamesApi.updateGameAdmin(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.list }),
  });
}

export function useDeleteGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gamesApi.deleteGameAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.list }),
  });
}

export function useAddPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ gameId, dto }: { gameId: string; dto: CreatePackageDto }) => gamesApi.addPackageAdmin(gameId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.list }),
  });
}

export function useUpdatePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pkgId, dto }: { pkgId: number; dto: Partial<CreatePackageDto> & { isActive?: boolean } }) =>
      gamesApi.updatePackageAdmin(pkgId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.list }),
  });
}

export function useDeletePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ gameId, pkgId }: { gameId: string; pkgId: number }) => gamesApi.deletePackageAdmin(gameId, pkgId),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.list }),
  });
}

export function useUploadGameImage() {
  return useMutation({ mutationFn: (file: File) => gamesApi.uploadGameImage(file) });
}

export function useCreateDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, image }: { dto: CreateDigitalProductDto; image?: File }) =>
      gamesApi.createDigitalProductAdmin(dto, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.digitalAdmin }),
  });
}

export function useUpdateDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto, image }: { id: number; dto: Partial<CreateDigitalProductDto>; image?: File }) =>
      gamesApi.updateDigitalProductAdmin(id, dto, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.digitalAdmin }),
  });
}

export function useDeleteDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.deleteDigitalProductAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: gamesKeys.digitalAdmin }),
  });
}

export function useOrderDigitalProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, name, amountMmk }: { productId: number; name: string; amountMmk: number }) =>
      gamesApi.orderDigitalProduct(productId, name, amountMmk),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: gamesKeys.digital });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
