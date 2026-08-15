"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Gamepad2, Wallet, ShoppingCart, User, MessageCircle } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/digital-products", label: "Products", icon: Gamepad2 },
  { href: "/wallet", label: "Topup", icon: Wallet },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/contact", label: "Contact", icon: MessageCircle },
  { href: "/profile", label: "Account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border/40 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/80 pointer-events-auto safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-all min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                isActive ? "bg-primary/10" : ""
              )}>
                <Icon className="h-5 w-5" />
              </div>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
