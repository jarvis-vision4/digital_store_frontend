"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart } from "lucide-react";

const features = [
  "Digital Products & Top-Up Services",
  "Wallet Topup System",
  "Secure & Fast Service",
  "Trusted by 5000+ Customers",
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

          {/* Right — hero image */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full max-w-[480px]">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-amber-200/10 blur-2xl" />
              <Image
                src="/hero.png"
                alt="Shwe Family Digital Store"
                width={1536}
                height={1024}
                priority
                className="relative w-full h-auto rounded-3xl border border-primary/10 shadow-2xl shadow-primary/20 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
