"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useUserOrders, useWalletBalance } from "@/hooks/queries";
import { useProfile } from "@/hooks/queries/use-profile";
import { formatMmk } from "@/lib/utils";
import { ShoppingCart, Wallet, Clock } from "lucide-react";

export default function DashboardPage() {
  const { user: contextUser } = useAuth();
  const { data: recentOrders = [], isLoading: isLoadingOrders } = useUserOrders();
  const { data: balanceData } = useWalletBalance();
  const { data: profile } = useProfile();

  const stats = [
    { label: "Wallet Balance", value: formatMmk(balanceData?.balance ?? 0), icon: Wallet, color: "text-blue-600" },
    { label: "Total Orders", value: recentOrders.length.toString(), icon: ShoppingCart, color: "text-green-600" },
    { label: "VIP Level", value: profile?.vipName ?? contextUser?.vipName ?? "Standard Gamer", icon: Clock, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {contextUser?.username}</h1>
        <p className="text-muted-foreground">Manage your top-ups and account</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/orders" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {isLoadingOrders ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="divide-y">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{order.gameName} - {order.packageName}</p>
                      <p className="text-sm text-muted-foreground">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatMmk(order.amountMmk)}</p>
                      <Badge variant={order.status === "Success" ? "success" : order.status === "Pending" ? "warning" : "destructive"}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
