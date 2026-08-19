"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

/**
 * @description Modal de confirmación para eliminar una transacción financiera.
 * @param {Object} props - Propiedades del modal.
 */

export default function FinanceDeleteModal({
  isOpen,
  onClose,
  transaction,
  onConfirm,
  isDeleting,
}) {
  const transaccionInfo = transaction
    ? `${transaction.categoria} por ${transaction.monto}`
    : "esta transacción";

  const modalFooter = (
    <>
      <Button
        variant="white"
        onClick={onClose}
        disabled={isDeleting}
        className="w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        variant="red"
        onClick={() => onConfirm(transaction?.id)}
        disabled={isDeleting}
        className="w-full sm:w-auto"
      >
        {isDeleting ? "Eliminando..." : "Eliminar Transacción"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      footer={modalFooter}
    >
      <div className="flex flex-col items-center justify-center text-center px-6 pb-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="text-[#F04438] w-7 h-7" strokeWidth={2} />
        </div>

        <h3 className="text-[20px] font-bold text-black mb-2 leading-tight">
          ¿Seguro Que Quiere Eliminar la Transacción?
        </h3>

        <p className="text-[14px] text-gray-500">
          Estás a punto de eliminar la transacción de{" "}
          <span className="font-bold text-black">{transaccionInfo}</span>. Esta
          acción no se puede deshacer y afectará los balances.
        </p>
      </div>
    </Modal>
  );
}