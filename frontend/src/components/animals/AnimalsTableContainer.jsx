"use client";

import { useState } from "react";
import AnimalsTableHeader from "./AnimalsTableHeader";
import AnimalsTabs from "./AnimalsTabs";
import AnimalsTableControls from "./AnimalsTableControls";
import AnimalsTable from "./AnimalsTable";
import LotesTable from "./LotesTable";
import SeleccionTable from "./SeleccionTable";
import Pagination from "@/components/ui/Pagination";

import AnimalFormModal from "./modalsAnimals/AnimalFormModal";
import AnimalDetailsModal from "./modalsAnimals/AnimalDetailsModal";
import DeleteAnimalModal from "./modalsAnimals/DeleteAnimalModal";
import {
  createAnimalAction,
  updateAnimalAction,
  deleteAnimalAction,
  getAnimalDetailsAction,
} from "@/actions/animal.actions";

import LoteFormModal from "./modalsLote/LoteFormModal";
import LoteDetailsModal from "./modalsLote/LoteDetailsModal";
import DeleteLoteModal from "./modalsLote/DeleteLoteModal";
import {
  createLoteAction,
  updateLoteAction,
  deleteLoteAction,
  getLoteDetailsAction,
} from "@/actions/lote.actions";

import SeleccionFormModal from "./modalsSeleccion/SeleccionFormModal";
import SeleccionDetailsModal from "./modalsSeleccion/SeleccionDetailsModal";
import RegistrarPesoModal from "./modalsSeleccion/RegistrarPesoModal";
import DeleteSeleccionModal from "./modalsSeleccion/DeleteSeleccionModal";
import {
  createSeleccionAction,
  updateSeleccionAction,
  deleteSeleccionAction,
  getSeleccionDetailsAction,
  registrarPesoAction,
  aprobarSeleccionAction,
} from "@/actions/seleccion.actions";

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

  const [isAnimalFormOpen, setIsAnimalFormOpen] = useState(false);
  const [isAnimalDetailsOpen, setIsAnimalDetailsOpen] = useState(false);
  const [isAnimalDeleteOpen, setIsAnimalDeleteOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [animalDetailsData, setAnimalDetailsData] = useState(null);

  const handleAddAnimal = () => {
    setSelectedAnimal(null);
    setIsAnimalFormOpen(true);
  };
  const handleEditAnimal = (animal) => {
    setSelectedAnimal(animal);
    setIsAnimalFormOpen(true);
  };
  const handleDeleteAnimalClick = (animal) => {
    setSelectedAnimal(animal);
    setIsAnimalDeleteOpen(true);
  };

  const handleViewAnimalDetails = async (id) => {
    const res = await getAnimalDetailsAction(id);
    if (res.success) {
      setAnimalDetailsData(res.data);
      setIsAnimalDetailsOpen(true);
    } else {
      alert("Error al cargar detalles: " + res.error);
    }
  };

  const handleSubmitAnimalForm = async (formData) => {
    const dataToSend = {
      ...formData,
      peso: Number(formData.peso),
      cantidad_pezones: Number(formData.cantidad_pezones),
    };
    const res = selectedAnimal
      ? await updateAnimalAction(selectedAnimal._id, dataToSend)
      : await createAnimalAction(dataToSend);

    if (res.success) {
      setIsAnimalFormOpen(false);
      setSelectedAnimal(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleConfirmDeleteAnimal = async (id) => {
    const res = await deleteAnimalAction(id);
    if (res.success) {
      setIsAnimalDeleteOpen(false);
      setSelectedAnimal(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const [isLoteFormOpen, setIsLoteFormOpen] = useState(false);
  const [isLoteDetailsOpen, setIsLoteDetailsOpen] = useState(false);
  const [isLoteDeleteOpen, setIsLoteDeleteOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const [loteDetailsData, setLoteDetailsData] = useState(null);

  const handleAddLote = () => {
    setSelectedLote(null);
    setIsLoteFormOpen(true);
  };
  const handleEditLote = (lote) => {
    setSelectedLote(lote);
    setIsLoteFormOpen(true);
  };
  const handleDeleteLoteClick = (lote) => {
    setSelectedLote(lote);
    setIsLoteDeleteOpen(true);
  };

  const handleViewLoteDetails = async (id) => {
    const res = await getLoteDetailsAction(id);
    if (res.success) {
      setLoteDetailsData(res.data);
      setIsLoteDetailsOpen(true);
    } else {
      alert("Error al cargar detalles: " + res.error);
    }
  };

  const handleSubmitLoteForm = async (formData) => {
    const res = selectedLote
      ? await updateLoteAction(selectedLote._id, formData)
      : await createLoteAction(formData);

    if (res.success) {
      setIsLoteFormOpen(false);
      setSelectedLote(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleConfirmDeleteLote = async (id) => {
    const res = await deleteLoteAction(id);
    if (res.success) {
      setIsLoteDeleteOpen(false);
      setSelectedLote(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const [isSeleccionFormOpen, setIsSeleccionFormOpen] = useState(false);
  const [isSeleccionDetailsOpen, setIsSeleccionDetailsOpen] = useState(false);
  const [isSeleccionDeleteOpen, setIsSeleccionDeleteOpen] = useState(false);
  const [isRegistrarPesoOpen, setIsRegistrarPesoOpen] = useState(false);

  const [selectedSeleccion, setSelectedSeleccion] = useState(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [seleccionDetailsData, setSeleccionDetailsData] = useState(null);

  const handleAddSeleccion = () => {
    setSelectedSeleccion(null);
    setIsSeleccionFormOpen(true);
  };
  const handleEditSeleccion = (seleccion) => {
    setSelectedSeleccion(seleccion);
    setIsSeleccionFormOpen(true);
  };
  const handleDeleteSeleccionClick = (seleccion) => {
    setSelectedSeleccion(seleccion);
    setIsSeleccionDeleteOpen(true);
  };

  const handleViewSeleccionDetails = async (id) => {
    const res = await getSeleccionDetailsAction(id);
    if (res.success) {
      setSeleccionDetailsData(res.data);
      setIsSeleccionDetailsOpen(true);
    } else {
      alert("Error al cargar detalles: " + res.error);
    }
  };

  const handleApproveSeleccion = async (grupo_id, animal_id) => {
    if (
      confirm(
        "¿Estás seguro de aprobar esta hembra para pasarla al inventario oficial?",
      )
    ) {
      const res = await aprobarSeleccionAction(grupo_id, { animal_id });
      if (res.success) {
        alert("¡Madre aprobada y agregada al inventario!");
        handleViewSeleccionDetails(grupo_id);
      } else {
        alert("Error: " + res.error);
      }
    }
  };

  const handleSubmitSeleccionForm = async (payload, isEditMode) => {
    if (isEditMode) {
      const res = await updateSeleccionAction(selectedSeleccion._id, payload);
      if (res.success) {
        setIsSeleccionFormOpen(false);
        setSelectedSeleccion(null);
      } else {
        alert("Error al editar: " + res.error);
      }
    } else {
      const res = await createSeleccionAction(payload);
      if (res.success) {
        setIsSeleccionFormOpen(false);
      } else {
        alert("Error al registrar: " + res.error);
      }
    }
  };

  const handleConfirmDeleteSeleccion = async (id) => {
    const res = await deleteSeleccionAction(id);
    if (res.success) {
      setIsSeleccionDeleteOpen(false);
      setSelectedSeleccion(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleOpenRegistrarPeso = (grupo_id, animal_id) => {
    setIsSeleccionDetailsOpen(false);
    setSelectedSeleccion({ _id: grupo_id });
    setSelectedAnimalId(animal_id);
    setIsRegistrarPesoOpen(true);
  };

  const handleSubmitPeso = async (peso) => {
    const res = await registrarPesoAction(selectedSeleccion._id, {
      animal_id: selectedAnimalId,
      peso,
    });
    if (res.success) {
      setIsRegistrarPesoOpen(false);
      handleViewSeleccionDetails(selectedSeleccion._id);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="bg-white border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
      <AnimalsTableHeader
        activeTab={activeTab}
        onAddAnimal={handleAddAnimal}
        onAddLote={handleAddLote}
        onAddSeleccion={handleAddSeleccion}
      />
      <AnimalsTabs />
      <AnimalsTableControls activeTab={activeTab} />

      {activeTab === "individuales" && (
        <AnimalsTable
          animales={animales}
          onView={handleViewAnimalDetails}
          onEdit={handleEditAnimal}
          onDelete={handleDeleteAnimalClick}
        />
      )}
      {activeTab === "lotes" && (
        <LotesTable
          lotes={lotes}
          onView={handleViewLoteDetails}
          onEdit={handleEditLote}
          onDelete={handleDeleteLoteClick}
        />
      )}
      {activeTab === "madre" && (
        <SeleccionTable
          selecciones={selecciones}
          onView={handleViewSeleccionDetails}
          onEdit={handleEditSeleccion}
          onDelete={handleDeleteSeleccionClick}
        />
      )}

      <Pagination
        totalRegistros={paginacion.totalRegistros}
        totalPaginas={paginacion.totalPaginas}
        paginaActual={paginacion.paginaActual}
        limite={paginacion.limite}
      />

      <AnimalFormModal
        isOpen={isAnimalFormOpen}
        onClose={() => setIsAnimalFormOpen(false)}
        animalToEdit={selectedAnimal}
        onSubmit={handleSubmitAnimalForm}
      />
      <AnimalDetailsModal
        isOpen={isAnimalDetailsOpen}
        onClose={() => setIsAnimalDetailsOpen(false)}
        data={animalDetailsData}
      />
      <DeleteAnimalModal
        isOpen={isAnimalDeleteOpen}
        onClose={() => setIsAnimalDeleteOpen(false)}
        animal={selectedAnimal}
        onConfirm={handleConfirmDeleteAnimal}
      />

      <LoteFormModal
        isOpen={isLoteFormOpen}
        onClose={() => setIsLoteFormOpen(false)}
        loteToEdit={selectedLote}
        onSubmit={handleSubmitLoteForm}
      />
      <LoteDetailsModal
        isOpen={isLoteDetailsOpen}
        onClose={() => setIsLoteDetailsOpen(false)}
        data={loteDetailsData}
      />
      <DeleteLoteModal
        isOpen={isLoteDeleteOpen}
        onClose={() => setIsLoteDeleteOpen(false)}
        lote={selectedLote}
        onConfirm={handleConfirmDeleteLote}
      />

      <SeleccionFormModal
        isOpen={isSeleccionFormOpen}
        onClose={() => setIsSeleccionFormOpen(false)}
        seleccionToEdit={selectedSeleccion}
        onSubmit={handleSubmitSeleccionForm}
      />
      <SeleccionDetailsModal
        isOpen={isSeleccionDetailsOpen}
        onClose={() => setIsSeleccionDetailsOpen(false)}
        data={seleccionDetailsData}
        onOpenRegistrarPeso={handleOpenRegistrarPeso}
        onApprove={handleApproveSeleccion}
      />
      <RegistrarPesoModal
        isOpen={isRegistrarPesoOpen}
        onClose={() => setIsRegistrarPesoOpen(false)}
        onSubmitPeso={handleSubmitPeso}
      />
      <DeleteSeleccionModal
        isOpen={isSeleccionDeleteOpen}
        onClose={() => setIsSeleccionDeleteOpen(false)}
        seleccion={selectedSeleccion}
        onConfirm={handleConfirmDeleteSeleccion}
      />
    </div>
  );
}
