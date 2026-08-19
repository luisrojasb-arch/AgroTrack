"use client";

import { useSearchParams } from "next/navigation";
import Pagination from "@/components/ui/Pagination";
import AlertasContainer from "@/components/overview/AlertasContainer";

/**
 * @description Lista de actividades o registros recientes del dashboard.
 * @param {Object} props
 * @param {Array} props.data - Arreglo de ítems recientes.
 */

export default function OverviewList({ data }) {
  const searchParams = useSearchParams();
  
  const paginaActualUrl = Number(searchParams.get("page")) || data.paginacion.paginaActual || 1;
  const limite = data.paginacion.limite || 5;
  console.log("paginaActualUrl:", paginaActualUrl);
  const startIndex = (paginaActualUrl - 1) * limite;
  const endIndex = startIndex + limite;
  
  const alertasPaginadas = data.alertas.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border-agro)] p-6 flex flex-col w-full h-full shadow-sm">
      <div className="flex-1 w-full">
        <AlertasContainer alertas={alertasPaginadas} />
      </div>

      <div className="mt-auto w-full">
        <Pagination
          totalRegistros={data.paginacion.totalRegistros}
          totalPaginas={data.paginacion.totalPaginas}
          paginaActual={paginaActualUrl} 
          limite={limite}
          compact={true}
        />
      </div>
    </div>
  );
}