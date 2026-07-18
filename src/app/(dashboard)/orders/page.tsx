"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ordersApi } from "@/lib/api";
import { formatMmk, formatDate } from "@/lib/utils";
import type { Order, DigitalOrder } from "@/types";
import { toast } from "sonner";
import { Star, CheckCircle2, Package } from "lucide-react";

type OrderItem = { kind: "game" } & Order | { kind: "digital" } & DigitalOrder;

const statusVariant = (s: string) => {
  switch (s.toLowerCase()) {
    case "success": return "success" as const;
    case "pending": return "warning" as const;
    case "cancelled": return "destructive" as const;
    default: return "secondary" as const;
  }
};

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star className={`h-5 w-5 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [digitalOrders, setDigitalOrders] = useState<DigitalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const [gameData, digitalData] = await Promise.all([
        ordersApi.getUserOrders(),
        ordersApi.getUserDigitalOrders(),
      ]);
      setOrders(gameData);
      setDigitalOrders(digitalData);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const allOrders = useMemo(() => {
    const items: OrderItem[] = [
      ...orders.map((o) => ({ ...o, kind: "game" as const })),
      ...digitalOrders.map((o) => ({ ...o, kind: "digital" as const })),
    ];
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }, [orders, digitalOrders]);

  const filterOrders = (status: string) =>
    status === "all" ? allOrders : allOrders.filter((o) => o.status.toLowerCase() === status.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View your order history</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No orders yet. Browse games and digital products to get started.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="Success">Completed</TabsTrigger>
            <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {["all", "Pending", "Success", "Cancelled"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
              {filterOrders(tab).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders found</p>
              ) : (
                filterOrders(tab).map((item) => (
                  <Card key={`${item.kind}-${item.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {item.kind === "digital" && <Package className="h-4 w-4 text-muted-foreground" />}
                            <h3 className="font-medium">{item.kind === "game" ? item.gameName : item.productName}</h3>
                            <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                          </div>
                          {item.kind === "game" && (
                            <>
                              <p className="text-sm text-muted-foreground">{item.packageName}</p>
                              {item.playerId && (
                                <p className="text-sm text-muted-foreground">Player: {item.playerId}{item.zoneId ? ` (${item.zoneId})` : ""}</p>
                              )}
                              {item.deliveryContent && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>{item.deliveryContent}</span>
                                </div>
                              )}
                              {item.rating && (
                                <div className="mt-2 flex items-center gap-2">
                                  <StarRating value={item.rating} readonly />
                                  {item.reviewText && <span className="text-sm text-muted-foreground">&ldquo;{item.reviewText}&rdquo;</span>}
                                </div>
                              )}
                            </>
                          )}
                          {item.kind === "digital" && (
                            <p className="text-sm text-muted-foreground">Digital Product</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(item.createdAt)}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-bold text-lg">{formatMmk(item.amountMmk)}</p>
                          {item.kind === "game" && item.status === "Success" && !item.rating && (
                            <RateDialog order={item} onRated={loadOrders} />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function RateDialog({ order, onRated }: { order: Order; onRated: () => void }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    setIsSubmitting(true);
    try {
      await ordersApi.rateOrder(order.id, { rating, reviewText: reviewText || undefined });
      toast.success("Thank you for your review!");
      setOpen(false);
      onRated();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Rate</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {order.gameName} - {order.packageName}
          </p>
          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review">Review (optional)</Label>
            <Textarea
              id="review"
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
