import StatCard from "@/components/layout/StatCard";

/**
 * @description Tarjetas de resumen financiero (Ingresos, Gastos, Margen).
 * @param {Object} props
 * @param {Object} props.stats - Objeto de estadísticas.
 */


export default function FinanceStats({ stats }) {
  const ingresos = stats?.ingresos_totales || "$0 COP";
  const gastos = stats?.gastos_totales || "$0 COP";
  const ganancia = stats?.ganancia_neta || "$0 COP";
  const margen = stats?.margen_ganancia || "0%";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="Ingresos Totales"
        value={ingresos}
        subtitle="Total facturado este mes"
      />
      <StatCard
        title="Gastos Totales"
        value={gastos}
        subtitle="Egresos operativos"
      />
      <StatCard
        title="Ganancia Neta"
        value={ganancia}
        subtitle="Ingresos - Gastos"
      />
      <StatCard
        title="Margen de Ganancia"
        value={margen}
        subtitle="Rentabilidad actual"
      />
    </div>
  );
}
