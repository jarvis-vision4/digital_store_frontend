"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart, Gamepad2, Shield, Zap, Clock, Wallet } from "lucide-react";

const features = [
  "Digital Products & Top-Up Services",
  "Wallet Topup System",
  "Secure & Fast Service",
  "Trusted by 5000+ Customers",
];

const floatingProducts = [
  { emoji: "🎮", label: "Games", x: 10, y: 5, delay: 0 },
  { emoji: "💎", label: "Diamonds", x: 70, y: 0, delay: 0.15 },
  { emoji: "🎧", label: "Music", x: 85, y: 40, delay: 0.3 },
  { emoji: "🎬", label: "Movies", x: 5, y: 50, delay: 0.45 },
  { emoji: "🤖", label: "AI Tools", x: 60, y: 60, delay: 0.2 },
  { emoji: "📱", label: "Apps", x: 30, y: 10, delay: 0.35 },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.06] via-background to-background">
      {/* Decorative blurs */}
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-amber-300/10 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight">
              Shwe Family
              <br />
              <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
                Digital Store
              </span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-md">
              One Stop Digital Solution For Everyone
            </p>

            <ul className="mt-6 space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle className="h-[18px] w-[18px] text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-7 gap-2 font-semibold" asChild>
                <Link href="/digital-products">
                  <ShoppingCart className="h-4 w-4" /> Shop Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-7 gap-2 font-semibold" asChild>
                <Link href="/digital-products">See Services</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — illustration */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Gold circle */}
            <div className="relative h-[320px] w-[320px] md:h-[380px] md:w-[380px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-amber-200/20" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/10 to-background border border-primary/10" />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-xl shadow-primary/30">
                  <Gamepad2 className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Floating product cards */}
              {floatingProducts.map((p) => (
                <motion.div
                  key={p.label}
                  className="absolute flex flex-col items-center gap-1"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + p.delay, duration: 0.6 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border/60 shadow-lg text-2xl">
                    {p.emoji}
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{p.label}</span>
                </motion.div>
              ))}

              {/* "Trusted by 5000+" badge */}
              <motion.div
                className="absolute -right-2 bottom-8 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="text-sm font-bold text-foreground">Trusted by 5000+</div>
                <div className="text-xs text-muted-foreground">Customers</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
