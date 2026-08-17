"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { formatMmk, resolveImageUrl } from "@/lib/utils";
import { ChevronRight, Zap, ShieldCheck, Clock, Wallet, Star, Tag, Flame } from "lucide-react";
import type { DigitalProduct, Order } from "@/types";

/* ── Why Choose Us ── */
const features = [
  { icon: Zap, title: "Fast Delivery", desc: "Instant delivery after payment" },
  { icon: ShieldCheck, title: "100% Secure", desc: "Safe & secure transactions" },
  { icon: Clock, title: "24/7 Support", desc: "We are always here to help" },
  { icon: Wallet, title: "Best Price", desc: "Affordable prices for all" },
];

function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading
        eyebrow="Our Promise"
        title="Why Choose Us?"
        description="Everything you need for a smooth, worry-free experience."
      />
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <div className="group h-full rounded-2xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-sm">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ── Product grid ── */
const badgeColors: Record<string, string> = {
  "HOT": "bg-yellow-400 text-yellow-900",
  "POPULAR": "bg-yellow-400 text-yellow-900",
  "BUSINESS": "bg-yellow-400 text-yellow-900",
  "4K UHD": "bg-yellow-400 text-yellow-900",
  "SONNET 3.7": "bg-yellow-400 text-yellow-900",
  "2M CONTEXT": "bg-yellow-400 text-yellow-900",
  "V6.1": "bg-yellow-400 text-yellow-900",
  "BESTSELLER": "bg-yellow-400 text-yellow-900",
  "OFFICIAL": "bg-yellow-400 text-yellow-900",
  "PRO": "bg-yellow-400 text-yellow-900",
  "PREMIUM": "bg-yellow-400 text-yellow-900",
};

function ProductGrid({ products }: { products: DigitalProduct[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-yellow-400 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Top Digital Products</h2>
        </div>
        <Link
          href="/digital-products"
          className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          View All Products <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Products Grid */}
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <StaggerItem key={product.id}>
            <Link
              href={`/digital-products/${product.id}`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10"
            >
              {/* Icon + Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      className="h-14 w-14 object-cover"
                    />
                  ) : (
                    <Tag className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                {product.badge && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      badgeColors[product.badge] || "bg-yellow-400 text-yellow-900"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Name + Description */}
              <h3 className="font-bold text-base text-slate-900 mb-1">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{product.description}</p>
              )}

              {/* Price + Add Button */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="font-bold text-lg text-slate-900">{formatMmk(product.priceMmk)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle add to cart
                  }}
                  className="h-10 w-10 rounded-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 flex items-center justify-center transition-colors"
                >
                  <span className="text-xl leading-none">+</span>
                </button>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ── Customer Reviews ── */
function CustomerReviews({ reviews }: { reviews: Order[] }) {
  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading
        eyebrow="Testimonials"
        title="Customer Reviews"
        description="See what our community has to say."
      />
      {displayReviews.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">No reviews yet.</p>
      ) : (
        <Stagger className="grid gap-4 md:grid-cols-3">
          {displayReviews.map((r) => (
            <StaggerItem key={r.id}>
              <div className="rounded-2xl border border-border/60 bg-card p-5 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {(r.user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{r.user?.username}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {Array.from({ length: r.rating ?? 0 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {r.gameName} · {r.packageName}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.reviewText}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}

/* ── Main HomeContent ── */
export function HomeContent({ products, reviews }: { products: DigitalProduct[]; reviews: Order[] }) {
  return (
    <>
      {/* Top Digital Products */}
      <ProductGrid products={products} />

      {/* Customer Reviews */}
      <CustomerReviews reviews={reviews} />

      {/* Why Choose Us */}
      <WhyChooseUs />
    </>
  );
}
