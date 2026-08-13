"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatMmk } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/queries";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import type { Game, GamePackage } from "@/types";
import { toast } from "sonner";
import { Package, ArrowLeft, Check, ShoppingCart, AlertTriangle, Sparkles } from "lucide-react";
import { GameImage } from "@/components/game-image";

export function GameDetail({ game }: { game: Game }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const orderMutation = useCreateOrder();
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const selectedPkg = game.packages.find((p) => p.id === selectedPackageId);
  const activePkgs = game.packages.filter((p) => p.isActive);

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
      await orderMutation.mutateAsync({
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

  return (
    <>
      <Button variant="ghost" asChild className="mb-4 -ml-2">
        <Link href="/games">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Games
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Banner */}
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/15 via-card to-secondary/20 p-6">
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/15 blur-3xl" />
              <div className="relative flex items-start gap-5">
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
                </div>
              </div>
            </div>
          </FadeIn>

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
              <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {activePkgs.map((pkg) => (
                  <StaggerItem key={pkg.id}>
                    <PackageCard
                      pkg={pkg}
                      isSelected={selectedPackageId === pkg.id}
                      onSelect={() => setSelectedPackageId(pkg.id)}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
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

                  <Button size="lg" className="w-full gap-2" onClick={handleOrder} disabled={isOrdering}>
                    {isOrdering ? "Processing..." : isAuthenticated ? (
                      <><ShoppingCart className="h-4 w-4" /> Place Order</>
                    ) : "Login to Order"}
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
                  <p className="text-sm text-muted-foreground">Select a package above to place an order</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PackageCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: GamePackage;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isOutOfStock = pkg.stockQuantity <= 0;
  const discount = pkg.originalPrice
    ? Math.round((1 - Number(pkg.priceMmk) / Number(pkg.originalPrice)) * 100)
    : 0;

  return (
    <motion.div
      whileHover={isOutOfStock ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-200 relative overflow-hidden ${
          isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/20 border-primary/40" : "hover:shadow-md hover:border-border"
        } ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => !isOutOfStock && onSelect()}
      >
        {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />}
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
            <p className="text-2xl font-bold text-primary">{formatMmk(Number(pkg.priceMmk))}</p>
            {pkg.originalPrice && <p className="text-sm text-muted-foreground line-through">{formatMmk(Number(pkg.originalPrice))}</p>}
            <p className={`text-xs mt-2 font-medium ${isOutOfStock ? "text-destructive" : pkg.stockQuantity <= 5 ? "text-amber-500" : "text-emerald-600"}`}>
              {isOutOfStock ? "Out of Stock" : pkg.stockQuantity <= 5 ? `Only ${pkg.stockQuantity} left` : "In Stock"}
            </p>
            {isSelected && (
              <Check className="absolute top-3 right-3 h-4 w-4 text-primary" />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}