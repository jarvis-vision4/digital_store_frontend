"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { GameCard, GameCardFeatured } from "@/components/game-card";
import { Gamepad2, ChevronRight, Zap, ShieldCheck, Clock, Wallet } from "lucide-react";
import type { Game } from "@/types";

const features = [
  { icon: Zap, title: "Instant Delivery", desc: "Credits delivered in minutes, not hours." },
  { icon: ShieldCheck, title: "Secure & Trusted", desc: "Encrypted payments and verified orders." },
  { icon: Clock, title: "24/7 Support", desc: "Our team is here whenever you need us." },
  { icon: Wallet, title: "Best Prices", desc: "Competitive rates on every top-up." },
];

export function HomeContent({ games }: { games: Game[] }) {
  const { isAuthenticated } = useAuth();
  const popularGames = games.filter((g) => g.popular);

  return (
    <>
      {/* Featured Games */}
      {popularGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeading
            eyebrow="Hot Right Now"
            title="Trending Games"
            description="The most popular top-ups from our community this week."
            action={
              <Button variant="ghost" asChild className="gap-1 shrink-0">
                <Link href="/games">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
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

      {/* Why Choose Us */}
      <section className="relative overflow-hidden border-y border-border/60 bg-card/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Why Shwe Family"
            title="A Better Way to Top Up"
            description="Everything you need for a smooth, worry-free experience."
          />
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="group h-full rounded-2xl border border-border/60 bg-background p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

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
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}
