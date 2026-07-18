import { apiClient } from "../api-client";
import type { WalletTransaction, SubmitDepositDto, Coupon, RedeemCouponDto } from "@/types";

export async function getWalletBalance(): Promise<{ balance: number }> {
  const { data } = await apiClient.get<{ balance: number }>("/wallet/balance");
  return data;
}

export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  const { data } = await apiClient.get<WalletTransaction[]>("/wallet/transactions");
  return data;
}

export async function submitDeposit(dto: SubmitDepositDto): Promise<void> {
  await apiClient.post("/wallet/deposit", dto);
}

export async function redeemCoupon(dto: RedeemCouponDto): Promise<void> {
  await apiClient.post("/coupons/redeem", dto);
}

export async function getAdminTopups(): Promise<WalletTransaction[]> {
  const { data } = await apiClient.get<WalletTransaction[]>("/admin/topups");
  return data;
}

export async function approveDepositAdmin(transactionId: string, rewardedAmount?: number): Promise<void> {
  const body = rewardedAmount ? { rewardedAmount } : undefined;
  await apiClient.post(`/admin/topups/${transactionId}/approve`, body);
}

export async function rejectDepositAdmin(transactionId: string, reason?: string): Promise<void> {
  await apiClient.post(`/admin/topups/${transactionId}/reject`, null, {
    params: { reason },
  });
}

export async function getAdminCoupons(): Promise<Coupon[]> {
  const { data } = await apiClient.get<Coupon[]>("/admin/coupons");
  return data;
}

export async function generateCouponAdmin(code: string, amount: number): Promise<void> {
  await apiClient.post("/admin/coupons", { code, amount });
}
