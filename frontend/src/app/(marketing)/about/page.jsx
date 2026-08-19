import AboutCard from "@/components/about_us/AboutCard";
import { Target, Eye, Heart } from "lucide-react";
import Image from "next/image";

export default function SobreNosotrosPage() {
  const cardData = [
    {
      icon: Target,
      title: "Misión",
      description:
        "Brindar a productores porcinos herramientas digitales claras y confiables para profesionalizar su trabajo.",
    },
    {
      icon: Eye,
      title: "Visión",
      description:
        "Ser la plataforma de referencia para granjas porcinas en Latinoamérica.",
    },
    {
      icon: Heart,
      title: "Valores",
      description:
        "Cercanía con el productor, simplicidad, soporte real y compromiso con el campo.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col">
      <div className="w-full mb-12">
        <h1 className="text-4xl sm:text-[44px] font-bold text-black mb-6 flex items-center justify-start gap-2 flex-wrap">
          Sobre
          <Image
            src="/logo-agrotrack.png"
            alt="Logo de AgroTrack"
            width={400}
            height={120}
            unoptimized
            className="w-auto h-24 sm:h-30 -mt-2 sm:-mt-4"
            priority
          />
        </h1>

        <p className="text-gray-agro-text text-base sm:text-lg leading-relaxed mt-4">
          Somos una plataforma especializada en la gestión de granjas porcinas.
          Sabemos que llevar control de cada cerda, cada ciclo y cada vacuna en
          papel es lento y propenso a errores, por eso creamos AgroTrack.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 w-full mb-16">
        {cardData.map((card, index) => (
          <AboutCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          />
        ))}
      </div>

      <div className="w-full bg-white rounded-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
          Nuestra Historia
        </h2>
        <p className="text-gray-agro-text text-base sm:text-lg leading-relaxed">
          AgroTrack nació al observar los retos diarios de los productores: la
          dependencia de registros manuales que complicaban el control de los
          animales. Comprendimos que el sector necesitaba un salto hacia la
          digitalización sin perder su enfoque práctico. Por ello, trabajando
          junto al personal, creamos una plataforma especializada, con el
          propósito de transformar el papel en información confiable, haciendo
          el trabajo diario mucho más ágil, eficiente y seguro.
        </p>
      </div>
    </main>
  );
}