"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

/**
 * @description Modal de confirmación para suspender o eliminar usuarios.
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibilidad.
 * @param {Function} props.onClose - Cierre de modal.
 * @param {Object} props.user - Usuario seleccionado.
 * @param {Function} props.onConfirm - Procesador de eliminación.
 */

export default function DeleteUserModal({ isOpen, onClose, user, onConfirm }) {
  const nombreAEnseñar = user?.nombre || "este miembro";

  const deleteFooter = (
    <>
      <Button 
        variant="white" 
        onClick={onClose} 
        className="w-full sm:w-auto"
        aria-label="Cancelar la eliminación del miembro"
      >
        Cancelar
      </Button>
      <Button
        variant="red"
        onClick={() => onConfirm(user?.id)}
        className="w-full sm:w-auto"
        aria-label="Confirmar y eliminar el miembro"
      >
        Eliminar Miembro
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      footer={deleteFooter}
      aria-labelledby="modal-user-delete-title"
      aria-describedby="modal-user-delete-description"
    >
      <div className="flex flex-col items-center justify-center text-center px-6 pb-2">
        <div 
          className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4"
          aria-hidden="true"
        >
          <AlertTriangle className="text-[#F04438] w-7 h-7" strokeWidth={2} />
        </div>
        <h3 
          id="modal-user-delete-title"
          className="text-[20px] font-bold text-black mb-2 leading-tight"
        >
          ¿Seguro Que Quiere Eliminar el Miembro?
        </h3>
        <p 
          id="modal-user-delete-description"
          className="text-[14px] text-gray-500"
        >
          Estás a punto de eliminar el Miembro{" "}
          <span className="font-bold text-black">{nombreAEnseñar}</span>. Esta
          acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
}