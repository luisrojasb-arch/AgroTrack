"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

const getInitialState = (item) => {
  const hoy = new Date().toISOString().split("T")[0];

  let formattedFecha = hoy;
  if (item?.fecha_parto && item.fecha_parto !== "-") {
    if (item.fecha_parto.includes("/")) {
      const [dia, mes, anio] = item.fecha_parto.split("/");
      formattedFecha = `${anio}-${mes}-${dia}`;
    } else {
      try {
        formattedFecha = new Date(item.fecha_parto).toISOString().split("T")[0];
      } catch (e) {}
    }
  }

  return {
    fecha_parto: formattedFecha,
    tipo_parto: item?.tipo_parto || item?.tipo || "Natural",
    lechones_vivos: item?.lechones_vivos || item?.vivos || 0,
    lechones_muertos: item?.lechones_muertos || item?.muertos || 0,
    machos: item?.machos || (item?.m_h ? item.m_h.split(" / ")[0] : 0) || 0,
    hembras: item?.hembras || (item?.m_h ? item.m_h.split(" / ")[1] : 0) || 0,
    peso_promedio:
      item?.peso_promedio ||
      (item?.peso_prom ? item.peso_prom.replace("kg", "") : "") ||
      "",
    nota_nacimiento: item?.nota_nacimiento || item?.notas || "",
  };
};

export default function NacimientoFormModal({
  isOpen,
  onClose,
  itemData = null,
  isConfirmMode,
  onSubmit,
}) {
  const [formData, setFormData] = useState(() => getInitialState(itemData));
  const [prevItem, setPrevItem] = useState(itemData);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (itemData !== prevItem || isOpen !== prevIsOpen) {
    setPrevItem(itemData);
    setPrevIsOpen(isOpen);
    if (isOpen) setFormData(getInitialState(itemData));
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
    const vivos = Number(formData.lechones_vivos);
    const muertos = Number(formData.lechones_muertos);
    const m = Number(formData.machos);
    const h = Number(formData.hembras);

    if (vivos + muertos === 0) {
      toast.error("Debe registrar al menos un animal nacido (vivo o muerto).");
      return;
    }

    if (vivos !== m + h) {
      toast.error(
        `Los lechones vivos (${vivos}) deben ser igual a machos (${m}) + hembras (${h})`,
      );
      return;
    }

    const dataToSend = {
      ...formData,
      lechones_vivos: vivos,
      lechones_muertos: muertos,
      machos: m,
      hembras: h,
      peso_promedio: formData.peso_promedio
        ? Number(formData.peso_promedio)
        : null,
    };

    onSubmit(dataToSend, isConfirmMode);
  };

  const madreName = itemData?.nombre || itemData?.madre || "";
  const madreCode = itemData?.codigo || "";
  const headerMadre =
    madreName && madreCode && !madreName.includes(madreCode)
      ? `${madreCode} (${madreName})`
      : madreName || madreCode;

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
        {isConfirmMode ? "Registrar Nacimiento" : "Editar Nacimiento"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isConfirmMode ? "Confirmar Nacimiento" : "Editar Nacimiento"}
      description="Completa la información"
      width="max-w-2xl"
      footer={formFooter}
    >
      <form
        className="flex flex-col gap-4 mt-2 px-6 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="w-full text-center font-bold text-black text-[16px] mb-2">
          {headerMadre}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Fecha de parto *
            </label>
            <input
              type="date"
              name="fecha_parto"
              value={formData.fecha_parto}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Tipo de parto *
            </label>
            <Select
              opciones={["Natural", "Cesarea", "Asistido"]}
              valorSeleccionado={formData.tipo_parto}
              onChange={(val) => handleSelectChange("tipo_parto", val)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Lechones vivos *
            </label>
            <input
              type="number"
              min="0"
              name="lechones_vivos"
              value={formData.lechones_vivos}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Lechones muertos *
            </label>
            <input
              type="number"
              min="0"
              name="lechones_muertos"
              value={formData.lechones_muertos}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Machos *
            </label>
            <input
              type="number"
              min="0"
              name="machos"
              value={formData.machos}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Hembras *
            </label>
            <input
              type="number"
              min="0"
              name="hembras"
              value={formData.hembras}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            Peso Promedio (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            name="peso_promedio"
            value={formData.peso_promedio}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Nota</label>
          <textarea
            name="nota_nacimiento"
            value={formData.nota_nacimiento}
            onChange={handleChange}
            placeholder="Observaciones"
            rows={3}
            className="w-full p-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] resize-none text-black"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
