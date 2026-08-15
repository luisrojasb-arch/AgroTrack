"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InventoryStats from "./InventoryStats";
import InventoryTableHeader from "./InventoryTableHeader";
import InventoryTableControls from "./InventoryTableControls";
import InventoryTable from "./InventoryTable";
import Pagination from "@/components/ui/Pagination";

// Importamos Actions
import {
  createArticuloAction,
  updateArticuloAction,
  deleteArticuloAction,
  getArticuloDetallesAction,
  ajustarStockAction,
} from "@/actions/inventory.actions";

// Modales
import InventoryFormModal from "./modalsInventory/InventoryFormModal";
import InventoryDetailsModal from "./modalsInventory/InventoryDetailsModal";
import InventoryAdjustModal from "./modalsInventory/InventoryAdjustModal";
import InventoryDeleteModal from "./modalsInventory/InventoryDeleteModal";

export default function InventoryTableContainer({ initialData }) {
  const router = useRouter();
  
  // Leemos directamente del SSR
  const articulos = initialData?.inventario || [];
  const stats = initialData?.estadisticas || {};
  const paginacion = initialData?.paginacion || {
    totalRegistros: 0, paginaActual: 1, limite: 10, totalPaginas: 1,
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsData, setDetailsData] = useState(null);

  // MANEJADORES DE APERTURA
  const handleAddClick = () => { setSelectedItem(null); setIsFormOpen(true); };
  
  const handleEditClick = async (id) => {
    const res = await getArticuloDetallesAction(id);
    if (res.success) {
      setSelectedItem(res.data.articulo);
      setIsFormOpen(true);
    } else toast.error(res.error);
  };
  
  const handleDetailsClick = async (id) => {
    const res = await getArticuloDetallesAction(id);
    if (res.success) {
      setDetailsData(res.data.articulo);
      setIsDetailsOpen(true);
    } else toast.error(res.error);
  };
  
  const handleAdjustClick = (item) => { setSelectedItem(item); setIsAdjustOpen(true); };
  const handleDeleteClick = (item) => { setSelectedItem(item); setIsDeleteOpen(true); };

  // MANEJADORES DE ENVÍO
  const handleSubmitForm = async (formData) => {
    const payload = {
      ...formData,
      cantidad: Number(formData.cantidad),
      costo_unitario: Number(formData.costo_unitario),
      stock_minimo: Number(formData.stock_minimo),
    };

    const res = selectedItem 
      ? await updateArticuloAction(selectedItem._id, payload)
      : await createArticuloAction(payload);

    if (res.success) {
      toast.success(selectedItem ? "Artículo actualizado" : "Artículo registrado");
      setIsFormOpen(false);
      setSelectedItem(null);
      router.refresh(); // Pide a Next.js que recargue los datos del servidor
    } else {
      toast.error(res.error);
    }
  };

  const handleAdjustSubmit = async ({ itemId, tipo, cantidad, nota }) => {
    const payload = { tipo_ajuste: tipo, cantidad: Number(cantidad), nota };
    const res = await ajustarStockAction(itemId, payload);
    
    if (res.success) {
      toast.success("Stock ajustado correctamente");
      setIsAdjustOpen(false);
      setSelectedItem(null);
      router.refresh();
    } else toast.error(res.error);
  };

  const handleConfirmDelete = async (id) => {
    const res = await deleteArticuloAction(id);
    if (res.success) {
      toast.success("Artículo eliminado");
      setIsDeleteOpen(false);
      setSelectedItem(null);
      router.refresh();
    } else toast.error(res.error);
  };

  return (
    <>
      <InventoryStats stats={stats} />

      <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
        <InventoryTableHeader onAddArticle={handleAddClick} />
        <InventoryTableControls />

        <InventoryTable
          articulos={articulos}
          onView={handleDetailsClick}
          onEdit={handleEditClick}
          onAdjust={handleAdjustClick}
          onDelete={handleDeleteClick}
        />

        <Pagination
          totalRegistros={paginacion.totalRegistros}
          totalPaginas={paginacion.totalPaginas}
          paginaActual={paginacion.paginaActual}
          limite={paginacion.limite}
        />

        <InventoryFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} onSubmit={handleSubmitForm} />
        <InventoryDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} data={detailsData} />
        <InventoryAdjustModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} item={selectedItem} onSubmit={handleAdjustSubmit} />
        <InventoryDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} item={selectedItem} onConfirm={handleConfirmDelete} />
      </div>
    </>
  );
}