"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ordersApi } from "@/lib/api";
import { formatMmk, formatDate } from "@/lib/utils";
import type { Order } from "@/types";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAdminOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleDeliver = async (id: string) => {
    try {
      await ordersApi.deliverOrderAdmin(id);
      toast.success("Order delivered");
      loadOrders();
    } catch {
      toast.error("Failed to deliver order");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await ordersApi.cancelOrderAdmin(id);
      toast.success("Order cancelled");
      loadOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await ordersApi.deleteOrderAdmin(id);
      toast.success("Order deleted");
      loadOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "Success": return "success" as const;
      case "Pending": return "warning" as const;
      case "Cancelled": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{order.gameName} - {order.packageName}</h3>
                        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Order: {order.id}</p>
                      <p className="text-sm text-muted-foreground">User #{order.userId}</p>
                      {order.playerId && (
                        <button
                          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          onClick={() => { navigator.clipboard.writeText(order.playerId!); toast.success("Player ID copied"); }}
                        >
                          Player: <span className="font-mono text-foreground/80 hover:text-primary underline decoration-dotted underline-offset-2">{order.playerId}</span>
                        </button>
                      )}
                      {order.zoneId && (
                        <button
                          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors ml-4"
                          onClick={() => { navigator.clipboard.writeText(order.zoneId!); toast.success("Zone ID copied"); }}
                        >
                          Zone: <span className="font-mono text-foreground/80 hover:text-primary underline decoration-dotted underline-offset-2">{order.zoneId}</span>
                        </button>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold">{formatMmk(order.amountMmk)}</p>
                    {order.status === "Pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleDeliver(order.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Deliver
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(order.id)}>
                          <XCircle className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      </div>
                    )}
                    <div>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(order.id)}>
                        <Trash2 className="h-3 w-3 mr-1 text-muted-foreground" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && orders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
}
