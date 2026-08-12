"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

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

  const calcularPesoPromedioGrupo = () => {
    if (animales.length === 0) return 0;
    let sumaPesos = 0;
    animales.forEach((a) => {
      sumaPesos +=
        a.historial_pesos?.length > 0
          ? a.historial_pesos[a.historial_pesos.length - 1].peso
          : a.peso_inicial || 0;
    });
    return (sumaPesos / animales.length).toFixed(1);
  };

  const pesoPromedioTotal = calcularPesoPromedioGrupo();

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
      width="max-w-3xl"
      footer={detailsFooter}
    >
      <div className="relative flex flex-col w-full">
        <div className="sticky bg-gradient-card top-0 z-20 pt-2 pb-4 mb-2 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)] px-6">
          <h3 className="text-[18px] font-bold text-center text-black">
            Selección {grupo.codigo_grupo}
          </h3>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-6 mt-2">
          {animales.map((animal) => {
            const pesoActual =
              animal.historial_pesos?.length > 0
                ? animal.historial_pesos[animal.historial_pesos.length - 1].peso
                : animal.peso_inicial || 0;

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
                      {pesoPromedioTotal} kg
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

                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[13px] font-bold text-gray-500">
                    Nota
                  </span>
                  <div className="w-full p-3 bg-gray-50 rounded-lg min-h-17.5 border border-border-agro">
                    <span className="text-[14px] text-gray-600">
                      {animal.nota || "Nota sobre el animal"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4 mt-2 border-t border-gray-100">
                  <Button
                    variant="white"
                    onClick={() => onOpenRegistrarPeso(grupo._id, animal._id)}
                    fullWidth={true}
                    className="w-full"
                  >
                    Registrar Peso
                  </Button>

                  {animal.estado_evaluacion === "En Evaluación" && (
                    <Button
                      variant="green"
                      onClick={() => onApprove(grupo._id, animal._id)}
                      fullWidth={true}
                      className="w-full"
                    >
                      Seleccionar Madre
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
