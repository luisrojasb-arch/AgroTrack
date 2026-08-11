"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
    <span className="text-[13px] font-semibold text-gray-500">{title}</span>
    <span className="text-[15px] text-black font-medium">{value || "-"}</span>
  </div>
);

export default function LoteDetailsModal({ isOpen, onClose, data }) {
  if (!data || !data.datos_basicos) return null;

  const lote = data.datos_basicos;
  const cronograma = data.cronograma_sanitario || [];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calcularDia = (fechaTarea, fechaBase) => {
    if (!fechaTarea || !fechaBase) return "-";
    const diffTime = Math.abs(new Date(fechaTarea) - new Date(fechaBase));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const detailsFooter = (
    <Button variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cerrar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Lote"
      description="Información completa del grupo"
      width="max-w-3xl"
      footer={detailsFooter}
    >
      <div className="flex flex-col gap-6 mt-2 px-6 pb-2">
        <h3 className="text-[18px] font-bold text-center text-black">
          Lote {lote.codigo_lote}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard title="Cantidad total" value={lote.cantidad_total} />
          <InfoCard title="Machos" value={lote.cantidad_machos} />
          <InfoCard title="Hembras" value={lote.cantidad_hembras} />
          <InfoCard
            title="Peso prom."
            value={lote.peso_promedio ? `${lote.peso_promedio} kg` : "-"}
          />
          <InfoCard title="Madre" value={lote.madre_id?.codigo || "0"} />
          <InfoCard title="Padre" value={lote.padre_id?.codigo || "0"} />
          <InfoCard
            title="Fecha creación"
            value={formatDate(lote.createdAt || lote.fecha)}
          />
          <InfoCard title="Raza mixta" value="Mixta" />{" "}
        </div>

        <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
          <span className="text-[13px] font-semibold text-gray-500">Notas</span>
          <span className="text-[15px] text-black">
            {lote.nota || "Sin notas adicionales."}
          </span>
        </div>

        {cronograma.length > 0 && (
          <div className="flex flex-col gap-4 mt-2">
            <h4 className="text-[16px] font-bold text-black">
              Cronograma sanitario
            </h4>

            <div className="w-full overflow-x-auto border border-border-agro rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <table className="w-full text-left border-collapse min-w-162.5">
                <thead>
                  <tr className="border-b border-border-agro bg-gray-50/50">
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                      DIA
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                      MANEJO
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                      PRODUCTO
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                      FECHA
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                      ESTADO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cronograma.map((tarea) => (
                    <tr
                      key={tarea._id}
                      className="border-b border-border-agro last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-[13px] text-black">
                        {calcularDia(tarea.fecha, lote.fecha || lote.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-[13px] text-black">
                        {tarea.nota || tarea.tipo}
                      </td>
                      <td className="py-3 px-4 text-[13px] text-black">
                        {tarea.producto || "-"}
                      </td>
                      <td className="py-3 px-4 text-[13px] text-black">
                        {formatDate(tarea.fecha)}
                      </td>
                      <td className="py-3 px-4 text-[13px] text-black">
                        {tarea.estado || "Pendiente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
