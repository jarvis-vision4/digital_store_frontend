"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { gamesApi } from "@/lib/api";
import type { Game } from "@/types";
import { Search, Sparkles } from "lucide-react";
import { GameCard } from "@/components/game-card";

const categoryLabels: Record<string, string> = {
  mobile_games: "Mobile Games",
  pc_games: "PC Games",
  gift_card: "Gift Cards",
  mobile_app: "Mobile Apps",
  redeem_code: "Redeem Codes",
  social_service: "Social Services",
};

const allCategories = ["all", ...Object.keys(categoryLabels)];

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gamesApi.getGames()
      .then(setGames)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = games.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabels[g.category]?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered.reduce<Record<string, Game[]>>((acc, game) => {
    const cat = categoryLabels[game.category] || game.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(game);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Game Catalog <Sparkles className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Browse all available games and top-up packages</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "All Games" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-24" /></CardContent></Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16 text-muted-foreground">
              No games found matching your search.
            </CardContent>
          </Card>
        ) : (
          Object.entries(grouped).map(([category, categoryGames]) => (
            <section key={category} className="mb-10">
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {categoryGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
      <MobileNav />
    </div>
  );
}
