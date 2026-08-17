"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

const getInitialState = (item) => {
  if (item) {
    let parsedDate = "";
    if (item.fecha_vencimiento) {
      try {
        parsedDate = new Date(item.fecha_vencimiento).toISOString().split("T")[0];
      } catch (error) {
        parsedDate = ""; // Evita que la app colapse si la fecha es inválida
      }
    }

    return {
      codigo: item.codigo || "",
      nombre: item.nombre || "",
      categoria: item.categoria || "Alimento",
      unidad: item.unidad || "kg",
      // Usamos ?? en lugar de || para que no borre el valor si es un "0"
      cantidad: item.cantidad ?? "",
      stock_minimo: item.stock_minimo ?? "",
      costo_unitario: item.costo_unitario ?? "",
      fecha_vencimiento: parsedDate,
      nota: item.nota || "",
    };
  }
  return {
    codigo: "",
    nombre: "",
    categoria: "Alimento",
    unidad: "kg",
    cantidad: "",
    stock_minimo: "",
    costo_unitario: "",
    fecha_vencimiento: "",
    nota: "",
  };
};

export default function InventoryFormModal({ isOpen, onClose, itemToEdit = null, onSubmit }) {
  const isEditMode = !!itemToEdit;
  const [formData, setFormData] = useState(() => getInitialState(itemToEdit));

  // CORRECCIÓN: Uso de useEffect para sincronizar el modal en lugar de mutar durante el renderizado
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState(itemToEdit));
    }
  }, [isOpen, itemToEdit]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  // CORRECCIÓN: Bloquea caracteres especiales que rompen los inputs tipo número ('e', '-', '+')
  const blockInvalidChar = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.codigo) {
      toast.error("El código es obligatorio.");
      return;
    }
    onSubmit(formData);
  };

  const formFooter = (
    <>
      <Button variant="white" onClick={onClose} type="button" className="w-full sm:w-auto">
        Cancelar
      </Button>
      {/* CORRECCIÓN: Enlazamos el botón al formulario mediante el atributo 'form' para habilitar la validación nativa */}
      <Button variant="green" type="submit" form="inventory-form" className="w-full sm:w-auto">
        {isEditMode ? "Editar Artículo" : "Registrar Artículo"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Artículo" : "Registro de Artículo"}
      description={isEditMode ? `Editando ${formData.nombre || formData.codigo}` : "Completa los datos requeridos"}
      width="max-w-3xl"
      footer={formFooter}
    >
      {/* CORRECCIÓN: Se agrega id="inventory-form" para conectarlo con el botón de submit del footer */}
      <form id="inventory-form" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 px-6 pb-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Código *</label>
          <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Ej: 1" required className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Alimento engorde" className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Categoría *</label>
          {/* CORRECCIÓN: Uso de la función handleSelectChange */}
          <Select opciones={["Alimento", "Medicamento", "Herramienta", "Insumo"]} valorSeleccionado={formData.categoria} onChange={(v) => handleSelectChange("categoria", v)} />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Unidad</label>
          <Select opciones={["Unidad", "kg", "g", "l", "ml", "Saco", "Rollo", "Otro"]} valorSeleccionado={formData.unidad} onChange={(v) => handleSelectChange("unidad", v)} />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Cantidad *</label>
          {/* CORRECCIÓN: Se agregó step="any" y onKeyDown */}
          <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} onKeyDown={blockInvalidChar} placeholder="0" min="0" step="any" required className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Stock mínimo</label>
          {/* CORRECCIÓN: Se agregó step="any" y onKeyDown */}
          <input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} onKeyDown={blockInvalidChar} placeholder="0" min="0" step="any" className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Costo unitario ($)</label>
          {/* CORRECCIÓN: Se agregó onKeyDown */}
          <input type="number" name="costo_unitario" value={formData.costo_unitario} onChange={handleChange} onKeyDown={blockInvalidChar} placeholder="0" min="0" step="0.01" className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Fecha de vencimiento</label>
          <input type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-gray-700" />
        </div>
        
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[14px] font-medium text-black">Nota</label>
          <textarea name="nota" value={formData.nota} onChange={handleChange} placeholder="Nota sobre el artículo" rows={3} className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"></textarea>
        </div>
      </form>
    </Modal>
  );
}