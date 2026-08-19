"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

const getInitialState = (item) => {
  if (item) {
    // Al editar, el monto original viene como "200 COP", extraemos solo el número
    const montoNum = item.monto_original ? item.monto_original.split(" ")[0] : "";
    
    // Convertimos la fecha de DD/MM/YYYY a YYYY-MM-DD
    let fechaFormat = new Date().toISOString().split("T")[0];
    if (item.fecha && item.fecha !== "-") {
      fechaFormat = item.fecha.split("/").reverse().join("-");
    }

    return {
      tipo_movimiento: item.tipo || "Egreso",
      categoria: item.categoria || "Alimento",
      monto: montoNum,
      fecha_pago: fechaFormat,
      concepto: item.descripcion || "",
      metodo_pago: item.metodo_pago || "Efectivo",
    };
  }

  return {
    tipo_movimiento: "Egreso",
    categoria: "Alimento",
    monto: "",
    fecha_pago: new Date().toISOString().split("T")[0],
    concepto: "",
    metodo_pago: "Efectivo",
  };
};

/**
 * @description Modal de formulario para registrar o editar ingresos/egresos.
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibilidad del modal.
 * @param {Function} props.onClose - Cierra el modal.
 * @param {Object|null} props.itemToEdit - Transacción a editar (null para crear).
 * @param {Function} props.onSubmit - Ejecuta el guardado.
 */

export default function FinanceFormModal({ isOpen, onClose, itemToEdit = null, onSubmit }) {
  const isEditMode = !!itemToEdit;
  const [formData, setFormData] = useState(() => getInitialState(itemToEdit));

  // Resetear el formulario cuando se abre el modal o cambia el ítem a editar
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState(itemToEdit));
    }
  }, [isOpen, itemToEdit]);

  const handleSubmit = () => {
    // Validaciones rápidas en el frontend
    if (!formData.monto || Number(formData.monto) <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    if (!formData.concepto.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }

    // Convertimos el monto a número y enviamos los nombres exactos que pide Mongoose
    const dataToSend = {
      tipo_movimiento: formData.tipo_movimiento,
      categoria: formData.categoria,
      monto: Number(formData.monto),
      fecha_pago: formData.fecha_pago,
      concepto: formData.concepto,
      metodo_pago: formData.metodo_pago,
    };

    onSubmit(dataToSend);
  };

  // Las listas de categorías coinciden exactamente con el Schema
  const categorias = formData.tipo_movimiento === "Egreso"
    ? ["Alimento", "Medicamento", "Vacuna", "Insumos", "Herramientas", "Mantenimiento", "Pago Nómina", "Servicios", "Otro"]
    : ["Venta Animal", "Otro"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Transacción" : "Registrar Transacción"}
      width="max-w-2xl"
      footer={
        <>
          <Button variant="white" onClick={onClose}>Cancelar</Button>
          <Button variant="green" onClick={handleSubmit}>Guardar</Button>
        </>
      }
    >
      <form className="grid grid-cols-2 gap-4 px-6 pb-2 mt-2">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Tipo *</label>
          <Select
            opciones={["Ingreso", "Egreso"]}
            valorSeleccionado={formData.tipo_movimiento}
            onChange={(v) =>
              setFormData({
                ...formData,
                tipo_movimiento: v,
                categoria: v === "Ingreso" ? "Venta Animal" : "Alimento",
              })
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Categoría *</label>
          <Select
            opciones={categorias}
            valorSeleccionado={formData.categoria}
            onChange={(v) => setFormData({ ...formData, categoria: v })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Monto ($) *</label>
          <input
            type="number"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            className="h-10 border border-border-agro rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            placeholder="Ej: 10000"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Fecha *</label>
          <input
            type="date"
            value={formData.fecha_pago}
            onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
            className="h-10 border border-border-agro rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-gray-700"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[14px] font-medium text-black">Método de Pago *</label>
          <Select
            opciones={["Efectivo", "Transferencia", "Otro"]}
            valorSeleccionado={formData.metodo_pago}
            onChange={(v) => setFormData({ ...formData, metodo_pago: v })}
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[14px] font-medium text-black">Descripción / Concepto *</label>
          <textarea
            value={formData.concepto}
            onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
            rows={3}
            className="w-full p-3 border border-border-agro rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"
            placeholder="Escribe el detalle de la transacción..."
          ></textarea>
        </div>

      </form>
    </Modal>
  );
}