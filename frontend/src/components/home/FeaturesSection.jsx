import {
  PiggyBank,
  Heart,
  Activity,
  Package,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Animales y Lotes",
    description:
      "Registra cerdas, padrillos y lotes con padre/madre, raza, peso y trazabilidad completa.",
    icon: PiggyBank,
  },
  {
    title: "Salud y Vacunación",
    description:
      "Calendario de vacunas, registros automáticos por lote al nacer, alertas por edad del lechón.",
    icon: Heart,
  },
  {
    title: "Reproducción",
    description:
      "Ciclos de 21 días, gestación de 114 días, celo, preñez y parto con alertas.",
    icon: Activity,
  },
  {
    title: "Inventario",
    description:
      "Control de bultos de alimento, vacunas y medicamentos con stock mínimo y vencimientos.",
    icon: Package,
  },
  {
    title: "Finanzas y Reportes",
    description:
      "Ingresos, egresos y exportación de reportes en PDF y Excel por mes, trimestre o año.",
    icon: TrendingUp,
  },
  {
    title: "Roles y Permisos",
    description:
      "Admin, trabajador y veterinario. Invita a tu equipo con clave temporal y cambio forzado.",
    icon: ShieldCheck,
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full px-6 md:px-8 lg:px-12 py-10 bg-white">
      <div className="max-w-350 mx-auto flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-3">
          Todo lo que Necesitas para Triunfar
        </h2>
        <p className="text-[16px] text-gray-500 text-center max-w-2xl mb-12">
          Módulos integrados pensados específicamente para la producción
          porcina.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
