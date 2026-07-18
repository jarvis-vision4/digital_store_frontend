"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { gamesApi } from "@/lib/api";
import type { Game } from "@/types";
import { Search } from "lucide-react";

const categoryLabels: Record<string, string> = {
  mobile_games: "Mobile Games",
  pc_games: "PC Games",
  gift_card: "Gift Cards",
  mobile_app: "Mobile Apps",
  redeem_code: "Redeem Codes",
  social_service: "Social Services",
};

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gamesApi.getGames()
      .then(setGames)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = games.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabels[g.category]?.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filtered.reduce<Record<string, Game[]>>((acc, game) => {
    const cat = categoryLabels[game.category] || game.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(game);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Game Catalog</h1>
        <p className="text-muted-foreground">Browse all available games and top-up packages</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-24" /></CardContent></Card>
          ))}
        </div>
      ) : (
        Object.entries(grouped).map(([category, categoryGames]) => (
          <section key={category}>
            <h2 className="text-lg font-semibold mb-3">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categoryGames.map((game) => (
                <Link key={game.id} href={`/games/${game.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full relative">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <span className="text-4xl">{game.image}</span>
                      <CardTitle className="text-sm">{game.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{game.minAmount}</p>
                      {game.popular && (
                        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">Popular</Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
      </main>
    </div>
  );
}
