"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import AnimalSituationModal from "./modalsAnimals/AnimalSituationModal";
import {
  createAnimalAction,
  updateAnimalAction,
  deleteAnimalAction,
  getAnimalDetailsAction,
  registrarSituacionAction,
} from "@/actions/animal.actions";

import LoteFormModal from "./modalsLote/LoteFormModal";
import LoteDetailsModal from "./modalsLote/LoteDetailsModal";
import DeleteLoteModal from "./modalsLote/DeleteLoteModal";
import LoteSituationModal from "./modalsLote/LoteSituationModal";
import {
  createLoteAction,
  updateLoteAction,
  deleteLoteAction,
  getLoteDetailsAction,
  registrarSituacionLoteAction,
} from "@/actions/lote.actions";

import SeleccionFormModal from "./modalsSeleccion/SeleccionFormModal";
import SeleccionDetailsModal from "./modalsSeleccion/SeleccionDetailsModal";
import RegistrarPesoModal from "./modalsSeleccion/RegistrarPesoModal";
import DeleteSeleccionModal from "./modalsSeleccion/DeleteSeleccionModal";
import AprobarMadreModal from "./modalsSeleccion/AprobarMadreModal";
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
  const [isAnimalSituationOpen, setIsAnimalSituationOpen] = useState(false);
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
  const handleSituationAnimalClick = (animal) => {
    setSelectedAnimal(animal);
    setIsAnimalSituationOpen(true);
  };

  const handleViewAnimalDetails = async (id) => {
    const res = await getAnimalDetailsAction(id);
    if (res.success) {
      setAnimalDetailsData(res.data);
      setIsAnimalDetailsOpen(true);
    } else {
      toast.error(res.error || "Error al cargar detalles");
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
      toast.success(
        selectedAnimal
          ? "Animal actualizado correctamente"
          : "Animal registrado correctamente",
      );
    } else {
      toast.error(res.error);
    }
  };

  const handleConfirmDeleteAnimal = async (id) => {
    const res = await deleteAnimalAction(id);
    if (res.success) {
      setIsAnimalDeleteOpen(false);
      setSelectedAnimal(null);
      toast.success("Animal eliminado correctamente");
    } else {
      toast.error(res.error);
    }
  };

  const handleSubmitAnimalSituation = async (payload) => {
    const dataToSend = { ...payload };
    delete dataToSend.animal_id;
    const res = await registrarSituacionAction(selectedAnimal._id, dataToSend);

    if (res.success) {
      setIsAnimalSituationOpen(false);
      setSelectedAnimal(null);
      toast.success("Situación registrada correctamente");
    } else {
      toast.error(res.error);
    }
  };

  const [isLoteFormOpen, setIsLoteFormOpen] = useState(false);
  const [isLoteDetailsOpen, setIsLoteDetailsOpen] = useState(false);
  const [isLoteDeleteOpen, setIsLoteDeleteOpen] = useState(false);
  const [isLoteSituationOpen, setIsLoteSituationOpen] = useState(false);
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
  const handleSituationLoteClick = (lote) => {
    setSelectedLote(lote);
    setIsLoteSituationOpen(true);
  };

  const handleViewLoteDetails = async (id) => {
    const res = await getLoteDetailsAction(id);
    if (res.success) {
      setLoteDetailsData(res.data);
      setIsLoteDetailsOpen(true);
    } else {
      toast.error(res.error || "Error al cargar detalles del lote");
    }
  };

  const handleSubmitLoteForm = async (formData) => {
    const res = selectedLote
      ? await updateLoteAction(selectedLote._id, formData)
      : await createLoteAction(formData);

    if (res.success) {
      setIsLoteFormOpen(false);
      setSelectedLote(null);
      toast.success(
        selectedLote
          ? "Lote actualizado correctamente"
          : "Lote registrado correctamente",
      );
    } else {
      toast.error(res.error);
    }
  };

  const handleConfirmDeleteLote = async (id) => {
    const res = await deleteLoteAction(id);
    if (res.success) {
      setIsLoteDeleteOpen(false);
      setSelectedLote(null);
      toast.success("Lote eliminado correctamente");
    } else {
      toast.error(res.error);
    }
  };

  const handleSubmitLoteSituation = async (payload) => {
    const dataToSend = { ...payload };
    delete dataToSend.lote_id;
    const res = await registrarSituacionLoteAction(
      selectedLote._id,
      dataToSend,
    );

    if (res.success) {
      setIsLoteSituationOpen(false);
      setSelectedLote(null);
      toast.success("Situación registrada correctamente");
    } else {
      toast.error(res.error);
    }
  };

  const [isSeleccionFormOpen, setIsSeleccionFormOpen] = useState(false);
  const [isSeleccionDetailsOpen, setIsSeleccionDetailsOpen] = useState(false);
  const [isSeleccionDeleteOpen, setIsSeleccionDeleteOpen] = useState(false);
  const [isRegistrarPesoOpen, setIsRegistrarPesoOpen] = useState(false);

  const [isAprobarMadreOpen, setIsAprobarMadreOpen] = useState(false);
  const [aprobarMadreData, setAprobarMadreData] = useState({
    grupo_id: null,
    animal_id: null,
  });

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
      toast.error(res.error || "Error al cargar detalles de la selección");
    }
  };

  const handleOpenApproveMadre = (grupo_id, animal_id) => {
    setAprobarMadreData({ grupo_id, animal_id });
    setIsAprobarMadreOpen(true);
  };

  const handleConfirmApproveMadre = async () => {
    const { grupo_id, animal_id } = aprobarMadreData;
    const res = await aprobarSeleccionAction(grupo_id, { animal_id });

    if (res.success) {
      toast.success("¡Madre aprobada y agregada al inventario!");
      setIsAprobarMadreOpen(false);
      handleViewSeleccionDetails(grupo_id);
    } else {
      toast.error(res.error);
    }
  };

  const handleSubmitSeleccionForm = async (payload, isEditMode) => {
    if (isEditMode) {
      const res = await updateSeleccionAction(selectedSeleccion._id, payload);
      if (res.success) {
        setIsSeleccionFormOpen(false);
        setSelectedSeleccion(null);
        toast.success("Selección actualizada correctamente");
      } else {
        toast.error(res.error);
      }
    } else {
      const res = await createSeleccionAction(payload);
      if (res.success) {
        setIsSeleccionFormOpen(false);
        toast.success("Selección registrada correctamente");
      } else {
        toast.error(res.error);
      }
    }
  };

  const handleConfirmDeleteSeleccion = async (id) => {
    const res = await deleteSeleccionAction(id);
    if (res.success) {
      setIsSeleccionDeleteOpen(false);
      setSelectedSeleccion(null);
      toast.success("Selección eliminada correctamente");
    } else {
      toast.error(res.error);
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
      toast.success("Peso registrado correctamente");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
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
          onSituation={handleSituationAnimalClick}
        />
      )}
      {activeTab === "lotes" && (
        <LotesTable
          lotes={lotes}
          onView={handleViewLoteDetails}
          onEdit={handleEditLote}
          onDelete={handleDeleteLoteClick}
          onSituation={handleSituationLoteClick}
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
      <AnimalSituationModal
        isOpen={isAnimalSituationOpen}
        onClose={() => setIsAnimalSituationOpen(false)}
        animal={selectedAnimal}
        onSubmit={handleSubmitAnimalSituation}
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
      <LoteSituationModal
        isOpen={isLoteSituationOpen}
        onClose={() => setIsLoteSituationOpen(false)}
        lote={selectedLote}
        onSubmit={handleSubmitLoteSituation}
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
        onApprove={handleOpenApproveMadre}
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

      <AprobarMadreModal
        isOpen={isAprobarMadreOpen}
        onClose={() => setIsAprobarMadreOpen(false)}
        onConfirm={handleConfirmApproveMadre}
      />
    </div>
  );
}
