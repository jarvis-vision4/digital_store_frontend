import { apiClient } from "../api-client";
import type { User } from "@/types";

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>("/admin/users");
  return data;
}

export async function updateUserRole(username: string, role: string): Promise<void> {
  await apiClient.put(`/admin/users/${username}/role`, { role });
}
