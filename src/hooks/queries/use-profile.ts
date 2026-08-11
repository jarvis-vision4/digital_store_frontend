import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/lib/api/auth";
import type { ChangePasswordDto } from "@/types";

export const profileKeys = {
  me: ["profile", "me"] as const,
  referral: ["profile", "referral"] as const,
};

export function useProfile() {
  return useQuery({ queryKey: profileKeys.me, queryFn: authApi.getProfile });
}

export function useReferralInfo() {
  return useQuery({ queryKey: profileKeys.referral, queryFn: authApi.getReferralInfo });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => authApi.changePassword(dto),
  });
}
