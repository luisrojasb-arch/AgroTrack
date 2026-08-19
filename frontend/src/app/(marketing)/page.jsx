import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Inicio | AgroTrack",
  description:
    "Plataforma completa para llevar el control inteligente de tu granja porcina.",
};

/**
 * @description Página principal (Landing Page) pública de la plataforma.
 */

export default function MarketingHomePage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  );
}
