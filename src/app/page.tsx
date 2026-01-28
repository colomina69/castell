import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Aditional sections can be added here (Events, Gallery, etc.) */}
      </main>
      <Footer />
    </div>
  );
}
