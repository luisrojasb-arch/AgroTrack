import BarGraphContainer from "@/components/ui/BarGraphContainer";

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