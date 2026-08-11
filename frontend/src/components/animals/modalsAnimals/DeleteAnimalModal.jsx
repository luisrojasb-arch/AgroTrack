"use client";

import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

export default function DeleteAnimalModal({
  isOpen,
  onClose,
  animal,
  onConfirm,
}) {
  const nombreAEnseñar = animal?.nombre || animal?.codigo || "este animal";

  const modalFooter = (
    <>
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-6 h-10 rounded-lg border border-border-agro bg-white text-black text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Cancelar
      </button>
      <button
        onClick={() => onConfirm(animal?._id)}
        className="w-full sm:w-auto px-6 h-10 rounded-lg bg-[#F04438] text-white text-[14px] font-medium hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
      >
        Eliminar Animal
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      footer={modalFooter}
    >
      <div className="flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="text-[#F04438] w-7 h-7" strokeWidth={2} />
        </div>

        <h3 className="text-[20px] font-bold text-black mb-2 leading-tight">
          ¿Seguro Que Quiere Eliminar el Animal?
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
