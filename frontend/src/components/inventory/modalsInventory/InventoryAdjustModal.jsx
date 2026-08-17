"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

export default function InventoryAdjustModal({ isOpen, onClose, item, onSubmit }) {
  const [ajuste, setAjuste] = useState({ tipo: "Salida", cantidad: "", nota: "" });

  if (!item) return null;

  const handleSubmit = () => {
    onSubmit({ itemId: item._id, ...ajuste });
    setAjuste({ tipo: "Salida", cantidad: "", nota: "" });
  };

  const formFooter = (
    <>
      <Button variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button variant="green" onClick={handleSubmit} className="w-full sm:w-auto">
        Registrar Ajuste
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajustar Stock" description="Ingresa los detalles de entrada o salida" width="max-w-xl" footer={formFooter}>
      <div className="px-6 pb-2 mt-2">
        <h3 className="text-center text-[15px] font-bold text-black mb-6">
          {item.nombre || item.codigo} - Actual: {item.cantidad} {item.unidad}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">Tipo de Ajuste *</label>
            <Select opciones={["Entrada", "Salida"]} valorSeleccionado={ajuste.tipo} onChange={(val) => setAjuste({...ajuste, tipo: val})} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">Cantidad *</label>
            <input type="number" min="1" value={ajuste.cantidad} onChange={(e) => setAjuste({...ajuste, cantidad: e.target.value})} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Nota</label>
          <textarea value={ajuste.nota} onChange={(e) => setAjuste({...ajuste, nota: e.target.value})} placeholder="Motivo del ajuste" rows={3} className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"></textarea>
        </div>
      </div>
    </Modal>
  );
}