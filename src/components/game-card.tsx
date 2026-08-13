"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, resolveImageUrl } from "@/lib/utils";
import { categoryLabels, categoryColors } from "@/lib/constants";
import type { Game } from "@/types";
import { TrendingUp, Sparkles } from "lucide-react";

export function GameCard({ game, className }: { game: Game; className?: string }) {
  const imageUrl = resolveImageUrl(game.image);
  const isImage = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
  const gradient = categoryColors[game.category] || "from-primary/15 to-secondary/15";

  return (
    <Link href={`/games/${game.id}`} className={cn("group block", className)}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="h-full overflow-hidden border-border/50 bg-card transition-colors duration-300 group-hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
          <div className={cn("relative h-40 w-full overflow-hidden bg-gradient-to-br flex items-center justify-center", gradient)}>
            {isImage ? (
              <img
                src={imageUrl}
                alt={game.name}
                className="h-24 w-24 rounded-2xl object-cover shadow-xl ring-2 ring-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              />
            ) : (
              <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                {game.image}
              </span>
            )}

            {game.popular && (
              <Badge className="absolute top-3 right-3 gap-1 border-none bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                <TrendingUp className="h-3 w-3" /> Popular
              </Badge>
            )}

            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>

          <div className="p-4">
            <h3 className="truncate font-semibold text-sm leading-tight">{game.name}</h3>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {categoryLabels[game.category] ?? game.category}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

export function GameCardFeatured({ game }: { game: Game }) {
  const imageUrl = resolveImageUrl(game.image);
  const isImage = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  return (
    <Link href={`/games/${game.id}`} className="group block">
      <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
        <div className="flex items-center gap-5 p-5">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            {isImage ? (
              <img src={imageUrl} alt={game.name} className="relative h-20 w-20 rounded-2xl object-cover shadow-xl ring-2 ring-white/20" />
            ) : (
              <span className="relative flex h-20 w-20 items-center justify-center text-5xl">{game.image}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-bold">{game.name}</h3>
              {game.popular && (
                <Badge className="border-none bg-gradient-to-r from-amber-500 to-orange-500 text-white shrink-0">
                  <Sparkles className="h-3 w-3 mr-1" /> Hot
                </Badge>
              )}
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{game.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
