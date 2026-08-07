"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { GameCard, GameCardFeatured } from "@/components/game-card";
import { Gamepad2, ChevronRight } from "lucide-react";
import type { Game } from "@/types";

export function HomeContent({ games }: { games: Game[] }) {
  const { isAuthenticated } = useAuth();
  const popularGames = games.filter((g) => g.popular);

  return (
    <>
      {/* Featured Games */}
      {popularGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <FadeIn className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <p className="text-muted-foreground text-sm mt-1">Most popular games this week</p>
            </div>
            <Button variant="ghost" asChild className="gap-1">
              <Link href="/games">View All <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </FadeIn>
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
        <FadeIn className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">All Games</h2>
            <p className="text-muted-foreground text-sm mt-1">Browse our full catalog</p>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {games.slice(0, 12).map((game) => (
            <StaggerItem key={game.id}>
              <GameCard game={game} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
            <FadeIn>
              <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-white/80" />
              <h2 className="text-3xl font-bold text-white mb-2">Start Playing Today</h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
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