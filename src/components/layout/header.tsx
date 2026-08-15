"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWalletBalance } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShweLogo } from "@/components/shwe-logo";
import { Wallet, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { formatMmk } from "@/lib/utils";

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { data: balanceData } = useWalletBalance(isAuthenticated);
  const balance = balanceData ? Number(balanceData.balance) : null;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/digital-products", label: "Digital Products" },
    { href: "/wallet", label: "Topup Wallet" },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <ShweLogo size={38} />
          <div className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight">Shwe Family</span>
            <span className="block text-[11px] font-semibold text-primary tracking-wide">Digital Store</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors rounded-lg hover:bg-destructive/5"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Wallet (auth only) */}
          {isAuthenticated && (
            <Link
              href="/wallet"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm font-medium hover:border-primary/40 transition-colors"
            >
              <Wallet className="h-4 w-4 text-primary" />
              <span>{formatMmk(balance ?? user?.walletBalance ?? 0)}</span>
            </Link>
          )}

          {/* Auth buttons */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-primary/30">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email || user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet">Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              <Link href="/login">Login / Register</Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/98 backdrop-blur">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
