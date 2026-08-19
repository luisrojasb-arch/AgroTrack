import HealthHeader from "@/components/health/HealthHeader";
import HealthStats from "@/components/health/HealthStats";
import HealthTableContainer from "@/components/health/HealthTableContainer";
import {
  getTareasSaludAction, 
  getResumenSaludLotesAction, 
  getResumenSaludAnimalesAction
} from "@/actions/salud.actions";

import {getAnimalesAction} from "@/actions/animal.actions"
import {getLotesAction} from "@/actions/lote.actions"

export const metadata = {
  title: "Salud | AgroTrack",
  description: "Control sanitario, historial médico y vacunas de la finca.",
};

export default async function HealthPage({ searchParams }) {
  const params = await searchParams;
  
  const activeTab = params.tab || "individuales";
  
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";
  const filter = params.filter || "";

  const tareas = await getTareasSaludAction({ page: 1, limit: 10 });
  
  const resumenLotes = await getResumenSaludLotesAction({ page, limit, search, filter });
  const resumenAnimales = await getResumenSaludAnimalesAction({ page, limit, search, filter });
  const animalesdisp = await getAnimalesAction()
  const lotesdisp = await getLotesAction()
  //console.log(animalesdisp.data.animales)
  //console.log(lotesdisp.data.lotes)
  console.log(tareas.data.tareas)
  //console.log(resumenLotes)
  //console.log(resumenAnimales)

  const initialData = {
    tareas: tareas?.data || [],
    lotes: resumenLotes?.data || { registros: [], paginacion: {} },
    animales: resumenAnimales?.data || { registros: [], paginacion: {} }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <HealthHeader />
      <HealthStats />
      <HealthTableContainer 
        initialData={initialData} 
        activeTab={activeTab} 
        userRole="admin"
        animalesdisp={animalesdisp.data.animales}
        lotesdisp={lotesdisp.data.lotes} 
      />
    </div>
  );
}