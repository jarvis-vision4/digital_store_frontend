"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Zap, Shield, Clock } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">
              <Zap className="h-3 w-3 mr-1" /> Instant Top-Up
            </Badge>
          </motion.div>
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            Top Up Your
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Favorite Games</span>
          </motion.h1>
          <motion.p className="mt-4 text-lg text-muted-foreground max-w-lg"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
            Fast, secure, and reliable game top-ups and digital products. Get your credits instantly.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/games">Browse Games <ChevronRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/digital-products">Digital Products</Link>
            </Button>
          </motion.div>
          <motion.div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instant Delivery</span>
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Secure Payment</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> 24/7 Support</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}