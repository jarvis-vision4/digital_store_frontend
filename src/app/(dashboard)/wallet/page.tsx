"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletBalance, useWalletTransactions, useProfile, usePaymentSettingsPublic, useSubmitDeposit, useRedeemCoupon } from "@/hooks/queries";
import { formatMmk, formatDate, errorMessage } from "@/lib/utils";
import { statusVariant } from "@/lib/constants";
import { CopyButton, copyToClipboard } from "@/components/copy-button";
import { toast } from "sonner";
import { Wallet, RefreshCw, Check, Copy } from "lucide-react";
import Image from "next/image";

const paymentMethods = [
  { key: "KBZ Pay", image: "/photos/kbz.jpeg", numberKey: "kbzPayNumber" },
  { key: "Wave Money", image: "/photos/wave.jpeg", numberKey: "wavePayNumber" },
  { key: "AYA Pay", image: "/photos/aya.jpeg", numberKey: "ayaPayNumber" },
  { key: "UAB Pay", image: "/photos/uab.png", numberKey: "uabPayNumber" },
];

export default function WalletPage() {
  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useWalletBalance();
  const { data: transactions = [], isLoading: isLoadingTx, refetch: refetchTx } = useWalletTransactions();
  const { data: profile } = useProfile();
  const { data: paymentInfo = {} } = usePaymentSettingsPublic();
  const depositMutation = useSubmitDeposit();
  const redeemMutation = useRedeemCoupon();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("KBZ Pay");
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const isLoading = isLoadingBalance || isLoadingTx;
  const balance = Number(balanceData?.balance ?? 0);
  const referralCode = profile?.referralCode ?? "";

  const loadData = () => {
    refetchBalance();
    refetchTx();
  };

  const currentMethod = paymentMethods.find((m) => m.key === paymentMethod);
  const accountNumber = currentMethod ? paymentInfo[currentMethod.numberKey] : "";
  const accountName = paymentInfo.accountName || "";

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await depositMutation.mutateAsync({
        amount: Number(amount),
        paymentMethod,
        phone,
      });
      toast.success("Deposit request submitted! Awaiting approval.");
      setAmount("");
      setPhone("");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleRedeem = async () => {
    if (!couponCode) return;
    try {
      await redeemMutation.mutateAsync({ code: couponCode });
      toast.success("Coupon redeemed successfully!");
      setCouponCode("");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const copyReferral = async () => {
    if (!referralCode) return;
    await copyToClipboard(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral code copied!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your balance and transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" /> Current Balance
            </CardTitle>
            <Button variant="ghost" size="icon" aria-label="Refresh balance" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-36" />
            ) : (
              <p className="text-3xl font-bold">{formatMmk(balance)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Code</CardTitle>
            <CardDescription>Share and earn bonuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono">
                {referralCode}
              </code>
              <Button variant="outline" size="icon" aria-label="Copy referral code" onClick={copyReferral}>
                <span className="sr-only">Copy referral code</span>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deposit">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="coupon">Redeem Coupon</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Submit Deposit</CardTitle>
              <CardDescription>
                Send payment to our payment accounts and submit the details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex gap-2 flex-wrap">
                    {paymentMethods.map(({ key, image }) => (
                      <Button
                        key={key}
                        type="button"
                        variant={paymentMethod === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaymentMethod(key)}
                      >
                        {key}
                      </Button>
                    ))}
                  </div>
                </div>

                {currentMethod && (
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="relative w-32 mx-auto rounded-lg overflow-hidden border">
                      <Image
                        src={currentMethod.image}
                        alt={currentMethod.key}
                        width={160}
                        height={120}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    {accountName && (
                      <p className="text-sm text-center font-medium">{accountName}</p>
                    )}
                    {accountNumber && (
                      <div className="flex items-center justify-center gap-2">
                        <code className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                          {accountNumber}
                        </code>
                        <CopyButton text={accountNumber} />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (MMK)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Last 6 Numbers</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={depositMutation.isPending}>
                  {depositMutation.isPending ? "Submitting..." : "Submit Deposit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupon">
          <Card>
            <CardHeader>
              <CardTitle>Redeem Gift Code</CardTitle>
              <CardDescription>Enter a coupon code to add funds to your wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button onClick={handleRedeem} disabled={redeemMutation.isPending || !couponCode}>
                  {redeemMutation.isPending ? "..." : "Redeem"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              ) : (
                <div className="divide-y">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{tx.type.replace("_", " ")}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.paymentMethod} - ...{tx.phone.slice(-6)}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === "ORDER_SPEND" ? "text-muted-foreground" : "text-green-600"}`}>
                          {tx.type === "ORDER_SPEND" ? "-" : "+"}{formatMmk(tx.amount)}
                        </p>
                        <Badge variant={statusVariant(tx.status)}>{tx.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
