"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AnimalSearchInput from "@/components/animals/modalsAnimals/AnimalSearchInput";
import { toast } from "sonner";

const getInitialState = (celo) => {
  let formattedFecha = "";
  if (celo?.fecha_celo && celo.fecha_celo !== "-") {
    if (celo.fecha_celo.includes("/")) {
      const [dia, mes, anio] = celo.fecha_celo.split("/");
      formattedFecha = `${anio}-${mes}-${dia}`;
    } else {
      try {
        formattedFecha = new Date(celo.fecha_celo).toISOString().split("T")[0];
      } catch (e) {}
    }
  }

  if (celo) {
    return {
      hembra_id: celo.hembra_id?._id || celo.hembra_id || "",
      hembra_label:
        celo.codigo && celo.nombre ? `${celo.codigo} - ${celo.nombre}` : "",
      fecha_celo: formattedFecha,
      nota_celo: celo.notas || celo.nota_celo || "",
    };
  }
  return { hembra_id: "", hembra_label: "", fecha_celo: "", nota_celo: "" };
};

export default function CeloFormModal({
  isOpen,
  onClose,
  celoToEdit = null,
  onSubmit,
}) {
  const isEditMode = !!celoToEdit;
  const [formData, setFormData] = useState(() => getInitialState(celoToEdit));
  const [prevCelo, setPrevCelo] = useState(celoToEdit);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (celoToEdit !== prevCelo || isOpen !== prevIsOpen) {
    setPrevCelo(celoToEdit);
    setPrevIsOpen(isOpen);
    if (isOpen) setFormData(getInitialState(celoToEdit));
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

    if (!formData.hembra_id || !formData.fecha_celo) {
      toast.error("La hembra y la fecha son obligatorias.");
      return;
    }

    if (formData.fecha_celo > fechaHoy) {
      toast.error("La fecha del celo no puede ser futura.");
      return;
    }

    const dataToSend = { ...formData };
    delete dataToSend.hembra_label;
    onSubmit(dataToSend, isEditMode);
  };

  const calcularFechas = () => {
    if (!formData.fecha_celo)
      return { proximo: "dd/mm/aaaa", parto: "dd/mm/aaaa" };
    const d = new Date(formData.fecha_celo + "T00:00:00");
    if (isNaN(d.getTime()))
      return { proximo: "dd/mm/aaaa", parto: "dd/mm/aaaa" };

    const proximo = new Date(d);
    proximo.setDate(proximo.getDate() + 21);
    const parto = new Date(d);
    parto.setDate(parto.getDate() + 114);

    return {
      proximo: proximo.toLocaleDateString("es-ES"),
      parto: parto.toLocaleDateString("es-ES"),
    };
  };

  const fechas = calcularFechas();

  const formFooter = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
      <div className="text-[12px] text-gray-500">
        Próximo celo esperado:{" "}
        <span className="text-primary font-bold">{fechas.proximo}</span>. Parto
        probable si queda preñada:{" "}
        <span className="text-primary font-bold">{fechas.parto}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="white" onClick={onClose} type="button">
          Cancelar
        </Button>
        <Button variant="green" onClick={handleSubmit} type="button">
          {isEditMode ? "Editar Celo" : "Registrar Celo"}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Celo" : "Registro de Celo"}
      description="Completa la información"
      width="max-w-2xl"
      footer={formFooter}
    >
      <form
        className="flex flex-col gap-4 mt-2 px-6 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Hembra *</label>
          <AnimalSearchInput
            sexoFilter="Hembra"
            valorInicial={{
              id: formData.hembra_id,
              label: formData.hembra_label,
            }}
            onSelect={(animal) => {
              if (animal) {
                handleSelectChange("hembra_id", animal._id);
                handleSelectChange(
                  "hembra_label",
                  `${animal.codigo} - ${animal.nombre || ""}`,
                );
              } else {
                handleSelectChange("hembra_id", "");
                handleSelectChange("hembra_label", "");
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Fecha *</label>
          <input
            type="date"
            name="fecha_celo"
            value={formData.fecha_celo}
            onChange={handleChange}
            max={fechaHoy}
            required
            className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Nota</label>
          <textarea
            name="nota_celo"
            value={formData.nota_celo}
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
