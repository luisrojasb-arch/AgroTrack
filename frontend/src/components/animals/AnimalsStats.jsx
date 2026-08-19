import StatCard from "@/components/layout/StatCard";

/**
 * @description Tarjetas de estadísticas generales de los animales.
 * @param {Object} props
 * @param {Object} props.stats - Objeto con las métricas (total, machos, hembras, etc).
 */
//

export default function AnimalsStats({ stats }) {
  const total = stats?.total_animales || 0;
  const hembras = stats?.hembras || 0;
  const machos = stats?.machos || 0;
  const lotes = stats?.lotes || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="Total Animales"
        value={total}
        subtitle="Vivos en la finca"
      />
      <StatCard
        title="Hembras"
        value={hembras}
        subtitle="Total de Hembras Activas"
      />
      <StatCard
        title="Machos"
        value={machos}
        subtitle="Total de Machos Activos"
      />
      <StatCard title="Lotes" value={lotes} subtitle="Total de Lotes" />
    </div>
  );
}
