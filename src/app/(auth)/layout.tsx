import { Header } from "@/components/layout/header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
        {children}
      </main>
    </div>
  );
}
