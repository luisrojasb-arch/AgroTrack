"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function InventoryDeleteModal({ isOpen, onClose, item, onConfirm }) {
  const nombreAEnseñar = item?.nombre || item?.codigo || "este artículo";

  const handleConfirm = () => {
    // CORRECCIÓN: Busca 'id' (de la tabla) o '_id' (de la base de datos directa)
    const itemId = item?.id || item?._id;
    
    if (!itemId) {
      toast.error("Error: No se pudo encontrar el ID del artículo.");
      return;
    }
    
    onConfirm(itemId);
  };

  const modalFooter = (
    <>
      <Button variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      
      <Button variant="red" onClick={handleConfirm} className="w-full sm:w-auto">
        Eliminar Artículo
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-xl" footer={modalFooter}>
      <div className="flex flex-col items-center justify-center text-center px-6 pb-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="text-[#F04438] w-7 h-7" strokeWidth={2} />
        </div>

        <h3 className="text-[20px] font-bold text-black mb-2 leading-tight">
          ¿Seguro Que Quiere Eliminar el Artículo?
        </h3>

        <p className="text-[14px] text-gray-500">
          Estás a punto de eliminar a <span className="font-bold text-black">{nombreAEnseñar}</span>. Esta acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
}