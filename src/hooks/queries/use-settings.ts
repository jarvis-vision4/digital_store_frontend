import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as settingsApi from "@/lib/api/settings";

export const settingsKeys = {
  banners: ["settings", "banners"] as const,
  bannersAdmin: ["settings", "banners", "admin"] as const,
  notice: ["settings", "notice"] as const,
  support: ["settings", "support"] as const,
  payment: ["settings", "payment"] as const,
  admin: ["settings", "admin"] as const,
  stats: ["settings", "stats"] as const,
  audit: ["settings", "audit"] as const,
};

export function useActiveBanners() {
  return useQuery({ queryKey: settingsKeys.banners, queryFn: settingsApi.getActiveBanners });
}

export function useGlobalNotice() {
  return useQuery({ queryKey: settingsKeys.notice, queryFn: settingsApi.getGlobalNotice });
}

export function useSupportContacts() {
  return useQuery({ queryKey: settingsKeys.support, queryFn: settingsApi.getSupportContacts });
}

export function useAdminSettings() {
  return useQuery({ queryKey: settingsKeys.admin, queryFn: settingsApi.getAdminSettings });
}

export function useAdminStats() {
  return useQuery({ queryKey: settingsKeys.stats, queryFn: settingsApi.getAdminStats });
}

export function useAdminAuditLogs() {
  return useQuery({ queryKey: settingsKeys.audit, queryFn: settingsApi.getAdminAuditLogs });
}

export function useAdminBanners() {
  return useQuery({ queryKey: settingsKeys.bannersAdmin, queryFn: settingsApi.getAdminBanners });
}

export function usePaymentSettingsPublic() {
  return useQuery({ queryKey: settingsKeys.payment, queryFn: settingsApi.getPaymentSettingsPublic });
}

export function useUpdatePaymentSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payment: Record<string, string>) => settingsApi.updatePaymentSettings(payment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.admin });
      qc.invalidateQueries({ queryKey: settingsKeys.payment });
    },
  });
}

export function useUpdateNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notice: string) => settingsApi.updateNotice(notice),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.admin });
      qc.invalidateQueries({ queryKey: settingsKeys.notice });
    },
  });
}

export function useUpdateSecuritySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (exchangeRate: string) => settingsApi.updateSecuritySettings(exchangeRate),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.admin }),
  });
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, image }: { dto: { id: string; title: string; description?: string; badge?: string }; image?: File }) =>
      settingsApi.createBannerAdmin(dto, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.bannersAdmin });
      qc.invalidateQueries({ queryKey: settingsKeys.banners });
    },
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
      image,
    }: {
      id: string;
      dto: Partial<{ title: string; description: string; badge: string; isActive: boolean }>;
      image?: File;
    }) => settingsApi.updateBannerAdmin(id, dto, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.bannersAdmin });
      qc.invalidateQueries({ queryKey: settingsKeys.banners });
    },
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.deleteBannerAdmin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.bannersAdmin });
      qc.invalidateQueries({ queryKey: settingsKeys.banners });
    },
  });
}
