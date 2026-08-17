"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMmk, resolveImageUrl } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useOrderDigitalProduct } from "@/hooks/queries";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import type { DigitalProduct, DigitalProductVariant } from "@/types";
import { toast } from "sonner";
import { ShoppingCart, Tag, Package, Star, Flame } from "lucide-react";

export function DigitalProductsExplorer({ products }: { products: DigitalProduct[] }) {
  const activeProducts = products.filter((p) => p.isActive);

  return (
    <>
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Digital Products <Package className="h-5 w-5 text-primary" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gift cards, redeem codes, and digital items</p>
        </div>
      </FadeIn>

      {activeProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">No products available yet</CardContent>
        </Card>
      ) : (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </>
  );
}

function VariantPicker({
  variants,
  selected,
  onSelect,
}: {
  variants: DigitalProductVariant[];
  selected: DigitalProductVariant | null;
  onSelect: (v: DigitalProductVariant) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {variants.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onSelect(v)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            selected?.id === v.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/60 text-muted-foreground hover:border-primary/40"
          }`}
        >
          {v.name}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: DigitalProduct }) {
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
    <Card className="group flex flex-col overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      {product.image ? (
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge className="border-none bg-white/90 text-foreground backdrop-blur">{product.category}</Badge>
            {!product.inStock && <Badge variant="destructive" className="border-none">Out of Stock</Badge>}
          </div>
        </div>
      ) : (
        <div className="relative h-44 bg-gradient-to-br from-primary/15 via-card to-secondary/15 flex items-center justify-center">
          <Tag className="h-12 w-12 text-primary/40" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge className="border-none bg-white/90 text-foreground backdrop-blur">{product.category}</Badge>
            {!product.inStock && <Badge variant="destructive" className="border-none">Out of Stock</Badge>}
          </div>
        </div>
      )}
      <CardContent className="flex-1 flex flex-col justify-between gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
            {product.badge && (
              <Badge className="border-none bg-primary text-primary-foreground shrink-0">
                <Flame className="h-3 w-3 mr-1" /> {product.badge}
              </Badge>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            {Number(product.rating) > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {Number(product.rating).toFixed(1)}
              </span>
            )}
            {Number(product.salesCount) > 0 && <span>{product.salesCount} sold</span>}
          </div>
        </div>

        {activeVariants.length > 0 && (
          <VariantPicker
            variants={activeVariants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            {selectedVariant ? (
              <>
                <span className="text-xl font-bold text-primary">{formatMmk(displayPrice)}</span>
                {selectedVariant.durationDays > 0 && (
                  <p className="text-[11px] text-muted-foreground">{selectedVariant.durationDays} days</p>
                )}
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatMmk(displayPrice)}</span>
            )}
          </div>
          <Button size="sm" onClick={handleOrder} disabled={isOrdering || !product.inStock} className="gap-1.5">
            {isOrdering ? "..." : <><ShoppingCart className="h-4 w-4" /> Buy</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
