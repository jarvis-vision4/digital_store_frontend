import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as walletApi from "@/lib/api/wallet";
import type { SubmitDepositDto, RedeemCouponDto } from "@/types";

export const walletKeys = {
  balance: ["wallet", "balance"] as const,
  transactions: ["wallet", "transactions"] as const,
  topups: ["wallet", "topups"] as const,
  coupons: ["wallet", "coupons"] as const,
};

export function useWalletBalance(enabled = true) {
  return useQuery({ queryKey: walletKeys.balance, queryFn: walletApi.getWalletBalance, enabled });
}

export function useWalletTransactions() {
  return useQuery({ queryKey: walletKeys.transactions, queryFn: walletApi.getWalletTransactions });
}

export function useAdminTopups() {
  return useQuery({ queryKey: walletKeys.topups, queryFn: walletApi.getAdminTopups });
}

export function useAdminCoupons() {
  return useQuery({ queryKey: walletKeys.coupons, queryFn: walletApi.getAdminCoupons });
}

export function useSubmitDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: SubmitDepositDto) => walletApi.submitDeposit(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.transactions });
      qc.invalidateQueries({ queryKey: walletKeys.topups });
    },
  });
}

export function useRedeemCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: RedeemCouponDto) => walletApi.redeemCoupon(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.balance });
      qc.invalidateQueries({ queryKey: walletKeys.transactions });
    },
  });
}

export function useApproveDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, rewardedAmount }: { transactionId: string; rewardedAmount?: number }) =>
      walletApi.approveDepositAdmin(transactionId, rewardedAmount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.topups });
      qc.invalidateQueries({ queryKey: walletKeys.balance });
    },
  });
}

export function useRejectDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string; reason?: string }) =>
      walletApi.rejectDepositAdmin(transactionId, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: walletKeys.topups }),
  });
}

export function useGenerateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) => walletApi.generateCouponAdmin(code, amount),
    onSuccess: () => qc.invalidateQueries({ queryKey: walletKeys.coupons }),
  });
}
