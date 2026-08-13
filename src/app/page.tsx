import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { BannerSlider } from "@/components/banner-slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGames, getActiveBanners } from "@/actions/public";
import { resolveImageUrl, cn } from "@/lib/utils";
import { categoryLabels } from "@/lib/constants";
import { HomeContent } from "./home-content";
import { HomeHero } from "./home-hero";
import Link from "next/link";
import type { Game } from "@/types";

export const revalidate = 60;

export const metadata = {
  title: "Shwe Family Digital Store",
  description: "Premium game top-up and digital product store",
};

export default async function HomePage() {
  const [games, banners] = await Promise.all([getGames(), getActiveBanners()]);

  const categoryMap = games.reduce<Record<string, { count: number; sample: Game }>>(
    (acc, g) => {
      if (!acc[g.category]) acc[g.category] = { count: 0, sample: g };
      acc[g.category].count += 1;
      return acc;
    },
    {}
  );
  const categories = Object.entries(categoryMap);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />

      {/* Hero */}
      <HomeHero />

      {/* Featured Offers */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <SectionHeading
            eyebrow="Limited Time"
            title="Featured Offers"
            description="Exclusive deals and promotions, handpicked for you."
          />
          <FadeIn>
            <BannerSlider>
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="min-w-[300px] flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_38%] snap-start"
                >
                  <Card className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full">
                    {banner.imageUrl ? (
                      <img
                        src={resolveImageUrl(banner.imageUrl)}
                        alt={banner.title}
                        className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-5xl">
                        🎮
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {banner.badge && (
                        <Badge className="mb-2 border-none bg-primary text-primary-foreground">
                          {banner.badge}
                        </Badge>
                      )}
                      <h3 className="font-bold text-lg text-white">{banner.title}</h3>
                      {banner.description && (
                        <p className="text-sm text-white/80 mt-1 line-clamp-2">
                          {banner.description}
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </BannerSlider>
          </FadeIn>
        </section>
      )}

      {/* Browse by Category */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <SectionHeading
            eyebrow="Explore"
            title="Browse by Category"
            description="Jump straight to the games you love."
          />
          <FadeIn>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map(([cat, { count, sample }]) => {
                const imageUrl = resolveImageUrl(sample.image);
                const isImage =
                  imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
                return (
                  <Link
                    key={cat}
                    href="/games"
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-center transition-all",
                      "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                    )}
                  >
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 opacity-60 blur-xl transition-opacity group-hover:opacity-100" />
                    <div className="relative flex h-12 items-center justify-center text-3xl">
                      {isImage ? (
                        <img
                          src={imageUrl}
                          alt={sample.name}
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-white/20"
                        />
                      ) : (
                        <span>{sample.image || "🎮"}</span>
                      )}
                    </div>
                    <h3 className="relative mt-3 text-sm font-semibold">
                      {categoryLabels[cat] ?? cat}
                    </h3>
                    <p className="relative text-xs text-muted-foreground">{count} games</p>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </section>
      )}

      {/* Interactive content (featured + all games + why us + CTA) — needs client auth */}
      <HomeContent games={games} />

      <footer className="border-t py-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Shwe Family Digital Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
