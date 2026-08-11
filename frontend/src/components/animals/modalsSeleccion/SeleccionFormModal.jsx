"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Trash2 } from "lucide-react";
import LoteSearchInput from "./LoteSearchInput";

const emptyForm = {
  lote_origen_id: "",
  lote_label: "",
  codigo: "",
  nombre: "",
  raza: "",
  peso: "",
  fecha_nacimiento: "",
  cantidad_pezones: "",
  patas_delanteras: "Buenas",
  patas_traseras: "Buenas",
};

export default function SeleccionFormModal({
  isOpen,
  onClose,
  seleccionToEdit = null,
  onSubmit,
}) {
  const isEditMode = !!seleccionToEdit;
  const [animalesList, setAnimalesList] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [prevSeleccion, setPrevSeleccion] = useState(seleccionToEdit);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (seleccionToEdit !== prevSeleccion || isOpen !== prevIsOpen) {
    setPrevSeleccion(seleccionToEdit);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (seleccionToEdit) {
        const animalesMapeados = (seleccionToEdit.animales || []).map((a) => ({
          ...emptyForm,
          ...a,
          peso:
            a.peso_inicial ||
            (a.historial_pesos?.length > 0
              ? a.historial_pesos[a.historial_pesos.length - 1].peso
              : ""),
          fecha_nacimiento: a.fecha_nacimiento
            ? new Date(a.fecha_nacimiento).toISOString().split("T")[0]
            : "",
        }));
        setAnimalesList(animalesMapeados);
        setFormData({
          ...emptyForm,
          lote_origen_id: seleccionToEdit.lote_origen_id?._id || "",
          lote_label: seleccionToEdit.lote_origen_id?.codigo_lote || "",
        });
      } else {
        setAnimalesList([]);
        setFormData(emptyForm);
      }
      setEditingIndex(null);
    }
  }

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleAddOrUpdateToList = () => {
    if (!formData.codigo || !formData.lote_origen_id) {
      alert("El código y el lote son obligatorios para añadir a la lista.");
      return;
    }

    if (editingIndex !== null) {
      const newList = [...animalesList];
      newList[editingIndex] = formData;
      setAnimalesList(newList);
      setEditingIndex(null);
    } else {
      setAnimalesList([...animalesList, formData]);
    }

    setFormData({
      ...emptyForm,
      lote_origen_id: formData.lote_origen_id,
      lote_label: formData.lote_label,
    });
  };

  const handleLoadToEdit = (index) => {
    setFormData({ ...emptyForm, ...animalesList[index] });
    setEditingIndex(index);
  };

  const handleDeleteFromList = (index) => {
    setAnimalesList(animalesList.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setFormData({
        ...emptyForm,
        lote_origen_id: formData.lote_origen_id,
        lote_label: formData.lote_label,
      });
      setEditingIndex(null);
    }
  };

  const handleSubmitGlobal = () => {
    if (animalesList.length === 0) {
      alert("Debe agregar al menos un animal a la lista.");
      return;
    }

    const payload = {
      lote_origen_id: animalesList[0].lote_origen_id,
      animales: animalesList,
    };

    onSubmit(payload, isEditMode);
  };

  const formFooter = (
    <>
      <Button variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button
        variant="green"
        onClick={handleSubmitGlobal}
        className="w-full sm:w-auto"
      >
        {isEditMode ? "Guardar Cambios" : "Registrar Selección"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Selección" : "Registro de Selección"}
      description="Completa los datos requeridos"
      width="max-w-3xl"
      footer={formFooter}
    >
      <div className="flex flex-col gap-4 mt-2 px-6 pb-2">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-black">
            Seleccione Lote *
          </label>
          <LoteSearchInput
            valorInicial={{
              id: formData.lote_origen_id,
              label: formData.lote_label,
            }}
            onSelect={(lote) => {
              handleSelectChange("lote_origen_id", lote?._id || "");
              handleSelectChange("lote_label", lote?.codigo_lote || "");
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo || ""}
              onChange={handleChange}
              placeholder="Ej: 1"
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              placeholder="Ej: Manuela"
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">Raza</label>
            <input
              type="text"
              name="raza"
              value={formData.raza || ""}
              onChange={handleChange}
              placeholder="Ej: Landrace"
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Peso (kg)
            </label>
            <input
              type="number"
              name="peso"
              value={formData.peso || ""}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento || ""}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-gray-700"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Cantidad de pezones
            </label>
            <input
              type="number"
              name="cantidad_pezones"
              value={formData.cantidad_pezones || ""}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Patas delanteras *
            </label>
            <Select
              opciones={["Buenas", "Malas"]}
              valorSeleccionado={formData.patas_delanteras || "Buenas"}
              onChange={(val) => handleSelectChange("patas_delanteras", val)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Patas traseras *
            </label>
            <Select
              opciones={["Buenas", "Malas"]}
              valorSeleccionado={formData.patas_traseras || "Buenas"}
              onChange={(val) => handleSelectChange("patas_traseras", val)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button
            variant="green"
            onClick={handleAddOrUpdateToList}
            type="button"
          >
            {editingIndex !== null ? "Actualizar Tarjeta" : "Registrar"}
          </Button>
        </div>

        {animalesList.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border-agro">
            {animalesList.map((animal, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 border rounded-xl bg-white transition-colors ${editingIndex === idx ? "border-primary ring-1 ring-primary/20" : "border-border-agro"}`}
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-500">
                    Animal Registrado
                  </span>
                  <span className="text-[16px] text-black font-medium">
                    Código: {animal.codigo}{" "}
                    {animal.nombre ? `(${animal.nombre})` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLoadToEdit(idx)}
                    className="text-[14px] font-semibold text-gray-700 hover:text-black border border-border-agro rounded-lg px-4 py-1.5 transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteFromList(idx)}
                    className="text-[#F04438] hover:bg-red-50 p-2 rounded-lg border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
