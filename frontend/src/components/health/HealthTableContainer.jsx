"use client";

import { useState } from "react";
import { toast } from "sonner";
import HealthTableHeader from "./HealthTableHeader";
import HealthTabs from "./HealthTabs";
import HealthTableControls from "./HealthTableControls";
import HealthAnimalstable from "./HealthAnimalstable";
import HealthLotestable from "./HealthLotestable";
import HealthCronoBase from "./HealthCronoBase";
import Pagination from "@/components/ui/Pagination";

import HealthAnimalFormModal from "@/components/health/modalsAnimals/HealthAnimalFormModal";
import HealthLoteFormModal from "@/components/health/modalsLote/HealthLoteFormModal";
import { createTareaSaludAction } from "@/actions/salud.actions";

export default function HealthTableContainer({
  initialData,
  activeTab = "individuales",
  userRole,
  animalesdisp,
  lotesdisp,
}) {
  const lotedata = initialData?.lotes || { data: { registros: [], paginacion: {} } };
  const animaldata = initialData?.animales || { data: { registros: [], paginacion: {} } };
  const tareasdata = initialData?.tareas || [];
  console.log("----------")
  console.log(initialData)
  let registros = [];
  let paginacion = { totalRegistros: 0, paginaActual: 1, limite: 10, totalPaginas: 1 };

  if (activeTab === "individuales") {
    registros = animaldata?.registros || [];
    paginacion = animaldata?.paginacion || paginacion;
  } else if (activeTab === "lotes") {
    registros = lotedata?.registros || [];
    paginacion = lotedata?.paginacion || paginacion;
  }

  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddAnimalHealth = () => setIsAnimalModalOpen(true);
  const handleAddLoteHealth = () => setIsLoteModalOpen(true);

  const handleVerTareas = (item) => {
    setSelectedItem(item);
    console.log("Ver tareas de:", item);
  };

  const handleSubmitAnimalHealth = async (formData) => {
    const res = await createTareaSaludAction(formData);
    if (res.success) {
      setIsAnimalModalOpen(false);
      toast.success("Registro de salud individual guardado exitosamente");
    } else {
      toast.error(res.error || "Hubo un error al guardar el registro");
    }
  };

  const handleSubmitLoteHealth = async (formData) => {
    const res = await createTareaSaludAction(formData);
    if (res.success) {
      setIsLoteModalOpen(false);
      toast.success("Registro de salud de lote guardado exitosamente");
    } else {
      toast.error(res.error || "Hubo un error al guardar el registro");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
        <HealthTableHeader
          activeTab={activeTab}
          onAddAnimal={handleAddAnimalHealth}
          onAddLote={handleAddLoteHealth}
        />
        
        <HealthTabs /> 
        <HealthTableControls activeTab={activeTab} />

        {activeTab === "individuales" && (
          <HealthAnimalstable data={registros} userRole={userRole} onVerTareasClick={handleVerTareas} tareas={tareasdata} />
        )}
        
        {activeTab === "lotes" && (
          <HealthLotestable data={registros} userRole={userRole} onVerTareasClick={handleVerTareas} tareas={tareasdata} />
        )}
        
        {activeTab === "cronograma" && <HealthCronoBase />}

        {activeTab !== "cronograma" && (
          <Pagination
            totalRegistros={paginacion.totalRegistros}
            totalPaginas={paginacion.totalPaginas}
            paginaActual={paginacion.paginaActual}
            limite={paginacion.limite}
          />
        )}
      </div>

      <HealthAnimalFormModal
        isOpen={isAnimalModalOpen}
        onClose={() => setIsAnimalModalOpen(false)}
        onSubmit={handleSubmitAnimalHealth}
        animalesDisponibles={animalesdisp}
      />

      <HealthLoteFormModal
        isOpen={isLoteModalOpen}
        onClose={() => setIsLoteModalOpen(false)}
        onSubmit={handleSubmitLoteHealth}
        lotesDisponibles={lotesdisp}
      />
    </div>
  );
}