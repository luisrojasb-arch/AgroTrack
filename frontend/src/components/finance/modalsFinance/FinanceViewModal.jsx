"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const InfoCard = ({ title, value, customValueClass }) => (
  <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
    <span className="text-[13px] font-semibold text-gray-500">{title}</span>
    <span
      className={`text-[15px] font-medium ${customValueClass || "text-black"}`}
    >
      {value || "-"}
    </span>
  </div>
);

export default function FinanceViewModal({ isOpen, onClose, transaction }) {
  if (!transaction) return null;

  const detailsFooter = (
    <Button variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cerrar
    </Button>
  );

  const tipoColor =
    transaction.tipo === "Egreso" ? "text-red-500" : "text-green-600";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Transacción"
      description="Información completa del movimiento financiero"
      width="max-w-3xl"
      footer={detailsFooter}
    >
      <div className="flex flex-col gap-6 mt-2 px-6 pb-2">
        <h3 className="text-[18px] font-bold text-center text-black">
          Transacción: {transaction.categoria}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard title="Fecha" value={transaction.fecha} />
          <InfoCard
            title="Tipo"
            value={transaction.tipo}
            customValueClass={tipoColor}
          />
          <InfoCard title="Categoría" value={transaction.categoria} />
          <InfoCard
            title="Monto"
            value={transaction.monto}
            customValueClass={tipoColor}
          />
          <InfoCard
            title="Monto Original"
            value={transaction.monto_original}
          />
          <InfoCard
            title="Método de Pago"
            value={transaction.metodo_pago}
          />
        </div>

        <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
          <span className="text-[13px] font-semibold text-gray-500">
            Descripción / Concepto
          </span>
          <span className="text-[15px] text-black">
            {transaction.descripcion || "Sin descripción adicional."}
          </span>
        </div>
      </div>
    </Modal>
  );
}