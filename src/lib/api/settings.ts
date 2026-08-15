import { apiClient } from "../api-client";
import type { PromotionalBanner, AuditLog } from "@/types";

export async function getActiveBanners(): Promise<PromotionalBanner[]> {
  const { data } = await apiClient.get<PromotionalBanner[]>("/banners");
  return data;
}

export async function getGlobalNotice(): Promise<{ notice: string }> {
  const { data } = await apiClient.get<{ notice: string }>("/notice");
  return data;
}

export interface SupportContacts {
  phone?: string;
  viber?: string;
  telegram?: string;
  tiktok?: string;
  facebook?: string;
}

export async function getSupportContacts(): Promise<SupportContacts> {
  const { data } = await apiClient.get("/support");
  return data;
}

export async function updateSupportContacts(contacts: SupportContacts): Promise<void> {
  await apiClient.put("/admin/settings/support", contacts);
}

export async function getAdminSettings(): Promise<Record<string, string>> {
  const { data } = await apiClient.get<Record<string, string>>("/admin/settings");
  return data;
}

export async function updatePaymentSettings(payment: Record<string, string>): Promise<void> {
  await apiClient.put("/admin/settings/payment", payment);
}

export async function updateNotice(notice: string): Promise<void> {
  await apiClient.put("/admin/settings/notice", { globalNotice: notice });
}

export async function updateSecuritySettings(exchangeRate: string): Promise<void> {
  await apiClient.put("/admin/settings/security", { exchangeRateThaiBaht: exchangeRate });
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
  description?: string;
  badge?: string;
}, image?: File): Promise<void> {
  const fd = new FormData();
  fd.append("id", dto.id);
  fd.append("title", dto.title);
  if (dto.description) fd.append("description", dto.description);
  if (dto.badge) fd.append("badge", dto.badge);
  if (image) fd.append("image", image);
  await apiClient.post("/admin/banners", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateBannerAdmin(
  id: string,
  dto: Partial<{
    title: string;
    description: string;
    badge: string;
    isActive: boolean;
  }>,
  image?: File,
): Promise<void> {
  const fd = new FormData();
  if (dto.title) fd.append("title", dto.title);
  if (dto.description) fd.append("description", dto.description);
  if (dto.badge) fd.append("badge", dto.badge);
  if (dto.isActive !== undefined) fd.append("isActive", String(dto.isActive));
  if (image) fd.append("image", image);
  await apiClient.put(`/admin/banners/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteBannerAdmin(id: string): Promise<void> {
  await apiClient.delete(`/admin/banners/${id}`);
}

export async function getPaymentSettingsPublic(): Promise<Record<string, string>> {
  const { data } = await apiClient.get<Record<string, string>>("/settings/payment");
  return data;
}
