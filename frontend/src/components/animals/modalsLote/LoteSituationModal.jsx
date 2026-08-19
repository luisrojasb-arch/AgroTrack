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
  cantidad_machos: "",
  cantidad_hembras: "",
  monto: "",
  metodo_pago: "Efectivo",
  causa_muerte: "Enfermedad",
  nota: "",
});

/**
 * @description Modal para cambiar la situación de un lote.
 * @param {Object} props - Propiedades del modal.
 */

export default function LoteSituationModal({
  isOpen,
  onClose,
  lote,
  onSubmit,
}) {
  const [formData, setFormData] = useState(getInitialState);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevLote, setPrevLote] = useState(lote);

  if (isOpen !== prevIsOpen || lote !== prevLote) {
    setPrevIsOpen(isOpen);
    setPrevLote(lote);
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

    const machos = Number(formData.cantidad_machos) || 0;
    const hembras = Number(formData.cantidad_hembras) || 0;

    if (machos <= 0 && hembras <= 0) {
      return toast.error("Ingresa al menos 1 macho o hembra.");
    }

    if (lote && machos > (lote.cantidad_machos || 0)) {
      return toast.error(
        `No hay suficientes machos (Máx: ${lote.cantidad_machos})`,
      );
    }

    if (lote && hembras > (lote.cantidad_hembras || 0)) {
      return toast.error(
        `No hay suficientes hembras (Máx: ${lote.cantidad_hembras})`,
      );
    }

    if (
      formData.situacion === "Vendido" &&
      (!formData.monto || formData.monto <= 0)
    ) {
      return toast.error("Ingresa un monto válido para la venta.");
    }

    const payload = {
      lote_id: lote?._id,
      estado: formData.situacion,
      fecha: formData.fecha,
      cantidad_machos: machos,
      cantidad_hembras: hembras,
      nota: formData.nota,
    };

    if (formData.situacion === "Vendido") {
      payload.finanza = {
        concepto: `Venta de lote - Cód: ${lote?.codigo_lote || "N/A"} (${machos}M, ${hembras}H)`,
        monto: Number(formData.monto),
        tipo_movimiento: "Ingreso",
        categoria: "Venta Animal",
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
      title="Registrar Situación del Lote"
      description={`Actualizando cantidades de: ${lote?.codigo_lote || ""}`}
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

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Machos ({lote?.cantidad_machos || 0} disp.)
          </label>
          <input
            type="number"
            name="cantidad_machos"
            value={formData.cantidad_machos}
            onChange={handleChange}
            placeholder="0"
            min="0"
            max={lote?.cantidad_machos || 0}
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Hembras ({lote?.cantidad_hembras || 0} disp.)
          </label>
          <input
            type="number"
            name="cantidad_hembras"
            value={formData.cantidad_hembras}
            onChange={handleChange}
            placeholder="0"
            min="0"
            max={lote?.cantidad_hembras || 0}
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        {formData.situacion === "Vendido" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-black">
                Monto Total ($) *
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
            placeholder="Detalles adicionales..."
            rows={3}
            className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
