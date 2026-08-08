"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { walletApi } from "@/lib/api";
import { formatMmk, formatDate } from "@/lib/utils";
import type { WalletTransaction } from "@/types";
import { toast } from "sonner";
import { CheckCircle, XCircle, Gift } from "lucide-react";

export default function AdminTopupsPage() {
  const [topups, setTopups] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTopups = async () => {
    try {
      const data = await walletApi.getAdminTopups();
      setTopups(data);
    } catch {
      toast.error("Failed to load topups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadTopups(); }, []);

  const handleApprove = async (id: string, rewardedAmount?: number) => {
    try {
      await walletApi.approveDepositAdmin(id, rewardedAmount);
      toast.success(rewardedAmount ? `Deposit approved with ${formatMmk(rewardedAmount)} reward` : "Deposit approved");
      loadTopups();
    } catch {
      toast.error("Failed to approve deposit");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await walletApi.rejectDepositAdmin(id);
      toast.success("Deposit rejected");
      loadTopups();
    } catch {
      toast.error("Failed to reject deposit");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Deposit Requests</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {topups.map((topup) => (
            <ApproveCard key={topup.id} topup={topup} onApprove={handleApprove} onReject={handleReject} />
          ))}
          {!isLoading && topups.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No pending deposits</p>
          )}
        </div>
      )}
    </div>
  );
}

function ApproveCard({ topup, onApprove, onReject }: {
  topup: WalletTransaction;
  onApprove: (id: string, rewardedAmount?: number) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}) {
  const [rewardAmount, setRewardAmount] = useState("");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{formatMmk(topup.amount)} via {topup.paymentMethod}</h3>
              <Badge variant={topup.status === "Pending" ? "warning" : topup.status === "Success" ? "success" : "secondary"}>
                {topup.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">User #{topup.userId} | Last 6 Numbers  : {topup.phone}</p>
            <p className="text-xs text-muted-foreground">{formatDate(topup.createdAt)}</p>
          </div>
          <div className="text-right space-y-2 shrink-0">
            {topup.status === "Pending" && (
              <>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Reward (0)"
                    className="w-28 h-8 text-sm"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-1 justify-end">
                  <Button size="sm" variant="outline" onClick={() => onApprove(topup.id, rewardAmount ? Number(rewardAmount) : undefined)}>
                    <CheckCircle className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onReject(topup.id)}>
                    <XCircle className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
