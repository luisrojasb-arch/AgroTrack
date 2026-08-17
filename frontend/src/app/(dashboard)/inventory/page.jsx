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
  // 1. ¡LA SOLUCIÓN AQUÍ! Esperamos la promesa de searchParams antes de usarla
  const resolvedSearchParams = await searchParams;

 

  // 2. Construimos la URL de los query params pasándole el objeto ya resuelto
  const params = new URLSearchParams(resolvedSearchParams || {}).toString();

  // Llamadas paralelas a tu API real para hacer la página súper rápida
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
    <div className="flex flex-col w-full h-full p-6 md:p-8 max-w-[1400px] mx-auto gap-2">
      <InventoryHeader />
      <InventoryTableContainer initialData={initialData} />
    </div>
  );
}