"use client";

import AnimalsTableHeader from "./AnimalsTableHeader";
import AnimalsTabs from "./AnimalsTabs";
import AnimalsTableControls from "./AnimalsTableControls";
import AnimalsTable from "./AnimalsTable";
import LotesTable from "./LotesTable";
import SeleccionTable from "./SeleccionTable";
import Pagination from "@/components/ui/Pagination";

export default function AnimalsTableContainer({ initialData, activeTab }) {
  const animales = initialData?.animales || [];
  const lotes = initialData?.lotes || [];
  const selecciones = initialData?.selecciones || [];

  const paginacion = initialData?.paginacion || {
    totalRegistros: 0,
    paginaActual: 1,
    limite: 10,
    totalPaginas: 1,
  };

  return (
    <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm">
      <AnimalsTableHeader activeTab={activeTab} />
      <AnimalsTabs />
      <AnimalsTableControls activeTab={activeTab} />
      {activeTab === "individuales" && <AnimalsTable animales={animales} />}
      {activeTab === "lotes" && <LotesTable lotes={lotes} />}
      {activeTab === "madre" && <SeleccionTable selecciones={selecciones} />}
      <Pagination
        totalRegistros={paginacion.totalRegistros}
        totalPaginas={paginacion.totalPaginas}
        paginaActual={paginacion.paginaActual}
        limite={paginacion.limite}
      />
    </div>
  );
}
