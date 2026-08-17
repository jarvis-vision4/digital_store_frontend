"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatMmk, resolveImageUrl } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useOrderDigitalProduct } from "@/hooks/queries";
import type { DigitalProduct, DigitalProductVariant } from "@/types";
import { toast } from "sonner";
import { Check, ChevronLeft, ShoppingCart, Star, Package } from "lucide-react";

export function DigitalProductDetail({ product }: { product: DigitalProduct }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const orderMutation = useOrderDigitalProduct();
  const [isOrdering, setIsOrdering] = useState(false);

  const activeVariants = product.variants?.filter((v) => v.isActive) ?? [];
  const [selectedVariant, setSelectedVariant] = useState<DigitalProductVariant | null>(
    activeVariants[0] ?? null,
  );
  const displayPrice = selectedVariant ? Number(selectedVariant.priceMmk) : Number(product.priceMmk);

  const handleOrder = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setIsOrdering(true);
    try {
      await orderMutation.mutateAsync({
        productId: product.id,
        name: product.name,
        amountMmk: displayPrice,
        variant: selectedVariant ? { id: selectedVariant.id, name: selectedVariant.name } : undefined,
      });
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order failed";
      toast.error(msg);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/digital-products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <Card className="overflow-hidden">
          <div className="relative h-72 bg-gradient-to-br from-primary/5 to-secondary/30 flex items-center justify-center p-8">
            {product.image ? (
              <img
                src={resolveImageUrl(product.image)}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-32 w-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Package className="h-14 w-14 text-primary" />
              </div>
            )}
            {product.badge && (
              <Badge className="absolute top-4 right-4 border-none bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase">
                {product.badge}
              </Badge>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <div>
            <Badge variant="outline" className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            {product.description && (
              <p className="text-muted-foreground mt-2">{product.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              {Number(product.rating) > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {Number(product.rating).toFixed(1)} rating
                </span>
              )}
              {Number(product.salesCount) > 0 && <span>{product.salesCount} sold</span>}
            </div>
          </div>

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">What&apos;s included</h3>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f.id} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeVariants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Choose a plan</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeVariants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={selectedVariant?.id === v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      selectedVariant?.id === v.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{v.name}</span>
                      {v.badge && (
                        <Badge className="border-none bg-primary text-primary-foreground text-[10px]">{v.badge}</Badge>
                      )}
                    </div>
                    <p className="text-sm font-bold text-primary mt-1">{formatMmk(Number(v.priceMmk))}</p>
                    {v.durationDays > 0 && (
                      <p className="text-xs text-muted-foreground">{v.durationDays} days</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="text-xs text-muted-foreground">{selectedVariant ? "Plan price" : "Price"}</p>
              <p className="text-2xl font-bold text-foreground">{formatMmk(displayPrice)}</p>
            </div>
            <Button size="lg" onClick={handleOrder} disabled={isOrdering || !product.inStock} className="gap-2 font-semibold">
              {isOrdering ? "..." : <><ShoppingCart className="h-4 w-4" /> Buy Now</>}
            </Button>
          </div>
          {!product.inStock && (
            <p className="text-sm text-destructive">This product is currently out of stock.</p>
          )}
        </div>
      </div>
    </div>
  );
}
