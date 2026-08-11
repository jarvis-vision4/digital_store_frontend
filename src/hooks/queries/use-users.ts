import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "@/lib/api/admin";

export const usersKeys = {
  list: ["users", "list"] as const,
};

export function useUsers() {
  return useQuery({ queryKey: usersKeys.list, queryFn: adminApi.getUsers });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ username, role }: { username: string; role: string }) => adminApi.updateUserRole(username, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.list }),
  });
}
