"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkles, Package } from "lucide-react";

const stats = [
  { label: "Happy Gamers", value: "50K+" },
  { label: "Orders Delivered", value: "1M+" },
  { label: "Avg. Delivery", value: "< 2 min" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
      <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[100px]" />
      <div className="absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full bg-amber-400/20 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.04]" />

      <div className="relative max-w-7xl mx-auto px-4 pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 border-primary/30 bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="h-3 w-3 mr-1" /> Instant Top-Up &amp; Digital Goods
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Top Up Your{" "}
            <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
              Favorite Games
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Shwe Family Digital Store brings you fast, secure game top-ups and digital
            products — delivered instantly at the best prices.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button size="lg" className="gap-2" asChild>
              <Link href="/games">
                Browse Games <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/digital-products">
                <Package className="h-4 w-4" /> Digital Products
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/60 bg-card/60 px-4 py-5 backdrop-blur"
              >
                <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
