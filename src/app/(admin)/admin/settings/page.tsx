"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsApi } from "@/lib/api";
import { toast } from "sonner";
import { Save } from "lucide-react";
import Image from "next/image";
import { CopyButton } from "@/components/copy-button";

interface PaymentSettings {
  accountName: string;
  kbzPayNumber: string;
  wavePayNumber: string;
  ayaPayNumber: string;
  uabPayNumber: string;
  thaiBankDetails: string;
}

const paymentMethods = [
  { key: "kbzPayNumber" as const, label: "KBZ Pay", image: "/photos/kbz.jpeg" },
  { key: "wavePayNumber" as const, label: "Wave Money", image: "/photos/wave.jpeg" },
  { key: "ayaPayNumber" as const, label: "AYA Pay", image: "/photos/aya.jpeg" },
  { key: "uabPayNumber" as const, label: "UAB Pay", image: "/photos/uab.png" },
];

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentSettings>({
    accountName: "",
    kbzPayNumber: "",
    wavePayNumber: "",
    ayaPayNumber: "",
    uabPayNumber: "",
    thaiBankDetails: "",
  });
  const [notice, setNotice] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");

  useEffect(() => {
    settingsApi.getAdminSettings()
      .then((settings) => {
        if (settings.payment_settings) {
          try { setPayment(JSON.parse(settings.payment_settings)); } catch { /* ignore */ }
        }
        if (settings.global_notice) setNotice(settings.global_notice);
        if (settings.exchange_rate_thai_baht) setExchangeRate(settings.exchange_rate_thai_baht);
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setIsLoading(false));
  }, []);

  const savePayment = async () => {
    try {
      await settingsApi.updatePaymentSettings(payment as unknown as Record<string, string>);
      toast.success("Payment settings updated");
    } catch {
      toast.error("Failed to update payment settings");
    }
  };

  const saveNotice = async () => {
    try {
      await settingsApi.updateNotice(notice);
      toast.success("Notice updated");
    } catch {
      toast.error("Failed to update notice");
    }
  };

  const saveSecurity = async () => {
    try {
      await settingsApi.updateSecuritySettings(exchangeRate);
      toast.success("Security settings updated");
    } catch {
      toast.error("Failed to update security settings");
    }
  };

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-64" /><Skeleton className="h-32" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">System Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={payment.accountName}
              onChange={(e) => setPayment({ ...payment, accountName: e.target.value })}
            />
          </div>

          {paymentMethods.map(({ key, label, image }) => (
            <div key={key} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="w-24 shrink-0 rounded overflow-hidden border">
                <Image src={image} alt={label} width={120} height={90} className="w-full h-auto object-contain" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="font-semibold">{label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={payment[key]}
                    onChange={(e) => setPayment({ ...payment, [key]: e.target.value })}
                    placeholder="Phone number"
                  />
                  <CopyButton text={payment[key]} />
                </div>
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="thaiBankDetails">Thai Bank Details</Label>
            <div className="flex items-center gap-2">
              <Input
                id="thaiBankDetails"
                value={payment.thaiBankDetails}
                onChange={(e) => setPayment({ ...payment, thaiBankDetails: e.target.value })}
              />
              <CopyButton text={payment.thaiBankDetails} />
            </div>
          </div>

          <Button onClick={savePayment}><Save className="h-4 w-4 mr-2" /> Save Payment Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Global Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notice">Notice Text</Label>
            <Input id="notice" value={notice} onChange={(e) => setNotice(e.target.value)} />
          </div>
          <Button onClick={saveNotice}><Save className="h-4 w-4 mr-2" /> Save Notice</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rate">1 THB = ? MMK</Label>
            <Input id="rate" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />
          </div>
          <Button onClick={saveSecurity}><Save className="h-4 w-4 mr-2" /> Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
