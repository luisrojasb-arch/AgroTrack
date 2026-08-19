"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function HealthTareaDetailsModal({ isOpen, onClose, tarea }) {
  if (!tarea) return null;

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const codigoEntidad = tarea.animal_id 
    ? tarea.animal_id.codigo 
    : tarea.lote_id?.codigo_lote || "-";

  const formFooter = (
    <Button type="button" variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cerrar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de Salud"
      description="Información técnica y existencias"
      footer={formFooter}
      width="max-w-xl"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-500">Codigo</span>
            <span className="text-[14px] font-bold text-black">{codigoEntidad}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-500">Tipo</span>
            <span className="text-[14px] font-bold text-black">{tarea.tipo || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-500">Producto</span>
            <span className="text-[14px] font-bold text-black">{tarea.producto || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-500">Dosis (ml)</span>
            <span className="text-[14px] font-bold text-black">{tarea.dosis || "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-500">Fecha</span>
            <span className="text-[14px] font-bold text-black">{formatearFecha(tarea.fecha)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-500">Proxima dosis (Opcional)</span>
            <span className="text-[14px] font-bold text-black">{formatearFecha(tarea.proxima_dosis)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-gray-500">Nota</span>
          <div className="w-full min-h-[80px] p-3 border border-border-agro rounded-lg bg-white text-sm text-black">
            {tarea.nota || "Sin nota registrada."}
          </div>
        </div>
      </div>
    </Modal>
  );
}