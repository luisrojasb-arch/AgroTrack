import BarGraphContainer from "@/components/ui/BarGraphContainer";

/**
 * @description Segunda sección de datos del Overview (Comparativas).
 * @param {Object} props
 * @param {Array} props.datagraph1 - Datos gráfico 1.
 * @param {Array} props.datagraph2 - Datos gráfico 2.
 */

export default function OverviewDaraSect2({ datagraph1, datagraph2 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <BarGraphContainer 
        data={datagraph1} 
        title="Ingresos Vs Gastos" 
      />
      
    </div>
  );
}