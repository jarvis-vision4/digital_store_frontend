"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers, useUpdateUserRole } from "@/hooks/queries";
import { formatMmk, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Search } from "lucide-react";

export default function AdminUsersPage() {
  const { data: users = [], isPending } = useUsers();
  const updateRoleMutation = useUpdateUserRole();
  const [search, setSearch] = useState("");

  const handleRoleChange = async (username: string, role: string) => {
    try {
      await updateRoleMutation.mutateAsync({ username, role });
      toast.success(`User ${username} updated to ${role}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.username}</p>
                    <Badge variant={user.role === "ADMIN" ? "destructive" : user.role === "MODERATOR" ? "warning" : "secondary"}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "success" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
                  <p className="text-xs text-muted-foreground">
                    Balance: {formatMmk(user.walletBalance)} | Joined: {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(v) => handleRoleChange(user.username, v)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="MODERATOR">Moderator</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
