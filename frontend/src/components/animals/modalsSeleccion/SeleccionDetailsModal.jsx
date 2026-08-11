"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function SeleccionDetailsModal({
  isOpen,
  onClose,
  data,
  onOpenRegistrarPeso,
  onApprove,
}) {
  if (!data || !data.datos_basicos) return null;

  const grupo = data.datos_basicos;
  const animales = data.animales || [];

  const detailsFooter = (
    <Button variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cerrar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de Selección"
      description="Información completa del grupo"
      width="max-w-4xl"
      footer={detailsFooter}
    >
      <div className="flex flex-col mt-2 px-6 pb-2 gap-6">
        <h3 className="text-[18px] font-bold text-center text-black">
          Selección {grupo.codigo_grupo}
        </h3>

        <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {animales.map((animal) => {
            const pesoActual =
              animal.historial_pesos?.length > 0
                ? animal.historial_pesos[animal.historial_pesos.length - 1].peso
                : animal.peso_inicial;

            return (
              <div
                key={animal._id}
                className="border border-border-agro rounded-xl p-6 bg-white shadow-sm flex flex-col gap-5 relative"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Código
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {animal.codigo}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Nombre
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {animal.nombre || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Peso Promedio
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {pesoActual} kg
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Raza
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {animal.raza || "-"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Peso Actual
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {pesoActual} kg
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Cantidad de pezones
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {animal.cantidad_pezones || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Patas Delanteras
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {animal.patas_delanteras}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-gray-500">
                      Patas Traseras
                    </span>
                    <span className="text-[15px] text-black font-medium">
                      {animal.patas_traseras}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-3 w-full pt-1 border-t border-gray-100">
                  <button
                    onClick={() => onOpenRegistrarPeso(grupo._id, animal._id)}
                    className="flex-1 h-10 rounded-lg border border-border-agro text-[13px] font-medium text-black hover:bg-gray-50 transition cursor-pointer flex items-center justify-center"
                  >
                    Registrar Peso
                  </button>
                  {animal.estado_evaluacion === "En Evaluación" && (
                    <button
                      onClick={() => onApprove(grupo._id, animal._id)}
                      className="flex-1 h-10 rounded-lg bg-green-50 text-primary border border-green-200 text-[13px] font-semibold hover:bg-primary hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} /> Seleccionar Madre
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold text-gray-500">
                    Nota
                  </span>
                  <div className="w-full p-3 bg-gray-50 rounded-lg min-h-17.5 border border-border-agro">
                    <span className="text-[14px] text-gray-600">
                      {animal.nota || "Nota sobre el animal"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
