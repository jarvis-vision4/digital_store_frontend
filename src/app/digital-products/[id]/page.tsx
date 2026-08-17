import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { notFound } from "next/navigation";
import { getDigitalProductById } from "@/actions/public";
import { DigitalProductDetail } from "./digital-product-detail";

export const metadata = {
  title: "Plans | Shwe Family Digital Store",
};

export const revalidate = 60;

export default async function DigitalProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product;
  try {
    product = await getDigitalProductById(Number(id));
  } catch {
    return notFound();
  }
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <DigitalProductDetail product={product} />
      </main>
      <MobileNav />
    </div>
  );
}