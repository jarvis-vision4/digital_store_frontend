import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { GamesExplorer } from "./games-explorer";
import { getGames } from "@/actions/public";

export const metadata = {
  title: "Game Catalog | Shwe Family Digital Store",
};

export const revalidate = 60;

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <GamesExplorer games={games} />
      </main>
      <MobileNav />
    </div>
  );
}