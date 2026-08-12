"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function AprobarMadreModal({ isOpen, onClose, onConfirm }) {
  const footer = (
    <>
      <Button variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button variant="green" onClick={onConfirm} className="w-full sm:w-auto">
        Aprobar Madre
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-xl" footer={footer}>
      <div className="flex flex-col items-center justify-center text-center px-6 pb-2">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle className="text-primary w-7 h-7" strokeWidth={2} />
        </div>
        <h3 className="text-[20px] font-bold text-black mb-2 leading-tight">
          ¿Aprobar como Madre Oficial?
        </h3>
        <p className="text-[14px] text-gray-500">
          Estás a punto de aprobar esta hembra. Será registrada automáticamente
          en el inventario general como una reproductora.
        </p>
      </div>
    </Modal>
  );
}
