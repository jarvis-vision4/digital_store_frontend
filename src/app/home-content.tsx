"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { GameCard, GameCardFeatured } from "@/components/game-card";
import { Gamepad2, ChevronRight, Zap, ShieldCheck, Clock, Wallet, Star, CheckCircle, ChevronLeft } from "lucide-react";
import { categoryLabels } from "@/lib/constants";
import { resolveImageUrl, cn } from "@/lib/utils";
import type { Game } from "@/types";
import { useRef } from "react";

/* ── Top Products (category icon cards) ── */
const categoryIcons: Record<string, string> = {
  mobile_games: "📱",
  pc_games: "💻",
  gift_card: "🎁",
  mobile_app: "📲",
  redeem_code: "🔑",
  social_service: "💬",
};

function TopProducts({ games }: { games: Game[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoryMap = games.reduce<Record<string, { count: number; sample: Game }>>((acc, g) => {
    if (!acc[g.category]) acc[g.category] = { count: 0, sample: g };
    acc[g.category].count += 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryMap);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

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
        <div className="relative group">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">
            {categories.map(([cat, { count, sample }]) => {
              const imageUrl = resolveImageUrl(sample.image);
              const isImage = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
              return (
                <Link
                  key={cat}
                  href="/games"
                  className="group/card shrink-0 snap-start flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card px-5 py-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 w-[120px]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform group-hover/card:scale-110">
                    {isImage ? (
                      <img src={imageUrl} alt={sample.name} className="h-14 w-14 rounded-2xl object-cover" />
                    ) : (
                      categoryIcons[cat] || "🎮"
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight">
                    {categoryLabels[cat] ?? cat}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{count} items</span>
                </Link>
              );
            })}
          </div>
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

/* ── Customer Reviews ── */
const reviews = [
  {
    name: "Mg Kaung Htet",
    initials: "KH",
    rating: 5,
    time: "2 days ago",
    text: "Very fast service and trustable. I bought Mobile Legends diamonds, worked perfectly!",
  },
  {
    name: "May Thiri",
    initials: "MT",
    rating: 5,
    time: "5 days ago",
    text: "Digital products are delivered instantly. Great experience with the wallet topup system.",
  },
  {
    name: "Aung Myo",
    initials: "AM",
    rating: 5,
    time: "1 week ago",
    text: "Best prices for game top-ups. The referral bonus is a nice touch!",
  },
];

function CustomerReviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading
        eyebrow="Testimonials"
        title="Customer Reviews"
        description="See what our community has to say."
        action={
          <Button variant="ghost" asChild className="gap-1 shrink-0">
            <span>View All <ChevronRight className="h-4 w-4" /></span>
          </Button>
        }
      />
      <Stagger className="grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <StaggerItem key={r.name}>
            <div className="rounded-2xl border border-border/60 bg-card p-5 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{r.time}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ── Main HomeContent ── */
export function HomeContent({ games }: { games: Game[] }) {
  const { isAuthenticated } = useAuth();
  const popularGames = games.filter((g) => g.popular);

  return (
    <>
      {/* Top Digital Products */}
      <TopProducts games={games} />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Featured Games */}
      {popularGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeading
            eyebrow="Hot Right Now"
            title="Trending Games"
            description="The most popular top-ups from our community."
            action={
              <Button variant="ghost" asChild className="gap-1 shrink-0">
                <Link href="/games">View All <ChevronRight className="h-4 w-4" /></Link>
              </Button>
            }
          />
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularGames.slice(0, 3).map((game) => (
              <StaggerItem key={game.id}>
                <GameCardFeatured game={game} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* All Games Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <SectionHeading
          eyebrow="Full Catalog"
          title="All Games"
          description="Browse every title available in the store."
        />
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {games.slice(0, 12).map((game) => (
            <StaggerItem key={game.id}>
              <GameCard game={game} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* CTA */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-amber-500" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
            <FadeIn>
              <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-white/90" />
              <h2 className="text-3xl font-bold text-white mb-2">Start Playing Today</h2>
              <p className="text-white/85 mb-6 max-w-md mx-auto">
                Top up your favorite games instantly. Fast delivery, best prices.
              </p>
              <Button size="lg" variant="secondary" asChild className="rounded-full px-8 font-semibold">
                <Link href="/register">Create Account</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}
