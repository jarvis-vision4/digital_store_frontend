import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { BannerSlider } from "@/components/banner-slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGames, getActiveBanners } from "@/actions/public";
import { resolveImageUrl } from "@/lib/utils";
import { HomeContent } from "./home-content";
import { HomeHero } from "./home-hero";
import { SiteFooter } from "@/components/layout/footer";

export const revalidate = 60;

export const metadata = {
  title: "Shwe Family Digital Store",
  description: "One Stop Digital Solution For Everyone — Game top-ups, digital products, wallet topup, and more.",
};

export default async function HomePage() {
  const [games, banners] = await Promise.all([getGames(), getActiveBanners()]);

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

      {/* Interactive content (products, features, games, reviews, CTA) */}
      <HomeContent games={games} />

      <SiteFooter />
    </div>
  );
}
