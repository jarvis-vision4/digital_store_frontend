"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsApi } from "@/lib/api";
import { formatMmk } from "@/lib/utils";
import { Users, ShoppingCart, Wallet, Banknote } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingTopups: 0,
  });

  useEffect(() => {
    settingsApi.getAdminStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-600" },
    { title: "Total Revenue", value: formatMmk(stats.totalRevenue), icon: Wallet, color: "text-purple-600" },
    { title: "Pending Topups", value: stats.pendingTopups, icon: Banknote, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
