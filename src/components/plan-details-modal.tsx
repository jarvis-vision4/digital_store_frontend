"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatMmk, resolveImageUrl } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useOrderDigitalProduct } from "@/hooks/queries";
import { ShoppingCart, Star, Check, Package } from "lucide-react";
import type { DigitalProduct, DigitalProductVariant } from "@/types";
import { toast } from "sonner";

interface PlanDetailsModalProps {
  product: DigitalProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanDetailsModal({ product, open, onOpenChange }: PlanDetailsModalProps) {
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
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsOrdering(true);
    try {
      await orderMutation.mutateAsync({
        productId: product.id,
        name: product.name,
        amountMmk: displayPrice,
        variant: selectedVariant
          ? { id: selectedVariant.id, name: selectedVariant.name }
          : undefined,
      });
      toast.success("Order placed successfully!");
      onOpenChange(false);
      router.push("/orders");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order failed";
      toast.error(msg);
    } finally {
      setIsOrdering(false);
    }
  };

  const handleAddToCart = () => {
    toast.success("Added to cart!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              {product.image ? (
                <img
                  src={resolveImageUrl(product.image)}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
                {product.badge && (
                  <Badge className="bg-primary text-primary-foreground border-none text-[10px] px-1.5 py-0.5">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                {Number(product.rating) > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {Number(product.rating).toFixed(1)} Rating
                  </span>
                )}
                {Number(product.salesCount) > 0 && (
                  <span>{product.salesCount}+ Sales</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Plan Selection */}
        <div className="px-6 pb-4">
          <h3 className="text-sm font-semibold mb-3">Select Subscription Plan / Duration:</h3>
          <div className="space-y-2">
            {activeVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedVariant?.id === variant.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{variant.name}</span>
                      {(variant as any).badge && (
                        <Badge className="bg-primary text-primary-foreground border-none text-[10px] px-1.5 py-0.5">
                          {(variant as any).badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{variant.durationDays} Days</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{formatMmk(Number(variant.priceMmk))}</p>
                    {variant.priceUsd && (
                      <p className="text-xs text-muted-foreground">${variant.priceUsd} USD</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-sm font-semibold mb-3">Included Package Features:</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 pt-2 flex gap-3 border-t border-border">
          <Button
            variant="outline"
            className="flex-1 border-border"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleOrder}
            disabled={isOrdering || !product.inStock}
          >
            {isOrdering ? "..." : `Buy Now (${formatMmk(displayPrice)})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
