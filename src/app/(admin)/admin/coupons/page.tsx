"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { walletApi } from "@/lib/api";
import { formatMmk } from "@/lib/utils";
import type { Coupon } from "@/types";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCoupons = async () => {
    try {
      const data = await walletApi.getAdminCoupons();
      setCoupons(data);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <GenerateCouponDialog onSuccess={loadCoupons} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <Card key={coupon.code}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-mono font-medium">{coupon.code}</p>
                  <p className="text-sm text-muted-foreground">
                    Created by: {coupon.createdBy}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatMmk(coupon.amount)}</p>
                  <Badge variant={coupon.status === "Active" ? "success" : "secondary"}>
                    {coupon.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && coupons.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No coupons yet</p>
          )}
        </div>
      )}
    </div>
  );
}

function GenerateCouponDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await walletApi.generateCouponAdmin(code, Number(amount));
      toast.success("Coupon generated");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to generate coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Generate Coupon</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input id="code" placeholder="e.g. WELCOME50" value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (MMK)</Label>
            <Input id="amount" type="number" placeholder="e.g. 5000" value={amount} onChange={(e) => setAmount(e.target.value)} required min={100} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Generating..." : "Generate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
