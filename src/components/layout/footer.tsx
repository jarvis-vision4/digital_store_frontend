"use client";

import Link from "next/link";
import { ShweLogo } from "@/components/shwe-logo";
import { Headphones, CreditCard, ShieldCheck, MapPin } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Digital Products", href: "/digital-products" },
  { label: "Orders", href: "/orders" },
  { label: "Wallet", href: "/wallet" },
];

const contactItems = [
  { icon: Headphones, label: "Quick Support", value: "+95 9 123 456 789" },
  { icon: CreditCard, label: "Payment Methods", value: "KBZPay, WavePay, AYA Pay" },
  { icon: ShieldCheck, label: "Secure Payment", value: "100% secure & safe" },
  { icon: MapPin, label: "Our Location", value: "Yangon, Myanmar" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-card/40">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        {/* Contact strip */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {contactItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/40" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <ShweLogo size={30} />
            <div className="leading-tight">
              <span className="block text-sm font-bold">Shwe Family</span>
              <span className="block text-[10px] font-semibold text-primary">Digital Store</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shwe Family Digital Store. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Facebook">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* Telegram */}
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Telegram">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            {/* TikTok */}
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" aria-label="TikTok">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
