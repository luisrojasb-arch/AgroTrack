"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
    <span className="text-[13px] font-semibold text-gray-500">{title}</span>
    <span className="text-[15px] text-black font-medium">{value || "-"}</span>
  </div>
);

export default function InventoryDetailsModal({ isOpen, onClose, data }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
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
      title="Detalles del Artículo"
      description="Información técnica y existencias"
      width="max-w-3xl"
      footer={detailsFooter}
    >
      <div className="flex flex-col gap-6 mt-2 px-6 pb-2">
        <h3 className="text-[18px] font-bold text-center text-black">
          Código {data.codigo} {data.nombre ? `(${data.nombre})` : ""}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard title="Categoría" value={data.categoria} />
          <InfoCard title="Unidad" value={data.unidad} />
          <InfoCard title="Cantidad Actual" value={data.cantidad} />
          <InfoCard title="Stock Mínimo" value={data.stock_minimo} />
          <InfoCard title="Costo Unitario" value={data.costo_unitario ? `$${data.costo_unitario}` : "-"} />
          <InfoCard title="Fecha Vencimiento" value={formatDate(data.fecha_vencimiento)} />
        </div>

        <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
          <span className="text-[13px] font-semibold text-gray-500">Notas</span>
          <span className="text-[15px] text-black">
            {data.nota || "Sin notas adicionales."}
          </span>
        </div>
      </div>
    </Modal>
  );
}