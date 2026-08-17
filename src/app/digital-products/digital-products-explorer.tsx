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
import { ShoppingCart, Search, Check } from "lucide-react";

const categories = [
  "All Products",
  "VPN & Utilities",
  "AI & Smart Tools",
  "Design & Video",
  "Entertainment & Music",
  "Productivity & Office",
];

const badgeColors: Record<string, string> = {
  "OFFICIAL": "bg-blue-500",
  "ULTRA FAST": "bg-red-500",
  "UNBLOCKABLE": "bg-emerald-500",
  "V2RAY VIP": "bg-purple-500",
  "PREMIUM": "bg-amber-500",
  "PRO": "bg-indigo-500",
};

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
      {/* Header Section */}
      <FadeIn>
        <div className="text-center mb-8">
          <Badge className="bg-yellow-400 text-yellow-900 border-none px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            TOP DIGITAL PRODUCTS
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Premium Digital Subscriptions & Licenses
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            Instant delivery, verified authentic accounts, private passwords, and full duration warranty.
          </p>
        </div>
      </FadeIn>

      {/* Search and Filter Section */}
      <FadeIn>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ChatGPT, Canva, Netflix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-yellow-400 text-yellow-900 shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Products Grid */}
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
              ? "border-yellow-400 bg-yellow-50 text-yellow-700"
              : "border-slate-200 text-slate-600 hover:border-yellow-400"
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
      router.push("/orders");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order failed";
      toast.error(msg);
    } finally {
      setIsOrdering(false);
    }
  };

  const badgeColor = badgeColors[product.badge || ""] || "bg-yellow-400";

  return (
    <Card className="group flex flex-col overflow-hidden border-slate-200 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Icon/Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        {product.image ? (
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <Badge
            className={`absolute top-3 right-3 border-none ${badgeColor} text-white px-2 py-0.5 text-[10px] font-bold uppercase`}
          >
            {product.badge}
          </Badge>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col gap-3 p-5">
        {/* Product Name */}
        <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        )}

        {/* Features List */}
        {product.features && product.features.length > 0 && (
          <ul className="space-y-1.5 mt-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <span>{feature.name}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Variant Picker */}
        {activeVariants.length > 0 && (
          <VariantPicker
            variants={activeVariants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        {/* Price and Actions */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Starting from</span>
              <p className="text-xl font-bold text-slate-900">{formatMmk(displayPrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/digital-products/${product.id}`)}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Plans
              </Button>
              <Button
                size="sm"
                onClick={handleOrder}
                disabled={isOrdering || !product.inStock}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold gap-1.5"
              >
                {isOrdering ? "..." : <><ShoppingCart className="h-4 w-4" /> Buy</>}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
