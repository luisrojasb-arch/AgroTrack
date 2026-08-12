"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import AnimalSearchInput from "./AnimalSearchInput";
import { toast } from "sonner";

const getInitialState = (animal) => {
  if (animal) {
    return {
      codigo: animal.codigo || "",
      nombre: animal.nombre || "",
      sexo: animal.sexo || "Hembra",
      estado: animal.estado || "Vivo",
      raza: animal.raza || "",
      peso: animal.peso || "",
      fecha_nacimiento: animal.fecha_nacimiento
        ? new Date(animal.fecha_nacimiento).toISOString().split("T")[0]
        : "",
      cantidad_pezones: animal.cantidad_pezones || "",
      madre_id: animal.madre_id?._id || "",
      madre_label: animal.madre_id
        ? `${animal.madre_id.codigo} ${animal.madre_id.nombre ? `- ${animal.madre_id.nombre}` : ""}`
        : "",
      padre_id: animal.padre_id?._id || "",
      padre_label: animal.padre_id
        ? `${animal.padre_id.codigo} ${animal.padre_id.nombre ? `- ${animal.padre_id.nombre}` : ""}`
        : "",
      nota: animal.nota || "",
    };
  }
  return {
    codigo: "",
    nombre: "",
    sexo: "Hembra",
    estado: "Vivo",
    raza: "",
    peso: "",
    fecha_nacimiento: "",
    cantidad_pezones: "",
    madre_id: "",
    madre_label: "",
    padre_id: "",
    padre_label: "",
    nota: "",
  };
};

export default function AnimalFormModal({
  isOpen,
  onClose,
  animalToEdit = null,
  onSubmit,
}) {
  const isEditMode = !!animalToEdit;

  const [formData, setFormData] = useState(() => getInitialState(animalToEdit));

  const [prevAnimal, setPrevAnimal] = useState(animalToEdit);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (animalToEdit !== prevAnimal || isOpen !== prevIsOpen) {
    setPrevAnimal(animalToEdit);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData(getInitialState(animalToEdit));
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

    if (!formData.codigo) {
      toast.error("El código es obligatorio.");
      return;
    }

    const dataToSend = { ...formData };
    delete dataToSend.madre_label;
    delete dataToSend.padre_label;
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
        {isEditMode ? "Editar Animal" : "Registrar Animal"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Animal" : "Registro de Animales"}
      description={
        isEditMode
          ? `Editando a ${formData.nombre || formData.codigo}`
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
          <label className="text-[14px] font-medium text-black">Código *</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ej: 1"
            required
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Lola"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Sexo *</label>
          <Select
            opciones={["Hembra", "Macho"]}
            valorSeleccionado={formData.sexo}
            onChange={(val) => handleSelectChange("sexo", val)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Estado *</label>
          <Select
            opciones={["Vivo", "Vendido", "Muerto"]}
            valorSeleccionado={formData.estado}
            onChange={(val) => handleSelectChange("estado", val)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Raza</label>
          <input
            type="text"
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            placeholder="Ej: Yorkshire"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Peso (kg)
          </label>
          <input
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-gray-700"
          />
        </div>

        {formData.sexo === "Hembra" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Cantidad de pezones
            </label>
            <input
              type="number"
              name="cantidad_pezones"
              value={formData.cantidad_pezones}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
        )}

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
            placeholder="Nota sobre el animal"
            rows={3}
            className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
