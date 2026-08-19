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
import { createTareaSaludAction, toggleTareaSaludAction, updateTareaSaludAction, deleteTareaSaludAction } from "@/actions/salud.actions";
import HealthAnimalFormModal from "@/components/health/modalsAnimals/HealthAnimalFormModal";
import HealthLoteFormModal from "@/components/health/modalsLote/HealthLoteFormModal";
import HealthTareasModal from "@/components/health/modalsTareas/HealthTareasModal"; 
import HealthTareaDetailsModal from "@/components/health/modalsTareas/HealthTareaDetailsModal";
import HealthTareaEditModal from "@/components/health/modalsTareas/HealthTareaEditModal";
import HealthTareaDeleteModal from "@/components/health/modalsTareas/HealthTareaDeleteModal";
export default function HealthTableContainer({
  initialData,
  activeTab = "individuales",
  userRole,
  animalesdisp,
  lotesdisp,
}) {
  const lotedata = initialData?.lotes || { data: { registros: [], paginacion: {} } };
  const animaldata = initialData?.animales || { data: { registros: [], paginacion: {} } };
  
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

  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  
  const [isTareasModalOpen, setIsTareasModalOpen] = useState(false);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);

  const handleAddAnimalHealth = () => setIsAnimalModalOpen(true);
  const handleAddLoteHealth = () => setIsLoteModalOpen(true);

  const handleVerTareas = (item) => {
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
  const [selectedTareaAccion, setSelectedTareaAccion] = useState(null);
  const [isDetalleTareaOpen, setIsDetalleTareaOpen] = useState(false);
  const [isEditTareaOpen, setIsEditTareaOpen] = useState(false);
  const [isDeleteTareaOpen, setIsDeleteTareaOpen] = useState(false);

  const handleViewTareaDetails = (tarea) => {
    setSelectedTareaAccion(tarea);
    setIsDetalleTareaOpen(true);
  };

  const handleEditTarea = (tarea) => {
    setSelectedTareaAccion(tarea);
    setIsEditTareaOpen(true);
  };

  const handleDeleteTareaClick = (tarea) => {
    setSelectedTareaAccion(tarea);
    setIsDeleteTareaOpen(true);
  };

  const handleSubmitEditTarea = async (id, data) => {
    const res = await updateTareaSaludAction(id, data);
    if (res.success) {
      setTareasSeleccionadas((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...data } : t))
      );
      setIsEditTareaOpen(false);
      toast.success("Tarea actualizada correctamente");
    } else {
      toast.error(res.error || "No se pudo actualizar la tarea");
    }
  };

  const handleConfirmDeleteTarea = async (id) => {
    const res = await deleteTareaSaludAction(id);
    if (res.success) {
      setTareasSeleccionadas((prev) => prev.filter((t) => t._id !== id));
      setIsDeleteTareaOpen(false);
      toast.success("Tarea eliminada correctamente");
    } else {
      toast.error(res.error || "No se pudo eliminar la tarea");
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
        onViewClick={handleViewTareaDetails}
        onEditClick={handleEditTarea}
        onDeleteClick={handleDeleteTareaClick}
      />

      <HealthTareaDetailsModal
        isOpen={isDetalleTareaOpen}
        onClose={() => setIsDetalleTareaOpen(false)}
        tarea={selectedTareaAccion}
      />

      <HealthTareaEditModal
        isOpen={isEditTareaOpen}
        onClose={() => setIsEditTareaOpen(false)}
        tareaToEdit={selectedTareaAccion}
        onSubmit={handleSubmitEditTarea}
      />

      <HealthTareaDeleteModal
        isOpen={isDeleteTareaOpen}
        onClose={() => setIsDeleteTareaOpen(false)}
        tarea={selectedTareaAccion}
        onConfirm={handleConfirmDeleteTarea}
      />
    </div>
  );
}