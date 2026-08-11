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
import type { DigitalProduct } from "@/types";
import { toast } from "sonner";
import { ShoppingCart, Tag, Package } from "lucide-react";

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

function ProductCard({ product }: { product: DigitalProduct }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const orderMutation = useOrderDigitalProduct();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setIsOrdering(true);
    try {
      await orderMutation.mutateAsync({ productId: product.id, name: product.name, amountMmk: product.priceMmk });
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
          <div className="absolute bottom-3 left-3">
            <Badge className="border-none bg-white/90 text-foreground backdrop-blur">{product.category}</Badge>
          </div>
        </div>
      )}
      <CardContent className="flex-1 flex flex-col justify-between gap-4 p-4">
        <div>
          <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xl font-bold text-primary">{formatMmk(product.priceMmk)}</span>
          <Button size="sm" onClick={handleOrder} disabled={isOrdering || !product.inStock} className="gap-1.5">
            {isOrdering ? "..." : <><ShoppingCart className="h-4 w-4" /> Buy</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}