import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DigitalProductsExplorer } from "./digital-products-explorer";
import { getDigitalProducts } from "@/actions/public";

export const metadata = {
  title: "Digital Products | Shwe Family Digital Store",
};

export const revalidate = 60;

export default async function DigitalProductsPage() {
  const products = await getDigitalProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <DigitalProductsExplorer products={products} />
      </main>
      <MobileNav />
    </div>
  );
}