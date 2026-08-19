"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { TriangleAlert } from "lucide-react";

export default function HealthTareaDeleteModal({ isOpen, onClose, tarea, onConfirm }) {
  if (!tarea) return null;

  const identificador = tarea.animal_id 
    ? (tarea.animal_id.nombre || tarea.animal_id.codigo) 
    : (tarea.lote_id?.codigo_lote || "el lote");

  const formFooter = (
    <>
      <Button type="button" variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <button
        type="button"
        onClick={() => onConfirm(tarea._id)}
        className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[14px] font-bold rounded-lg transition-colors cursor-pointer"
      >
        Eliminar Tarea
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" footer={formFooter}>
      <div className="flex flex-col items-center justify-center gap-4 px-6 pt-8 pb-4 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <TriangleAlert className="w-7 h-7 text-red-500" strokeWidth={2} />
        </div>
        <h2 className="text-[20px] font-bold text-black leading-tight">
          ¿Seguro que quiere eliminar la tarea?
        </h2>
        <p className="text-[14px] text-gray-500 leading-relaxed">
          Estás a punto de eliminar la tarea de <span className="font-bold text-black">{identificador}</span>. Esta acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
}