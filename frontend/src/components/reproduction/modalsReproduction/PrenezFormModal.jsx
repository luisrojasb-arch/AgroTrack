"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import AnimalSearchInput from "@/components/animals/modalsAnimals/AnimalSearchInput";
import { toast } from "sonner";

const getInitialState = (item) => {
  const hoy = new Date().toISOString().split("T")[0];

  let formattedFecha = hoy;
  if (item?.fecha_servicio && item.fecha_servicio !== "-") {
    if (item.fecha_servicio.includes("/")) {
      const [dia, mes, anio] = item.fecha_servicio.split("/");
      formattedFecha = `${anio}-${mes}-${dia}`;
    } else {
      try {
        formattedFecha = new Date(item.fecha_servicio)
          .toISOString()
          .split("T")[0];
      } catch (e) {
        formattedFecha = hoy;
      }
    }
  }

  return {
    fecha_servicio: formattedFecha,
    padrote_id: item?.padrote_id?._id || item?.padrote_id || "",
    padrote_label: item?.padrote_id?.codigo
      ? `${item.padrote_id.codigo} - ${item.padrote_id.nombre || ""}`
      : "",
    metodo_deteccion_prenez:
      item?.metodo_deteccion_prenez || item?.metodo_deteccion || "Observacion",
    nota_prenez: item?.nota_prenez || item?.notas || "",
  };
};

export default function PrenezFormModal({
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

  const fechaHoy = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fecha_servicio) {
      toast.error("La fecha de servicio es obligatoria.");
      return;
    }

    if (formData.fecha_servicio > fechaHoy) {
      toast.error("La fecha de servicio no puede ser futura.");
      return;
    }

    const dataToSend = { ...formData };
    delete dataToSend.padrote_label;
    if (!dataToSend.padrote_id) dataToSend.padrote_id = null;
    onSubmit(dataToSend, isConfirmMode);
  };

  const fechaPartoCalculada = formData.fecha_servicio
    ? new Date(
        new Date(formData.fecha_servicio + "T00:00:00").getTime() +
          114 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("es-ES")
    : "dd/mm/aaaa";

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
        {isConfirmMode ? "Registrar Preñez" : "Editar Preñez"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isConfirmMode ? "Confirmar Preñez" : "Editar Preñez"}
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
              Fecha de servicio / monta *
            </label>
            <input
              type="date"
              name="fecha_servicio"
              value={formData.fecha_servicio}
              onChange={handleChange}
              max={fechaHoy}
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Fecha probable de parto (114 días)
            </label>
            <input
              type="text"
              readOnly
              value={fechaPartoCalculada}
              className="w-full h-10 px-3 rounded-lg border border-border-agro bg-primary-transparent text-primary font-bold focus:outline-none text-[14px] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Padrote</label>
          <AnimalSearchInput
            sexoFilter="Macho"
            valorInicial={{
              id: formData.padrote_id,
              label: formData.padrote_label,
            }}
            onSelect={(animal) => {
              if (animal) {
                handleSelectChange("padrote_id", animal._id);
                handleSelectChange(
                  "padrote_label",
                  `${animal.codigo} - ${animal.nombre || ""}`,
                );
              } else {
                handleSelectChange("padrote_id", "");
                handleSelectChange("padrote_label", "");
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">
            ¿Cómo se detectó la preñez?
          </label>
          <Select
            opciones={["Observacion", "Ecografia", "Palpacion"]}
            valorSeleccionado={formData.metodo_deteccion_prenez}
            onChange={(val) =>
              handleSelectChange("metodo_deteccion_prenez", val)
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Nota</label>
          <textarea
            name="nota_prenez"
            value={formData.nota_prenez}
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
