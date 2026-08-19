import BarGraphContainer from "@/components/ui/BarGraphContainer";
import FinanceExpenseBreakdown from "./FinanceExpenseBreakdown";

/**
 * @description Contenedor de gráficos financieros.
 * @param {Object} props
 * @param {Array} props.datagraph1 - Datos para el primer gráfico.
 * @param {Array} props.datagraph2 - Datos para el segundo gráfico.
 */

export default function FinanceCharts({ datagraph1, datagraph2 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <FinanceExpenseBreakdown data={datagraph2} />

      <BarGraphContainer data={datagraph1} title="Ingresos vs Gastos" />
    </div>
  );
}
