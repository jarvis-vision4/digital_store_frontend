"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSettings, useGlobalNotice, useUpdateNotice, useUpdatePaymentSettings, useUpdateSecuritySettings, useSupportContacts, useUpdateSupportContacts } from "@/hooks/queries";
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

const contactFields = [
  { key: "telegram" as const, label: "Telegram", placeholder: "https://t.me/your_username" },
  { key: "tiktok" as const, label: "TikTok", placeholder: "https://www.tiktok.com/@username" },
  { key: "facebook" as const, label: "Facebook", placeholder: "https://www.facebook.com/page" },
  { key: "phone" as const, label: "Phone", placeholder: "+959..." },
  { key: "viber" as const, label: "Viber", placeholder: "+959..." },
];

export default function AdminSettingsPage() {
  const { data: settings, isPending } = useAdminSettings();
  const { data: noticeData } = useGlobalNotice();
  const updatePaymentMutation = useUpdatePaymentSettings();
  const updateNoticeMutation = useUpdateNotice();
  const updateSecurityMutation = useUpdateSecuritySettings();
  const updateSupportMutation = useUpdateSupportContacts();
  const { data: supportContacts } = useSupportContacts();

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
  const [contacts, setContacts] = useState({
    telegram: "",
    tiktok: "",
    facebook: "",
    phone: "",
    viber: "",
  });

  useEffect(() => {
    if (!settings) return;
    if (settings.payment_settings) {
      try { setPayment(JSON.parse(settings.payment_settings)); } catch { /* ignore */ }
    }
    if (settings.exchange_rate_thai_baht) setExchangeRate(settings.exchange_rate_thai_baht);
  }, [settings]);

  useEffect(() => {
    if (!noticeData) return;
    if (noticeData.notice) setNotice(noticeData.notice);
  }, [noticeData]);

  useEffect(() => {
    if (!supportContacts) return;
    setContacts((prev) => ({ ...prev, ...supportContacts }));
  }, [supportContacts]);

  const savePayment = async () => {
    try {
      await updatePaymentMutation.mutateAsync(payment as unknown as Record<string, string>);
      toast.success("Payment settings updated");
    } catch {
      toast.error("Failed to update payment settings");
    }
  };

  const saveNotice = async () => {
    try {
      await updateNoticeMutation.mutateAsync(notice);
      toast.success("Notice updated");
    } catch {
      toast.error("Failed to update notice");
    }
  };

  const saveSecurity = async () => {
    try {
      await updateSecurityMutation.mutateAsync(exchangeRate);
      toast.success("Security settings updated");
    } catch {
      toast.error("Failed to update security settings");
    }
  };

  const saveSupport = async () => {
    try {
      await updateSupportMutation.mutateAsync(contacts);
      toast.success("Contact channels updated");
    } catch {
      toast.error("Failed to update contact channels");
    }
  };

  if (isPending) {
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
          <CardTitle>Contact Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactFields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`contact-${key}`}>{label}</Label>
              <Input
                id={`contact-${key}`}
                value={contacts[key]}
                onChange={(e) => setContacts({ ...contacts, [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}
          <Button onClick={saveSupport}><Save className="h-4 w-4 mr-2" /> Save Contact Channels</Button>
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
