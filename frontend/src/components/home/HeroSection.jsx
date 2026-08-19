import Image from "next/image";
import Button from "@/components/ui/Button";
import { Leaf, ShieldCheck, Users } from "lucide-react";

/**
 * @description Sección principal (Hero) de la Landing Page.
 */

export default function HeroSection() {
  return (
    <section className="w-full px-6 md:px-8 lg:px-12 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
      <div className="w-full lg:w-1/2 flex flex-col items-start gap-6">
        <div className="flex items-center gap-2 text-primary font-medium text-[14px]">
          <Leaf size={16} strokeWidth={2} />
          <span>Gestion Inteligente Porcina</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.1]">
          Gestiona tu Granja <br className="hidden lg:block" />
          <span className="text-primary">Porcina</span> con{" "}
          <br className="hidden lg:block" />
          Inteligencia
        </h1>

        <p className="text-[16px] md:text-[18px] text-gray-500 max-w-xl leading-relaxed">
          Plataforma completa para llevar el control de animales, lotes, salud,
          ciclos reproductivos, inventario y finanzas. Todo en un solo lugar.
        </p>

        <div className="pt-2">
          <Button variant="green" size="42" href="/register">
            Comenzar Gratis
          </Button>
        </div>

        <div className="flex items-center gap-6 mt-4 pt-2">
          <div className="flex items-center gap-2 text-[14px] text-gray-500">
            <ShieldCheck size={18} className="text-gray-400" />
            <span>Seguro y Confiable</span>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-gray-500">
            <Users size={18} className="text-gray-400" />
            <span>Multiusuario</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative">
        {/* Cambiamos md:aspect-video por md:aspect-[21/9] para reducir significativamente la altura en tablet */}
        <div className="relative w-full aspect-4/3 md:aspect-21/9 lg:aspect-16/11 rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/Header-Inicio.png"
            alt="Dos cerdos en un prado verde frente a una granja"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
