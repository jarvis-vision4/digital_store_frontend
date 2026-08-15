"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { formatMmk, resolveImageUrl } from "@/lib/utils";
import { ChevronRight, Zap, ShieldCheck, Clock, Wallet, Star, Tag } from "lucide-react";
import type { DigitalProduct, Order } from "@/types";

/* ── Top Products (category icon cards) ── */
const categoryIcons: Record<string, string> = {
  gift_card: "🎁",
  social_service: "💬",
  streaming: "🎬",
  ai_tool: "🤖",
  software: "💻",
  redeem_code: "🔑",
  mobile_app: "📲",
};

function TopProducts({ products }: { products: DigitalProduct[] }) {
  const categoryMap = products.reduce<Record<string, { count: number; sample: DigitalProduct }>>(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = { count: 0, sample: p };
      acc[p.category].count += 1;
      return acc;
    },
    {}
  );
  const categories = Object.entries(categoryMap);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading
        eyebrow="Our Services"
        title="Top Digital Products"
        action={
          <Button variant="ghost" asChild className="gap-1 shrink-0">
            <Link href="/digital-products">View All <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        }
      />
      <FadeIn>
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">
          {categories.map(([cat, { count, sample }]) => (
            <Link
              key={cat}
              href="/digital-products"
              className="group/card shrink-0 snap-start flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card px-5 py-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 w-[120px]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform group-hover/card:scale-110">
                {sample.image ? (
                  <img
                    src={resolveImageUrl(sample.image)}
                    alt={sample.name}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                ) : (
                  categoryIcons[cat] || "🛍️"
                )}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{cat}</span>
              <span className="text-[10px] text-muted-foreground">{count} items</span>
            </Link>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

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
function ProductGrid({ products }: { products: DigitalProduct[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading
        eyebrow="Hot Right Now"
        title="Trending Digital Products"
        description="The most popular products from our store."
        action={
          <Button variant="ghost" asChild className="gap-1 shrink-0">
            <Link href="/digital-products">View All <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        }
      />
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <StaggerItem key={product.id}>
            <Link
              href="/digital-products"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary/15 via-card to-secondary/15">
                {product.image ? (
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Tag className="h-10 w-10 text-primary/50" />
                )}
                {!product.inStock && (
                  <span className="absolute top-2 right-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-white">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                <p className="mt-1 text-[11px] text-muted-foreground capitalize">{product.category}</p>
                <span className="mt-2 text-sm font-bold text-primary">{formatMmk(product.priceMmk)}</span>
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
      <TopProducts products={products} />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Trending Digital Products */}
      <ProductGrid products={products} />

      {/* Customer Reviews */}
      <CustomerReviews reviews={reviews} />
    </>
  );
}
