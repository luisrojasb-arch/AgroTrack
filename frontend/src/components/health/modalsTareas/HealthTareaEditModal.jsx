"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function HealthTareaEditModal({ isOpen, onClose, onSubmit, tareaToEdit }) {
  const [formData, setFormData] = useState({
    tipo: "Vacuna",
    producto: "",
    dosis: "",
    fecha: "",
    proxima_dosis: "",
    nota: "",
  });

  const formatInputDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (tareaToEdit && isOpen) {
      setFormData({
        tipo: tareaToEdit.tipo || "Vacuna",
        producto: tareaToEdit.producto || "",
        dosis: tareaToEdit.dosis || "",
        fecha: formatInputDate(tareaToEdit.fecha),
        proxima_dosis: formatInputDate(tareaToEdit.proxima_dosis),
        nota: tareaToEdit.nota || "",
      });
    }
  }, [tareaToEdit, isOpen]);

  if (!tareaToEdit) return null;

  const isAnimal = !!tareaToEdit.animal_id;
  const labelEntidad = isAnimal ? "Animal *" : "Lote *";
  const valorEntidad = isAnimal 
    ? `${tareaToEdit.animal_id.codigo} ${tareaToEdit.animal_id.nombre ? `- ${tareaToEdit.animal_id.nombre}` : ""}`
    : tareaToEdit.lote_id?.codigo_lote;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      dosis: formData.dosis ? Number(formData.dosis) : null,
      proxima_dosis: formData.proxima_dosis || null,
    };
    onSubmit(tareaToEdit._id, dataToSend);
  };

  const formFooter = (
    <>
      <Button type="button" variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button type="submit" variant="green" form="edit-health-form" className="w-full sm:w-auto">
        Editar Salud
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Evento de Salud"
      description="Completa la información médica"
      footer={formFooter}
      width="max-w-2xl"
    >
      <form id="edit-health-form" onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">{labelEntidad}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              disabled
              value={valorEntidad}
              className="w-full h-10.5 pl-9 pr-3 border border-transparent rounded-lg text-sm text-black bg-[#E8F3EB] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Tipo *</label>
          <select name="tipo" required value={formData.tipo} onChange={handleChange} className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white">
            <option value="Vacuna">Vacuna</option>
            <option value="Desparasitación">Desparasitación</option>
            <option value="Descolmille">Descolmille</option>
            <option value="Castración">Castración</option>
            <option value="Cirugía">Cirugía</option>
            <option value="Revisión">Revisión</option>
            <option value="Tratamiento">Tratamiento</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Producto *</label>
            <input type="text" name="producto" required value={formData.producto} onChange={handleChange} className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Dosis (ml) *</label>
            <input type="number" name="dosis" required min="0" step="0.1" value={formData.dosis} onChange={handleChange} className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Fecha *</label>
            <input type="date" name="fecha" required value={formData.fecha} onChange={handleChange} className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Proxima dosis (Opcional)</label>
            <input type="date" name="proxima_dosis" value={formData.proxima_dosis} onChange={handleChange} className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Nota</label>
          <textarea name="nota" rows={3} value={formData.nota} onChange={handleChange} className="w-full p-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"></textarea>
        </div>
      </form>
    </Modal>
  );
}