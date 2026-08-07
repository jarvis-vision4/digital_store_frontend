"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { gamesApi, settingsApi } from "@/lib/api";
import type { Game, PromotionalBanner } from "@/types";
import { Gamepad2, ChevronRight, Zap, Shield, Clock } from "lucide-react";
import { GameCard, GameCardFeatured } from "@/components/game-card";
import { BannerSlider } from "@/components/banner-slider";
import { resolveImageUrl } from "@/lib/utils";

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

  const popularGames = games.filter((g) => g.popular);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">
              <Zap className="h-3 w-3 mr-1" /> Instant Top-Up
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Top Up Your
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Favorite Games</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
              Fast, secure, and reliable game top-ups and digital products. Get your credits instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/games">Browse Games <ChevronRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/digital-products">Digital Products</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instant Delivery</span>
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Secure Payment</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> 24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Banners */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <BannerSlider>
            {banners.map((banner) => (
              <div key={banner.id} className="min-w-[300px] flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_38%] snap-start">
                <Card className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full">
                  {banner.imageUrl ? (
                    <img src={resolveImageUrl(banner.imageUrl)} alt={banner.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-5xl">🎮</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {banner.badge && (
                      <Badge className="mb-2 border-none bg-primary text-primary-foreground">{banner.badge}</Badge>
                    )}
                    <h3 className="font-bold text-lg text-white">{banner.title}</h3>
                    {banner.description && (
                      <p className="text-sm text-white/80 mt-1 line-clamp-2">{banner.description}</p>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </BannerSlider>
        </section>
      )}

      {/* Featured Games */}
      {popularGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <p className="text-muted-foreground text-sm mt-1">Most popular games this week</p>
            </div>
            <Button variant="ghost" asChild className="gap-1">
              <Link href="/games">View All <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popularGames.slice(0, 3).map((game) => (
                <GameCardFeatured key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* All Games Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">All Games</h2>
            <p className="text-muted-foreground text-sm mt-1">Browse our full catalog</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-24" /></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {games.slice(0, 12).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-white/80" />
            <h2 className="text-3xl font-bold text-white mb-2">Start Playing Today</h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Top up your favorite games instantly. Fast delivery, best prices.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shwe Family Digital Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
