"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

/**
 * @description Modal de confirmación para eliminar un registro de selección.
 * @param {Object} props - Propiedades del modal.
 */

export default function DeleteSeleccionModal({
  isOpen,
  onClose,
  seleccion,
  onConfirm,
}) {
  const nombreAEnseñar = seleccion?.codigo_grupo || "este grupo";

  const deleteFooter = (
    <>
      <Button variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button
        variant="red"
        onClick={() => onConfirm(seleccion?._id)}
        className="w-full sm:w-auto"
      >
        Eliminar Selección
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      footer={deleteFooter}
    >
      <div className="flex flex-col items-center justify-center text-center px-6 pb-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="text-[#F04438] w-7 h-7" strokeWidth={2} />
        </div>
        <h3 className="text-[20px] font-bold text-black mb-2 leading-tight">
          ¿Seguro Que Quiere Eliminar el Lote de Selección?
        </h3>
        <p className="text-[14px] text-gray-500">
          Estás a punto de eliminar a{" "}
          <span className="font-bold text-black">{nombreAEnseñar}</span>. Esta
          acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
}
