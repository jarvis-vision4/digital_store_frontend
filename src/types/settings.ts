export interface PromotionalBanner {
  id: string;
  imageUrl: string;
  title: string;
  description: string | null;
  badge: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSetting {
  settingKey: string;
  settingValue: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}
