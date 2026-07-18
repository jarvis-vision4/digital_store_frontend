"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { gamesApi, settingsApi } from "@/lib/api";
import type { Game, PromotionalBanner } from "@/types";
import { Gamepad2, Star, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([gamesApi.getGames(), settingsApi.getActiveBanners()])
      .then(([gamesData, bannersData]) => {
        setGames(gamesData);
        setBanners(bannersData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Banners */}
      {banners.length > 0 && (
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {banners.slice(0, 3).map((banner) => (
                <Card key={banner.id} className="relative overflow-hidden border-primary/10">
                  <div className="aspect-video bg-muted flex items-center justify-center text-4xl">
                    🎮
                  </div>
                  <CardContent className="p-4">
                    {banner.badge && (
                      <Badge variant="secondary" className="mb-2">{banner.badge}</Badge>
                    )}
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    {banner.description && (
                      <p className="text-sm text-muted-foreground mt-1">{banner.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Games Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Popular Games</h2>
          <Button variant="outline" asChild>
            <Link href="/games">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {games
              .filter((g) => g.popular)
              .slice(0, 12)
              .map((game) => (
                <Link key={game.id} href={`/games/${game.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <span className="text-4xl">{game.image}</span>
                      <CardTitle className="text-sm">{game.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{game.minAmount}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Start Playing Today</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Top up your favorite games instantly. Fast delivery, best prices.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shwe Family Digital Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
