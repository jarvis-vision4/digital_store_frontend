export type WalletTransactionType =
  | "DEPOSIT"
  | "WITHDRAW"
  | "REFERRAL_BONUS"
  | "ORDER_SPEND"
  | "REFUND";

export type WalletTransactionStatus = "Pending" | "Success" | "Cancelled";

export interface WalletTransaction {
  id: string;
  userId: number;
  amount: number;
  type: WalletTransactionType;
  paymentMethod: string;
  phone: string;
  screenshotUrl: string | null;
  status: WalletTransactionStatus;
  transactionId: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitDepositDto {
  amount: number;
  paymentMethod: string;
  phone: string;
  transactionId?: string;
  screenshotUrl?: string;
}

export interface Coupon {
  code: string;
  amount: number;
  createdBy: string;
  redeemedBy: number | null;
  status: "Active" | "Redeemed";
  createdAt: string;
  updatedAt: string;
}

export interface RedeemCouponDto {
  code: string;
}
