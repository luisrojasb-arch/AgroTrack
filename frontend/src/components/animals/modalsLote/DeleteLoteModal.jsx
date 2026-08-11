"use client";

import Modal from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

export default function DeleteLoteModal({ isOpen, onClose, lote, onConfirm }) {
  const nombreLote = lote?.codigo_lote || "este lote";

  const deleteFooter = (
    <>
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-6 h-10 rounded-lg border border-border-agro bg-white text-black text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Cancelar
      </button>
      <button
        onClick={() => onConfirm(lote?._id)}
        className="w-full sm:w-auto px-6 h-10 rounded-lg bg-[#F04438] text-white text-[14px] font-medium hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
      >
        Eliminar Lote
      </button>
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
          ¿Seguro Que Quiere Eliminar el Lote?
        </h3>

        <p className="text-[14px] text-gray-500">
          Estás a punto de eliminar a{" "}
          <span className="font-bold text-black">{nombreLote}</span>. Esta
          acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
}
