"use client";

import { useState, Suspense } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 
import FinanceStats from "./FinanceStats";
import FinanceCharts from "./FinanceCharts";
import FinanceTableControls from "./FinanceTableControls";
import FinanceTable from "./FinanceTable";
import Pagination from "@/components/ui/Pagination";

import FinanceFormModal from "./modalsFinance/FinanceFormModal";
import FinanceViewModal from "./modalsFinance/FinanceViewModal";
import FinanceDeleteModal from "./modalsFinance/FinanceDeleteModal";

import { 
  deleteTransaccionAction, 
  createTransaccionAction, 
  updateTransaccionAction 
} from "@/actions/finance.actions";

/**
 * @description Contenedor principal de la vista de finanzas.
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales para poblar finanzas.
 */

export default function FinanceContainer({ initialData }) {
  const router = useRouter(); // Instanciamos el router

  const transacciones = initialData?.transacciones || [];
  const datagraph = initialData?.datagraph || []; 
  const datagraph2 = initialData?.datagraph2 || []; 
  
  const [selectedItem, setSelectedItem] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmitForm = async (formData) => {
    let respuesta;

    if (selectedItem) {
      respuesta = await updateTransaccionAction(selectedItem.id, formData);
    } else {
      respuesta = await createTransaccionAction(formData);
    }

    if (respuesta.success) {
      toast.success(selectedItem ? "Transacción actualizada exitosamente" : "Transacción registrada exitosamente");
      setIsFormOpen(false);
      setSelectedItem(null);
      router.refresh(); 
    } else {
      toast.error(respuesta.error || "Ocurrió un error al guardar la transacción");
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    const respuesta = await deleteTransaccionAction(selectedItem.id);
    
    if (respuesta.success) {
      toast.success("Transacción eliminada exitosamente");
      setIsDeleteOpen(false);
      setSelectedItem(null);
      router.refresh(); 
    } else {
      toast.error(respuesta.error || "Ocurrió un error al eliminar");
    }
    
    setIsDeleting(false);
  };

  return (
    <>
      <FinanceStats stats={initialData?.estadisticas} />
      <FinanceCharts datagraph1={datagraph} datagraph2={datagraph2} />

      <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
        <Suspense fallback={<div className="h-10 mb-6 text-sm text-gray-400">Cargando controles...</div>}>
          <FinanceTableControls 
            onAddTransaction={() => { 
              setSelectedItem(null); 
              setIsFormOpen(true); 
            }} 
          />
        </Suspense>

        <FinanceTable 
          transacciones={transacciones} 
          onView={(item) => { 
            setSelectedItem(item); 
            setIsViewOpen(true); 
          }}
          onEdit={(item) => { 
            setSelectedItem(item); 
            setIsFormOpen(true); 
          }}
          onDelete={(item) => { 
            setSelectedItem(item);
            setIsDeleteOpen(true);
          }}
        />

        <Pagination 
          totalRegistros={initialData?.paginacion?.totalRegistros || 0} 
          totalPaginas={initialData?.paginacion?.totalPaginas || 1} 
          paginaActual={initialData?.paginacion?.paginaActual || 1} 
          limite={initialData?.paginacion?.limite || 10} 
        />

        <FinanceFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          itemToEdit={selectedItem} 
          onSubmit={handleSubmitForm} 
        />

        <FinanceViewModal 
          isOpen={isViewOpen} 
          onClose={() => setIsViewOpen(false)} 
          transaction={selectedItem} 
        />

        <FinanceDeleteModal 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
          onConfirm={handleConfirmDelete} 
          transaction={selectedItem} 
          isDeleting={isDeleting}
        />
      </div>
    </>
  );
}