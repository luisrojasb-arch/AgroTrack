"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

/**
 * @description Modal para registrar un nuevo peso en el historial.
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de visibilidad.
 * @param {Function} props.onClose - Función para cerrar.
 * @param {Function} props.onSubmitPeso - Función para enviar el peso.
 */

export default function RegistrarPesoModal({ isOpen, onClose, onSubmitPeso }) {
  const [peso, setPeso] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!peso || Number(peso) <= 0) {
      toast.error("Por favor ingrese un peso válido.");
      return;
    }
    onSubmitPeso(Number(peso));
    setPeso("");
  };

  const formFooter = (
    <>
      <Button
        variant="white"
        onClick={onClose}
        type="button"
        className="w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        variant="green"
        onClick={handleSubmit}
        type="button"
        className="w-full sm:w-auto"
      >
        Registrar Peso
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Peso Nuevo"
      description="Nuevo peso para sacar la mejor madre"
      width="max-w-md"
      footer={formFooter}
    >
      <div className="px-6 pb-2 -mt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Peso Actual *
          </label>
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="0"
            min="0"
            step="0.1"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
      </div>
    </Modal>
  );
}
