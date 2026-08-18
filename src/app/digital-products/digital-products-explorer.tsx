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
import { ShoppingCart, Search, Check, Package } from "lucide-react";
import { PlanDetailsModal } from "@/components/plan-details-modal";

const categories = [
  "All Products",
  "VPN & Utilities",
  "AI & Smart Tools",
  "Design & Video",
  "Entertainment & Music",
  "Productivity & Office",
];

export function DigitalProductsExplorer({ products }: { products: DigitalProduct[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const activeProducts = products.filter((p) => p.isActive);

  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Products" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <FadeIn>
        <div className="text-center mb-8">
          <Badge className="bg-primary text-primary-foreground border-none px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            Top Digital Products
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Premium Digital Subscriptions & Licenses
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Instant delivery, verified authentic accounts, and full duration warranty.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <label htmlFor="product-search" className="sr-only">Search products</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="product-search"
                type="text"
                placeholder="Search ChatGPT, Canva, Netflix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            No products available yet
          </CardContent>
        </Card>
      ) : (
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
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
  const [showPlans, setShowPlans] = useState(false);

  const defaultVariant = product.variants?.find((v) => v.isActive) ?? null;
  const displayPrice = defaultVariant ? Number(defaultVariant.priceMmk) : Number(product.priceMmk);

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
        variant: defaultVariant
          ? { id: defaultVariant.id, name: defaultVariant.name }
          : undefined,
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
    <>
      <PlanDetailsModal
        product={product}
        open={showPlans}
        onOpenChange={setShowPlans}
      />
      <Card className="group flex flex-col overflow-hidden border-border rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      <div className="relative h-40 bg-gradient-to-br from-primary/5 to-secondary/30 flex items-center justify-center p-6">
        {product.image ? (
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="h-10 w-10 text-primary" />
          </div>
        )}

        {product.badge && (
          <Badge
            className="absolute top-3 right-3 border-none bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase"
          >
            {product.badge}
          </Badge>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col gap-3 p-5">
        <h3 className="font-bold text-lg text-foreground">{product.name}</h3>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}

        {product.features && product.features.length > 0 && (
          <ul className="space-y-1.5 mt-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{feature.name}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Starting from</span>
              <p className="text-xl font-bold text-foreground">{formatMmk(displayPrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPlans(true)}
                className="border-border text-foreground hover:bg-accent"
              >
                Plans
              </Button>
              <Button
                size="sm"
                onClick={handleOrder}
                disabled={isOrdering || !product.inStock}
                className="bg-brand-gradient text-primary-foreground shadow-brand hover:brightness-105 font-semibold gap-1.5"
              >
                {isOrdering ? "..." : <><ShoppingCart className="h-4 w-4" /> Buy</>}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
