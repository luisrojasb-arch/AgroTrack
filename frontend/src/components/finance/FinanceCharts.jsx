import BarGraphContainer from "@/components/ui/BarGraphContainer";
import FinanceExpenseBreakdown from "./FinanceExpenseBreakdown";

export default function FinanceCharts({ datagraph1, datagraph2 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-6">
      
      {/* Gráfica 1: Desglose de Gastos (Barras Horizontales) */}
      <FinanceExpenseBreakdown data={datagraph2} />

      {/* Gráfica 2: Ingresos Vs Gastos (Componente global) */}
      {/* Pasamos datagraph1 directamente sin envolverlo */}
      <BarGraphContainer 
        data={datagraph1} 
        title="Ingresos vs Gastos" 
      />
      
    </div>
  );
}