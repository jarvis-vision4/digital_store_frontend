"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { gamesApi, ordersApi } from "@/lib/api";
import { formatMmk } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { Game } from "@/types";
import { toast } from "sonner";
import { Package, ArrowLeft, Check, ShoppingCart, AlertTriangle, Sparkles } from "lucide-react";
import { GameImage } from "@/components/game-image";
import Link from "next/link";

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    gamesApi.getGame(id)
      .then(setGame)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const selectedPkg = game?.packages.find((p) => p.id === selectedPackageId);

  const handleOrder = async () => {
    if (!game || !selectedPkg) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!playerId.trim()) {
      toast.error("Please enter your Player ID");
      return;
    }
    if (!zoneId.trim()) {
      toast.error("Please enter your Zone / Server");
      return;
    }
    setIsOrdering(true);
    try {
      await ordersApi.createOrder({
        gameId: game.id,
        gameName: game.name,
        packageName: selectedPkg.packageName,
        amountMmk: Number(selectedPkg.priceMmk),
        playerId: playerId.trim(),
        zoneId: zoneId.trim(),
      });
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      toast.error(message);
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-56" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
              </div>
            </div>
            <Skeleton className="h-64 lg:sticky lg:top-6" />
          </div>
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="text-center py-24">
          <h2 className="text-xl font-bold">Game not found</h2>
          <Button asChild className="mt-4">
            <Link href="/games">Back to Games</Link>
          </Button>
        </main>
      </div>
    );
  }

  const activePkgs = game.packages.filter((p) => p.isActive);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/games">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Games
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/15 via-card to-secondary/20">
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/15 blur-3xl" />
              <div className="relative flex items-start gap-5 p-6">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-md opacity-70" />
                  <GameImage value={game.image} className="relative h-24 w-24 rounded-2xl object-cover shadow-xl ring-2 ring-white/20" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{game.name}</h1>
                    {game.popular && (
                      <Badge className="border-none bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Sparkles className="h-3 w-3 mr-1" /> Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1.5">{game.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="bg-muted">{game.minAmount}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Package</h2>
              {activePkgs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    No packages available for this game yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {activePkgs.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const isOutOfStock = pkg.stockQuantity <= 0;
                    const discount = pkg.originalPrice
                      ? Math.round((1 - Number(pkg.priceMmk) / Number(pkg.originalPrice)) * 100)
                      : 0;

                    return (
                      <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-all duration-200 relative overflow-hidden ${
                          isSelected
                            ? "ring-2 ring-primary shadow-lg shadow-primary/20 border-primary/40"
                            : "hover:shadow-md hover:border-border"
                        } ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => !isOutOfStock && setSelectedPackageId(pkg.id)}
                      >
                        {isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                        )}
                        {discount > 0 && (
                          <Badge className="absolute top-3 left-3 border-none bg-emerald-500 text-white">-{discount}%</Badge>
                        )}
                        <CardHeader className="pb-2 pt-5">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate">{pkg.packageName}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-primary">
                              {formatMmk(Number(pkg.priceMmk))}
                            </p>
                            {pkg.originalPrice && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatMmk(Number(pkg.originalPrice))}
                              </p>
                            )}
                            <p className={`text-xs mt-2 font-medium ${isOutOfStock ? "text-destructive" : pkg.stockQuantity <= 5 ? "text-amber-500" : "text-emerald-600"}`}>
                              {isOutOfStock ? "Out of Stock" : pkg.stockQuantity <= 5 ? `Only ${pkg.stockQuantity} left` : "In Stock"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-4">
              {selectedPkg ? (
                <Card className="overflow-hidden border-border/50">
                  <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>{selectedPkg.packageName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="playerId">Player ID <span className="text-destructive">*</span></Label>
                      <Input
                        id="playerId"
                        placeholder="Enter your game ID"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zoneId">Zone / Server <span className="text-destructive">*</span></Label>
                      <Input
                        id="zoneId"
                        placeholder="Enter server/zone"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Package</span>
                        <span>{selectedPkg.packageName}</span>
                      </div>
                      {selectedPkg.originalPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Original Price</span>
                          <span className="line-through">{formatMmk(Number(selectedPkg.originalPrice))}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-primary">{formatMmk(Number(selectedPkg.priceMmk))}</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full gap-2"
                      onClick={handleOrder}
                      disabled={isOrdering}
                    >
                      {isOrdering ? (
                        "Processing..."
                      ) : isAuthenticated ? (
                        <><ShoppingCart className="h-4 w-4" /> Place Order</>
                      ) : (
                        "Login to Order"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Make sure your Player ID is correct
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="text-center py-8">
                    <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Select a package above to place an order
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
