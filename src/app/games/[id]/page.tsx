import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { notFound } from "next/navigation";
import { getGame } from "@/actions/public";
import { GameDetail } from "./game-detail";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const game = await getGame(id);
    return { title: `${game.name} | Shwe Family Digital Store` };
  } catch {
    return { title: "Game | Shwe Family Digital Store" };
  }
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let game;
  try {
    game = await getGame(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <GameDetail game={game} />
      </main>
      <MobileNav />
    </div>
  );
}