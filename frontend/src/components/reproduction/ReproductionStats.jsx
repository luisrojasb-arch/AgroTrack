import StatCard from "@/components/layout/StatCard";

/**
 * @description Tarjetas de resumen de reproducción (índices de parición, etc).
 * @param {Object} props
 * @param {Object} props.stats - Estadísticas de reproducción.
 */

export default function ReproductionStats({ stats }) {
  const enCelo = stats?.en_celo || 0;
  const prenadas = stats?.prenadas || 0;
  const nacimientos = stats?.nacimientos || 0;
  const totalCiclos = stats?.total_ciclos || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="En celo"
        value={enCelo}
        subtitle="Animales en celo actualmente"
      />
      <StatCard
        title="Preñadas"
        value={prenadas}
        subtitle="Animales en gestación actualmente"
      />
      <StatCard
        title="Nacimientos"
        value={nacimientos}
        subtitle="Cantidad de nacimientos"
      />
      <StatCard
        title="Total ciclos"
        value={totalCiclos}
        subtitle="Cantidad de ciclos completos"
      />
    </div>
  );
}
