"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Circle, CheckCircle2, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner"; // Asegúrate de tener instalado sonner para las notificaciones

export default function HealthTareasModal({
  isOpen,
  onClose,
  tareas = [],
  entidadType = "Animal",
  onToggleTarea, // Nueva prop para manejar la actualización
}) {
  // Estado local para manejar transiciones de carga mientras se actualiza
  const [loadingId, setLoadingId] = useState(null);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleToggleClick = async (tareaId) => {
    if (!onToggleTarea) return;
    
    setLoadingId(tareaId);
    try {
      // Llamamos a la función que ejecuta el Server Action
      await onToggleTarea(tareaId);
    } catch (error) {
      toast.error("Error al actualizar la tarea");
    } finally {
      setLoadingId(null);
    }
  };

  const formFooter = (
    <Button type="button" variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cerrar
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
            // Lógica de estado idéntica a la del backend (salud.controller.js)
            const ahora = new Date();
            const fechaTarea = new Date(tarea.fecha);
            
            let estado = "Pendiente";
            let esPendiente = true;
            let esVencido = false;

            if (tarea.aplicado) {
              estado = "Aplicado";
              esPendiente = false;
            } else if (fechaTarea < ahora) {
              estado = "Vencido";
              esPendiente = false;
              esVencido = true;
            }

            const isUpdating = loadingId === tarea._id;

            return (
              <div
                key={tarea._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-border-agro rounded-xl shadow-sm gap-4"
              >
                {/* Lado izquierdo: Información de la tarea */}
                <div className="flex items-start gap-3">
                  
                  {/* BOTÓN CHECK CIRCULAR */}
                  <button 
                    onClick={() => handleToggleClick(tarea._id)}
                    disabled={isUpdating}
                    className={`shrink-0 mt-0.5 transition-all cursor-pointer ${isUpdating ? 'opacity-50' : 'hover:scale-110'}`}
                    aria-label={tarea.aplicado ? "Desmarcar tarea" : "Marcar tarea como aplicada"}
                  >
                    {tarea.aplicado ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 fill-green-50" />
                    ) : (
                      <Circle className={`w-6 h-6 ${esVencido ? "text-red-500" : "text-gray-300"}`} />
                    )}
                  </button>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-bold text-black">{tarea.tipo}</span>
                      
                      {/* ETIQUETA DE ESTADO */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          tarea.aplicado
                            ? "bg-green-50 text-green-700 border-green-200"
                            : esVencido
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {estado}
                      </span>
                    </div>
                    <span className="text-[14px] text-gray-600 mt-1">{tarea.producto}</span>
                    <span className="text-[12px] font-bold text-black mt-2">
                      {tarea.aplicado ? "Aplicada: " : "Programada: "}
                      <span className="font-normal text-gray-600">
                        {formatearFecha(tarea.fecha)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Lado derecho: Botones de acción */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-agro text-green-600 hover:bg-green-50 transition-colors cursor-pointer">
                    <Eye size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-agro text-green-600 hover:bg-green-50 transition-colors cursor-pointer">
                    <Edit size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
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