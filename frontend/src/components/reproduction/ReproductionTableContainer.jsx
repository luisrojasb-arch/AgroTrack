"use client";

import { useState } from "react";
import { toast } from "sonner";
import ReproductionTableHeader from "./ReproductionTableHeader";
import ReproductionTabs from "./ReproductionTabs";
import ReproductionTableControls from "./ReproductionTableControls";
import CelosTable from "./CelosTable";
import PrenecesTable from "./PrenecesTable";
import NacimientosTable from "./NacimientosTable";
import CipaTable from "./CipaTable";
import Pagination from "@/components/ui/Pagination";

import CeloFormModal from "./modalsReproduction/CeloFormModal";
import DeleteCeloModal from "./modalsReproduction/DeleteCeloModal";
import PrenezFormModal from "./modalsReproduction/PrenezFormModal";
import DeletePrenezModal from "./modalsReproduction/DeletePrenezModal";
import NacimientoFormModal from "./modalsReproduction/NacimientoFormModal";
import DeleteNacimientoModal from "./modalsReproduction/DeleteNacimientoModal";

import {
  registrarCeloAction,
  editarCeloAction,
  eliminarCicloAction,
  confirmarPrenezAction,
  editarPrenezAction,
  confirmarNacimientoAction,
  editarNacimientoAction,
} from "@/actions/reproduction.actions";

export default function ReproductionTableContainer({ initialData, activeTab }) {
  const datos = initialData?.docs || [];
  const paginacion = initialData?.paginacion || {
    totalRegistros: 0,
    paginaActual: 1,
    limite: 10,
    totalPaginas: 1,
  };

  const [isCeloModalOpen, setIsCeloModalOpen] = useState(false);
  const [isDeleteCeloOpen, setIsDeleteCeloOpen] = useState(false);
  const [selectedCelo, setSelectedCelo] = useState(null);

  const [isPrenezModalOpen, setIsPrenezModalOpen] = useState(false);
  const [isDeletePrenezOpen, setIsDeletePrenezOpen] = useState(false);
  const [selectedPrenez, setSelectedPrenez] = useState(null);
  const [isPrenezConfirmMode, setIsPrenezConfirmMode] = useState(false);

  const [isNacimientoModalOpen, setIsNacimientoModalOpen] = useState(false);
  const [isDeleteNacimientoOpen, setIsDeleteNacimientoOpen] = useState(false);
  const [selectedNacimiento, setSelectedNacimiento] = useState(null);
  const [isNacimientoConfirmMode, setIsNacimientoConfirmMode] = useState(false);

  const handleAdd = () => {
    setSelectedCelo(null);
    setIsCeloModalOpen(true);
  };

  const handleEdit = (item) => {
    if (activeTab === "celos") {
      setSelectedCelo(item);
      setIsCeloModalOpen(true);
    }
    if (activeTab === "preneces") {
      setSelectedPrenez(item);
      setIsPrenezConfirmMode(false);
      setIsPrenezModalOpen(true);
    }
    if (activeTab === "nacimientos") {
      setSelectedNacimiento(item);
      setIsNacimientoConfirmMode(false);
      setIsNacimientoModalOpen(true);
    }
  };

  const handleDeleteClick = (item) => {
    if (activeTab === "celos") {
      setSelectedCelo(item);
      setIsDeleteCeloOpen(true);
    }
    if (activeTab === "preneces") {
      setSelectedPrenez(item);
      setIsDeletePrenezOpen(true);
    }
    if (activeTab === "nacimientos") {
      setSelectedNacimiento(item);
      setIsDeleteNacimientoOpen(true);
    }
  };

  const handleConfirmarSiguienteFase = (item) => {
    if (activeTab === "celos") {
      setSelectedPrenez(item);
      setIsPrenezConfirmMode(true);
      setIsPrenezModalOpen(true);
    }
    if (activeTab === "preneces") {
      setSelectedNacimiento(item);
      setIsNacimientoConfirmMode(true);
      setIsNacimientoModalOpen(true);
    }
  };

  const handleSubmitCelo = async (payload, isEditMode) => {
    const res = isEditMode
      ? await editarCeloAction(selectedCelo._id, payload)
      : await registrarCeloAction(payload);
    if (res.success) {
      toast.success(
        isEditMode
          ? "Celo editado correctamente"
          : "Celo registrado correctamente",
      );
      setIsCeloModalOpen(false);
    } else toast.error(res.error);
  };

  const handleSubmitPrenez = async (payload, isConfirmMode) => {
    const res = isConfirmMode
      ? await confirmarPrenezAction(selectedPrenez._id, payload)
      : await editarPrenezAction(selectedPrenez._id, payload);
    if (res.success) {
      toast.success(
        isConfirmMode
          ? "Preñez confirmada correctamente"
          : "Preñez editada correctamente",
      );
      setIsPrenezModalOpen(false);
    } else toast.error(res.error);
  };

  const handleSubmitNacimiento = async (payload, isConfirmMode) => {
    const res = isConfirmMode
      ? await confirmarNacimientoAction(selectedNacimiento._id, payload)
      : await editarNacimientoAction(selectedNacimiento._id, payload);
    if (res.success) {
      toast.success(
        isConfirmMode
          ? "Nacimiento registrado correctamente"
          : "Nacimiento editado correctamente",
      );
      setIsNacimientoModalOpen(false);
    } else toast.error(res.error);
  };

  const handleConfirmDelete = async (id, modalCloseSetter) => {
    const res = await eliminarCicloAction(id);
    if (res.success) {
      toast.success("Registro eliminado correctamente");
      modalCloseSetter(false);
    } else toast.error(res.error);
  };

  return (
    <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
      <ReproductionTableHeader activeTab={activeTab} onAdd={handleAdd} />
      <ReproductionTabs />
      <ReproductionTableControls activeTab={activeTab} />

      {activeTab === "celos" && (
        <CelosTable
          celos={datos}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onConfirmar={handleConfirmarSiguienteFase}
        />
      )}
      {activeTab === "preneces" && (
        <PrenecesTable
          preneces={datos}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onConfirmar={handleConfirmarSiguienteFase}
        />
      )}
      {activeTab === "nacimientos" && (
        <NacimientosTable
          nacimientos={datos}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}
      {activeTab === "cipa" && <CipaTable />}

      {activeTab !== "cipa" && (
        <div className="mt-4">
          <Pagination
            totalRegistros={paginacion.totalRegistros}
            totalPaginas={paginacion.totalPaginas}
            paginaActual={paginacion.paginaActual}
            limite={paginacion.limite}
          />
        </div>
      )}

      <CeloFormModal
        isOpen={isCeloModalOpen}
        onClose={() => setIsCeloModalOpen(false)}
        celoToEdit={selectedCelo}
        onSubmit={handleSubmitCelo}
      />
      <DeleteCeloModal
        isOpen={isDeleteCeloOpen}
        onClose={() => setIsDeleteCeloOpen(false)}
        celo={selectedCelo}
        onConfirm={(id) => handleConfirmDelete(id, setIsDeleteCeloOpen)}
      />

      <PrenezFormModal
        isOpen={isPrenezModalOpen}
        onClose={() => setIsPrenezModalOpen(false)}
        itemData={selectedPrenez}
        isConfirmMode={isPrenezConfirmMode}
        onSubmit={handleSubmitPrenez}
      />
      <DeletePrenezModal
        isOpen={isDeletePrenezOpen}
        onClose={() => setIsDeletePrenezOpen(false)}
        prenez={selectedPrenez}
        onConfirm={(id) => handleConfirmDelete(id, setIsDeletePrenezOpen)}
      />

      <NacimientoFormModal
        isOpen={isNacimientoModalOpen}
        onClose={() => setIsNacimientoModalOpen(false)}
        itemData={selectedNacimiento}
        isConfirmMode={isNacimientoConfirmMode}
        onSubmit={handleSubmitNacimiento}
      />
      <DeleteNacimientoModal
        isOpen={isDeleteNacimientoOpen}
        onClose={() => setIsDeleteNacimientoOpen(false)}
        nacimiento={selectedNacimiento}
        onConfirm={(id) => handleConfirmDelete(id, setIsDeleteNacimientoOpen)}
      />
    </div>
  );
}
