import { apiClient } from "@/lib/api-client";
import type { ChatMessage } from "@/types";

export async function getMyChatMessages(): Promise<ChatMessage[]> {
  const { data } = await apiClient.get("/chat/messages");
  return data;
}

export async function getMyChatUnread(): Promise<{ unread: number }> {
  const { data } = await apiClient.get("/chat/unread");
  return data;
}

export async function markMyChatRead(): Promise<{ unread: number }> {
  const { data } = await apiClient.post("/chat/read");
  return data;
}

export interface AdminChatUser {
  userId: number;
  username: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastSender: string | null;
  unread: number;
}

export async function getAdminChatUsers(): Promise<AdminChatUser[]> {
  const { data } = await apiClient.get("/admin/chat/users");
  return data;
}

export async function getAdminChatMessages(userId: number): Promise<ChatMessage[]> {
  const { data } = await apiClient.get(`/admin/chat/users/${userId}/messages`);
  return data;
}

export async function markAdminChatRead(userId: number): Promise<{ unread: number }> {
  const { data } = await apiClient.post(`/admin/chat/users/${userId}/read`);
  return data;
}