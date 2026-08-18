import BarGraphContainer from "@/components/ui/BarGraphContainer";
import FinanceExpenseBreakdown from "./FinanceExpenseBreakdown";

export default function FinanceCharts({ datagraph1, datagraph2 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-6">
      
      <FinanceExpenseBreakdown data={datagraph2} />

      <BarGraphContainer 
        data={datagraph1} 
        title="Ingresos vs Gastos" 
      />
      
    </div>
  );
}