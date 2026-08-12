"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AnimalSearchInput from "../modalsAnimals/AnimalSearchInput";
import { toast } from "sonner";

const getInitialState = (lote) => {
  if (lote) {
    return {
      codigo_lote: lote.codigo_lote || "",
      fecha: lote.fecha
        ? new Date(lote.fecha).toISOString().split("T")[0]
        : lote.createdAt
          ? new Date(lote.createdAt).toISOString().split("T")[0]
          : "",
      cantidad_total: lote.cantidad_total || "",
      peso_promedio: lote.peso_promedio || "",
      cantidad_machos: lote.cantidad_machos || "",
      cantidad_hembras: lote.cantidad_hembras || "",

      madre_id: lote.madre_id?._id || "",
      madre_label: lote.madre_id
        ? `${lote.madre_id.codigo} ${lote.madre_id.nombre ? `- ${lote.madre_id.nombre}` : ""}`
        : "",
      padre_id: lote.padre_id?._id || "",
      padre_label: lote.padre_id
        ? `${lote.padre_id.codigo} ${lote.padre_id.nombre ? `- ${lote.padre_id.nombre}` : ""}`
        : "",
      nota: lote.nota || "",
    };
  }
  return {
    codigo_lote: "",
    fecha: "",
    cantidad_total: "",
    peso_promedio: "",
    cantidad_machos: "",
    cantidad_hembras: "",
    madre_id: "",
    madre_label: "",
    padre_id: "",
    padre_label: "",
    nota: "",
  };
};

export default function LoteFormModal({
  isOpen,
  onClose,
  loteToEdit = null,
  onSubmit,
}) {
  const isEditMode = !!loteToEdit;

  const [formData, setFormData] = useState(() => getInitialState(loteToEdit));
  const [prevLote, setPrevLote] = useState(loteToEdit);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (loteToEdit !== prevLote || isOpen !== prevIsOpen) {
    setPrevLote(loteToEdit);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData(getInitialState(loteToEdit));
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.codigo_lote) {
      toast.error("El número de lote es obligatorio.");
      return;
    }

    const dataToSend = { ...formData };

    delete dataToSend.madre_label;
    delete dataToSend.padre_label;

    dataToSend.cantidad_total = Number(dataToSend.cantidad_total) || 0;
    dataToSend.peso_promedio = Number(dataToSend.peso_promedio) || 0;
    dataToSend.cantidad_machos = Number(dataToSend.cantidad_machos) || 0;
    dataToSend.cantidad_hembras = Number(dataToSend.cantidad_hembras) || 0;

    if (!dataToSend.madre_id) dataToSend.madre_id = null;
    if (!dataToSend.padre_id) dataToSend.padre_id = null;

    onSubmit(dataToSend);
  };

  const formFooter = (
    <>
      <Button
        variant="white"
        onClick={onClose}
        type="button"
        className="w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        variant="green"
        onClick={handleSubmit}
        type="button"
        className="w-full sm:w-auto"
      >
        {isEditMode ? "Editar Lote" : "Registrar Lote"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Lote" : "Registro de Lotes"}
      description={
        isEditMode
          ? `Editando a ${formData.codigo_lote}`
          : "Completa los datos requeridos"
      }
      width="max-w-3xl"
      footer={formFooter}
    >
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 px-6 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Número de lote *
          </label>
          <input
            type="text"
            name="codigo_lote"
            value={formData.codigo_lote}
            onChange={handleChange}
            placeholder="Ej: Lot-1"
            required
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-gray-700"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Cantidad total
          </label>
          <input
            type="number"
            name="cantidad_total"
            value={formData.cantidad_total}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Peso promedio (kg)
          </label>
          <input
            type="number"
            name="peso_promedio"
            value={formData.peso_promedio}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Machos</label>
          <input
            type="number"
            name="cantidad_machos"
            value={formData.cantidad_machos}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Hembras</label>
          <input
            type="number"
            name="cantidad_hembras"
            value={formData.cantidad_hembras}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Madre</label>
          <AnimalSearchInput
            sexoFilter="Hembra"
            valorInicial={{
              id: formData.madre_id,
              label: formData.madre_label,
            }}
            onSelect={(animal) => {
              if (animal) {
                handleSelectChange("madre_id", animal._id);
                handleSelectChange(
                  "madre_label",
                  `${animal.codigo} - ${animal.nombre || ""}`,
                );
              } else {
                handleSelectChange("madre_id", "");
                handleSelectChange("madre_label", "");
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Padre</label>
          <AnimalSearchInput
            sexoFilter="Macho"
            valorInicial={{
              id: formData.padre_id,
              label: formData.padre_label,
            }}
            onSelect={(animal) => {
              if (animal) {
                handleSelectChange("padre_id", animal._id);
                handleSelectChange(
                  "padre_label",
                  `${animal.codigo} - ${animal.nombre || ""}`,
                );
              } else {
                handleSelectChange("padre_id", "");
                handleSelectChange("padre_label", "");
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[14px] font-medium text-black">Nota</label>
          <textarea
            name="nota"
            value={formData.nota}
            onChange={handleChange}
            placeholder="Nota sobre el lote"
            rows={3}
            className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
