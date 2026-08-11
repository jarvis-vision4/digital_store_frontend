"use client";

import Link from "next/link";
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
import { Wallet, Gamepad2, Menu } from "lucide-react";
import { formatMmk } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { data: balanceData } = useWalletBalance(isAuthenticated);
  const balance = balanceData ? Number(balanceData.balance) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span>Shwe Family Store</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6 text-sm">
          <Link href="/games" className="font-medium hover:text-primary transition-colors">
            Games
          </Link>
          <Link href="/digital-products" className="font-medium hover:text-primary transition-colors">
            Digital Products
          </Link>
          <Link href="/orders" className="font-medium hover:text-primary transition-colors">
            Orders
          </Link>
          <Link href="/wallet" className="font-medium hover:text-primary transition-colors">
            Wallet
          </Link>
          {isAdmin && (
            <Link href="/admin" className="font-medium text-destructive hover:text-destructive/80 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-sm font-medium">
              <Wallet className="h-4 w-4 text-primary" />
              <span>{formatMmk(balance ?? user.walletBalance ?? 0)}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
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
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
