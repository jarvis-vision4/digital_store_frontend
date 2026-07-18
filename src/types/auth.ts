export interface User {
  id: number;
  username: string;
  email: string | null;
  walletBalance: number;
  telegramChatId: string | null;
  referralCode: string;
  referredBy: string | null;
  vipLevel: number;
  vipName: string;
  discountRate: number;
  role: "ADMIN" | "MODERATOR" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  username: string;
  email?: string;
  password: string;
  referralCode?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ReferralInfo {
  referralCode: string;
  totalReferrals: number;
  totalBonus: number;
  referrals: Array<{
    id: number;
    bonusAmountMmk: number;
    status: string;
    createdAt: string;
    referee: {
      username: string;
      createdAt: string;
    };
  }>;
}
