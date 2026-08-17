"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

const CAUSAS_MUERTE = [
  "Enfermedad",
  "Pelea",
  "Sacrificio",
  "Accidente",
  "Desconocida",
];

const METODOS_PAGO = ["Efectivo", "Transferencia", "Punto de Venta", "Otro"];

const getInitialState = () => ({
  situacion: "Vendido",
  fecha: new Date().toISOString().split("T")[0],
  monto: "",
  metodo_pago: "Efectivo",
  causa_muerte: "Enfermedad",
  nota: "",
});

export default function AnimalSituationModal({
  isOpen,
  onClose,
  animal,
  onSubmit,
}) {
  const [formData, setFormData] = useState(getInitialState);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevAnimal, setPrevAnimal] = useState(animal);

  if (isOpen !== prevIsOpen || animal !== prevAnimal) {
    setPrevIsOpen(isOpen);
    setPrevAnimal(animal);
    if (isOpen) {
      setFormData(getInitialState());
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

    if (!formData.fecha) {
      return toast.error("La fecha es obligatoria.");
    }

    if (
      formData.situacion === "Vendido" &&
      (!formData.monto || formData.monto <= 0)
    ) {
      return toast.error("Ingresa un monto válido para la venta.");
    }

    const payload = {
      animal_id: animal?._id,
      estado: formData.situacion,
      fecha: formData.fecha,
      nota: formData.nota,
    };

    if (formData.situacion === "Vendido") {
      payload.finanza = {
        concepto: `Venta de animal - Cód: ${animal?.codigo || "N/A"}`,
        monto: Number(formData.monto),
        tipo_movimiento: "Ingreso",
        categoria: "Venta de Animales",
        metodo_pago: formData.metodo_pago,
        fecha_pago: formData.fecha,
      };
    } else if (formData.situacion === "Muerto") {
      payload.causa_muerte = formData.causa_muerte;
    }

    onSubmit(payload);
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
        Confirmar Registro
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Situación del Animal"
      description={`Actualizando estado de: ${animal?.codigo || ""} ${
        animal?.nombre ? `- ${animal?.nombre}` : ""
      }`}
      width="max-w-2xl"
      footer={formFooter}
    >
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 px-6 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[14px] font-medium text-black">
            Tipo de Situación *
          </label>
          <Select
            opciones={["Vendido", "Muerto"]}
            valorSeleccionado={formData.situacion}
            onChange={(val) => handleSelectChange("situacion", val)}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[14px] font-medium text-black">Fecha *</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-gray-700"
            required
          />
        </div>

        {formData.situacion === "Vendido" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-black">
                Monto ($) *
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="0"
                min="0.1"
                step="0.1"
                className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-black">
                Método de Pago *
              </label>
              <Select
                opciones={METODOS_PAGO}
                valorSeleccionado={formData.metodo_pago}
                onChange={(val) => handleSelectChange("metodo_pago", val)}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[14px] font-medium text-black">
                Categoría Financiera
              </label>
              <input
                type="text"
                value="Venta de Animales"
                disabled
                className="w-full h-10 px-3 rounded-lg border border-border-agro bg-gray-50 text-gray-500 text-[14px] cursor-not-allowed"
              />
            </div>
          </>
        )}

        {formData.situacion === "Muerto" && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[14px] font-medium text-black">
              Causa de Muerte *
            </label>
            <Select
              opciones={CAUSAS_MUERTE}
              valorSeleccionado={formData.causa_muerte}
              onChange={(val) => handleSelectChange("causa_muerte", val)}
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[14px] font-medium text-black">
            Detalles / Nota
          </label>
          <textarea
            name="nota"
            value={formData.nota}
            onChange={handleChange}
            placeholder={
              formData.situacion === "Vendido"
                ? "Ej: Vendido a Matadero El Rosal"
                : "Ej: Se encontró sin signos vitales en la mañana"
            }
            rows={3}
            className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
