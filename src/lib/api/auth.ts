import { apiClient } from "../api-client";
import type { AuthResponse, RegisterDto, LoginDto, ChangePasswordDto, User, ReferralInfo } from "@/types";

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/register", dto);
  return data;
}

export async function login(dto: { email: string; password: string }): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/login", dto);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/profile");
  return data;
}

export async function changePassword(dto: ChangePasswordDto): Promise<void> {
  await apiClient.put("/profile/change-password", dto);
}

export async function getReferralInfo(): Promise<ReferralInfo> {
  const { data } = await apiClient.get<ReferralInfo>("/profile/referrals");
  return data;
}
