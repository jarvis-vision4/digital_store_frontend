"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Gamepad2, Key, ShoppingCart, Wallet } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/digital-products", label: "Products", icon: Key },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 inset-x-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/95 px-2 py-1.5 shadow-2xl shadow-black/10 backdrop-blur supports-[backdrop-filter]:bg-background/80 pointer-events-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-all",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
