import FinanceHeader from "@/components/finance/FinanceHeader";
import FinanceContainer from "@/components/finance/FinanceContainer";
import { 
  getFinanzasResumenAction, 
  getFinanzasEstadisticasAction 
} from "@/actions/finance.actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Finanzas | AgroTrack",
  description: "Control de ingresos, gastos y balance de la finca.",
};

export default async function FinancePage({ searchParams }) {
  
  const resolvedParams = await searchParams;
  const params = new URLSearchParams(resolvedParams || {}).toString();

  
  const [resumenRes, statsRes] = await Promise.all([
    getFinanzasResumenAction(params),
    getFinanzasEstadisticasAction(),
  ]);

  // Transformamos los datos para el componente de Desglose de Gastos (las barritas)
  const transformBreakdownData = (data) => {
    if (!data) return [];
    return data.map((item) => ({
      label: item.categoria,
      value: item.total,
    }));
  };

  const initialData = {
    
    transacciones: resumenRes.success ? resumenRes.data.transacciones : [],
    paginacion: resumenRes.success ? resumenRes.data.paginacion : null,
    
    datagraph: statsRes.success ? statsRes.data : {},
    
    
    datagraph2: transformBreakdownData(statsRes.success ? statsRes.data.desglose_gastos : []),
    
    
    estadisticas: statsRes.success ? statsRes.data.tarjetas : null,
  };

  return (
    <div className="flex flex-col w-full h-full p-6 md:p-8 max-w-[1400px] mx-auto gap-2">
      <FinanceHeader />
      <FinanceContainer initialData={initialData} />
    </div>
  );
}