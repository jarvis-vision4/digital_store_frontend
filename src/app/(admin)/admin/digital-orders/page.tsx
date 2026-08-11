"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDigitalOrders, useDeleteDigitalOrder, useDeliverDigitalOrder, useCancelDigitalOrder } from "@/hooks/queries";
import { formatMmk, formatDate, errorMessage } from "@/lib/utils";
import { statusVariant } from "@/lib/constants";
import { toast } from "sonner";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDigitalOrdersPage() {
  const { data: orders = [], isLoading } = useAdminDigitalOrders();
  const deleteMutation = useDeleteDigitalOrder();
  const deliverMutation = useDeliverDigitalOrder();
  const cancelMutation = useCancelDigitalOrder();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this digital order permanently?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Digital order deleted");
    } catch {
      toast.error("Failed to delete digital order");
    }
  };

  const handleDeliver = async (id: number) => {
    try {
      await deliverMutation.mutateAsync(id);
      toast.success("Digital order delivered");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this digital order?")) return;
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Digital order cancelled");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Digital Orders</h1>

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
                      <h3 className="font-medium">{order.productName}</h3>
                      <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                    {order.user && (
                      <p className="text-sm text-muted-foreground">
                        User: {order.user.username} ({order.user.email})
                      </p>
                    )}
                    {!order.user && (
                      <p className="text-sm text-muted-foreground">User #{order.userId}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold">{formatMmk(order.amountMmk)}</p>
                    {order.status.toLowerCase() === "pending" && (
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
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No digital orders yet</p>
          )}
        </div>
      )}
    </div>
  );
}
