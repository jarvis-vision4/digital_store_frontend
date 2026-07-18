import { apiClient } from "../api-client";
import type { PromotionalBanner, SystemSetting, AuditLog } from "@/types";

export async function getActiveBanners(): Promise<PromotionalBanner[]> {
  const { data } = await apiClient.get<PromotionalBanner[]>("/banners");
  return data;
}

export async function getGlobalNotice(): Promise<{ notice: string }> {
  const { data } = await apiClient.get<{ notice: string }>("/notice");
  return data;
}

export async function getSupportContacts(): Promise<{
  phone: string;
  telegram: string;
  viber: string;
}> {
  const { data } = await apiClient.get("/support");
  return data;
}

export async function getAdminSettings(): Promise<SystemSetting[]> {
  const { data } = await apiClient.get<SystemSetting[]>("/admin/settings");
  return data;
}

export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingTopups: number;
}> {
  const { data } = await apiClient.get("/admin/statistics");
  return data;
}

export async function getAdminAuditLogs(): Promise<AuditLog[]> {
  const { data } = await apiClient.get<AuditLog[]>("/admin/audit-logs");
  return data;
}

export async function getAdminBanners(): Promise<PromotionalBanner[]> {
  const { data } = await apiClient.get<PromotionalBanner[]>("/admin/banners");
  return data;
}

export async function createBannerAdmin(dto: {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  badge?: string;
}): Promise<void> {
  await apiClient.post("/admin/banners", dto);
}

export async function updateBannerAdmin(
  id: string,
  dto: Partial<{
    title: string;
    imageUrl: string;
    description: string;
    badge: string;
    isActive: boolean;
  }>,
): Promise<void> {
  await apiClient.put(`/admin/banners/${id}`, dto);
}

export async function getPaymentSettingsPublic(): Promise<Record<string, string>> {
  const { data } = await apiClient.get<Record<string, string>>("/settings/payment");
  return data;
}
