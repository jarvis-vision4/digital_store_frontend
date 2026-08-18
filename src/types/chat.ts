export interface ChatMessage {
  id: number;
  userId: number;
  senderRole: "ADMIN" | "MODERATOR" | "CUSTOMER";
  content: string;
  readByUserAt: string | null;
  readByAdminAt: string | null;
  createdAt: string;
}