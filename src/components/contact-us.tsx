"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSupportContacts } from "@/hooks/queries";
import { MessageCircle, Send, Music2, ThumbsUp, Phone } from "lucide-react";

const DEFAULT_CONTACTS = {
  phone: "09782782870",
  telegram: "https://t.me/shwefamilydm",
  tiktok: "https://www.tiktok.com/@shwefamily_dm",
  facebook: "https://www.facebook.com/shwefamilydm",
};

const channels = [
  { key: "phone" as const, label: "Phone", icon: Phone },
  { key: "telegram" as const, label: "Telegram", icon: Send },
  { key: "tiktok" as const, label: "TikTok", icon: Music2 },
  { key: "facebook" as const, label: "Facebook", icon: ThumbsUp },
];

export function ContactUs() {
  const { data: contacts } = useSupportContacts();
  const merged = { ...DEFAULT_CONTACTS, ...contacts };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-[#FAC800]" />
          <h2 className="text-lg font-bold">Contact Us After Ordering</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          After placing your order, message us on any channel below with your order details for fast delivery.
        </p>
        <div className="flex flex-wrap gap-3">
          {channels.map(({ key, label, icon: Icon }) => {
            const url = merged[key];
            if (!url) return null;
            const isPhone = key === "phone";
            const href = isPhone ? `tel:${url}` : url;
            return (
              <a
                key={key}
                href={href}
                target={isPhone ? undefined : "_blank"}
                rel={isPhone ? undefined : "noopener noreferrer"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FAC800]/60 bg-[#FEFCE8] text-sm font-medium hover:bg-[#FAC800]/20 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
                {isPhone && <span className="font-bold text-primary">{url}</span>}
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
