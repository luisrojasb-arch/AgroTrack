"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Circle, Eye, Edit, Trash2 } from "lucide-react";

export default function HealthTareasModal({
  isOpen,
  onClose,
  tareas = [],
  entidadType = "Animal", 
}) {
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formFooter = (
    <Button type="button" variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cancelar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tareas de Salud del ${entidadType}`}
      description={`Información completa sobre la salud del ${entidadType.toLowerCase()}`}
      footer={formFooter}
      width="max-w-2xl"
    >
      <div className="flex flex-col gap-4 p-6">
        {tareas.length > 0 ? (
          tareas.map((tarea) => {
            const esPendiente = new Date(tarea.fecha) > new Date();

            return (
              <div
                key={tarea._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-border-agro rounded-xl shadow-sm gap-4"
              >
                <div className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-bold text-black">{tarea.tipo}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          esPendiente
                            ? "bg-gray-50 text-gray-600 border-gray-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {esPendiente ? "Pendiente" : "Aplicado"}
                      </span>
                    </div>
                    <span className="text-[14px] text-gray-600 mt-1">{tarea.producto}</span>
                    <span className="text-[12px] font-bold text-black mt-2">
                      {esPendiente ? "Programada: " : "Aplicada: "}
                      <span className="font-normal text-gray-600">
                        {formatearFecha(tarea.fecha)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-agro text-green-600 hover:bg-green-50 transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-agro text-green-600 hover:bg-green-50 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center border border-dashed border-border-agro rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">
              No hay tareas de salud registradas para este {entidadType.toLowerCase()}.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}