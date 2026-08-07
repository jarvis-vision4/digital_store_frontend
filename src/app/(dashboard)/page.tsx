"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { gamesApi, ordersApi, walletApi, authApi } from "@/lib/api";
import { formatMmk, errorMessage } from "@/lib/utils";
import type { Game, Order, User } from "@/types";
import { Gamepad2, ShoppingCart, Wallet, Clock } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user: contextUser } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      gamesApi.getGames(),
      ordersApi.getUserOrders(),
      walletApi.getWalletBalance(),
      authApi.getProfile(),
    ])
      .then(([gamesData, ordersData, balanceData, profileData]) => {
        setGames(gamesData.filter((g) => g.popular));
        setRecentOrders(ordersData.slice(0, 5));
        setBalance(Number(balanceData.balance));
        setProfile(profileData);
      })
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { label: "Wallet Balance", value: formatMmk(balance), icon: Wallet, color: "text-blue-600" },
    { label: "Total Orders", value: recentOrders.length.toString(), icon: ShoppingCart, color: "text-green-600" },
    { label: "VIP Level", value: profile?.vipName ?? contextUser?.vipName ?? "Standard Gamer", icon: Clock, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {contextUser?.username}</h1>
        <p className="text-muted-foreground">Manage your gaming top-ups and account</p>
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
          <h2 className="text-xl font-bold">Popular Games</h2>
          <Link href="/games" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-20" /></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {games.slice(0, 6).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/orders" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="divide-y">
                {recentOrders.map((order) => (
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
