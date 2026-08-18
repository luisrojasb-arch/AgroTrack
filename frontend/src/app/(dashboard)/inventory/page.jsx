import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryTableContainer from "@/components/inventory/InventoryTableContainer";
import { 
  getInventarioResumenAction, 
  getInventarioEstadisticasAction 
} from "@/actions/inventory.actions";



export const metadata = {
  title: "Inventario | AgroTrack",
  description: "Control de insumos, medicamentos y herramientas de la finca.",
};

export default async function InventoryPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

 

  const params = new URLSearchParams(resolvedSearchParams || {}).toString();

  const [resumenRes, statsRes] = await Promise.all([
    getInventarioResumenAction(params),
    getInventarioEstadisticasAction(),
  ]);

  const initialData = {
    inventario: resumenRes.success ? resumenRes.data.inventario : [],
    paginacion: resumenRes.success ? resumenRes.data.paginacion : null,
    estadisticas: statsRes.success ? statsRes.data.estadisticas : null,
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <InventoryHeader />
      <InventoryTableContainer initialData={initialData} />
    </div>
  );
}