import HeroSection from "@/components/home/HeroSection";

export const metadata = {
  title: "Inicio | AgroTrack",
  description: "Plataforma completa para llevar el control inteligente de tu granja porcina.",
};

export default function MarketingHomePage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <HeroSection />
    </main>
  );
}