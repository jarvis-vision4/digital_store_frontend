"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { gamesApi } from "@/lib/api";
import { formatMmk } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { DigitalProduct } from "@/types";
import { toast } from "sonner";
import { Key, ShoppingCart } from "lucide-react";

export default function DigitalProductsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gamesApi.getDigitalProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const activeProducts = products.filter((p) => p.isActive);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Digital Products</h1>
          <p className="text-muted-foreground">Browse gift cards, redeem codes, and digital items</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : activeProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">No products available yet</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: DigitalProduct }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setIsOrdering(true);
    try {
      await gamesApi.orderDigitalProduct(product.id, product.name, product.priceMmk);
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
    <>
      <Card key={product.id} className="flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{product.name}</CardTitle>
          </div>
          {product.category && <CardDescription>{product.category}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between gap-4">
          <div>
            {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}
            <Badge variant="outline" className="mt-2">Stock: {product.stock}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">{formatMmk(product.priceMmk)}</span>
            <Button size="sm" onClick={handleOrder} disabled={isOrdering || product.stock <= 0}>
              {isOrdering ? "..." : <><ShoppingCart className="h-4 w-4 mr-1" /> Buy</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
