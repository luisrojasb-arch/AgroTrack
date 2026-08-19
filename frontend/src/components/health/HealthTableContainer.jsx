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
import { createTareaSaludAction, toggleTareaSaludAction } from "@/actions/salud.actions";
import HealthAnimalFormModal from "@/components/health/modalsAnimals/HealthAnimalFormModal";
import HealthLoteFormModal from "@/components/health/modalsLote/HealthLoteFormModal";
import HealthTareasModal from "@/components/health/modalsTareas/HealthTareasModal"; 

export default function HealthTableContainer({
  initialData,
  activeTab = "individuales",
  userRole,
  animalesdisp,
  lotesdisp,
}) {
  const lotedata = initialData?.lotes || { data: { registros: [], paginacion: {} } };
  const animaldata = initialData?.animales || { data: { registros: [], paginacion: {} } };
  
  // Aseguramos que tareasdata sea siempre un arreglo para poder filtrarlo
  const tareasResponse = initialData?.tareas || [];
  const tareasdata = Array.isArray(tareasResponse) ? tareasResponse : tareasResponse.tareas || [];

  let registros = [];
  let paginacion = { totalRegistros: 0, paginaActual: 1, limite: 10, totalPaginas: 1 };

  if (activeTab === "individuales") {
    registros = animaldata?.registros || [];
    paginacion = animaldata?.paginacion || paginacion;
  } else if (activeTab === "lotes") {
    registros = lotedata?.registros || [];
    paginacion = lotedata?.paginacion || paginacion;
  }

  // Estados para controlar los Modales de Creación
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  
  // Estados para controlar el Modal de Ver Tareas
  const [isTareasModalOpen, setIsTareasModalOpen] = useState(false);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);

  // Handlers para abrir los modales de creación
  const handleAddAnimalHealth = () => setIsAnimalModalOpen(true);
  const handleAddLoteHealth = () => setIsLoteModalOpen(true);

  // Handler para el botón "Ver Tareas" en la tabla
  const handleVerTareas = (item) => {
    // Filtramos las tareas dependiendo si es un animal o un lote
    const tareasFiltradas = tareasdata.filter((t) => {
      if (activeTab === "individuales") {
        return t.animal_id?._id === item.id;
      } else {
        return t.lote_id?._id === item.id;
      }
    });

    setTareasSeleccionadas(tareasFiltradas);
    setIsTareasModalOpen(true);
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
  const handleToggleTarea = async (tareaId) => {
    const res = await toggleTareaSaludAction(tareaId);
    
    if (res.success) {
      setTareasSeleccionadas(prevTareas => 
        prevTareas.map(tarea => {
          if (tarea._id === tareaId) {
            return { ...tarea, aplicado: !tarea.aplicado }; 
          }
          return tarea;
        })
      );
      toast.success(res.data?.msg || "Estado de la tarea actualizado");
    } else {
      toast.error(res.error || "No se pudo actualizar la tarea");
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
          <HealthAnimalstable data={registros} userRole={userRole} onVerTareasClick={handleVerTareas} />
        )}
        
        {activeTab === "lotes" && (
          <HealthLotestable data={registros} userRole={userRole} onVerTareasClick={handleVerTareas} />
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

      <HealthTareasModal
        isOpen={isTareasModalOpen}
        onClose={() => setIsTareasModalOpen(false)}
        tareas={tareasSeleccionadas}
        entidadType={activeTab === "individuales" ? "Animal" : "Lote"}
        onToggleTarea={handleToggleTarea}
      />
    </div>
  );
}