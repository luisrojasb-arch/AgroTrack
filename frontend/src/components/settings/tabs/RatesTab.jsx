"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { actualizarTasasCambioAction } from "@/actions/finca.actions";
import { toast } from "sonner";

/**
 * @description Pestaña para configurar tasas de cambio del sistema.
 * @param {Object} props
 * @param {Object} props.data - Configuración de tasas.
 */

export default function RatesTab({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    usd_a_cop: data?.usd_a_cop || 0,
    bs_a_cop: data?.bs_a_cop || 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      usd_a_cop: Number(formData.usd_a_cop),
      bs_a_cop: Number(formData.bs_a_cop),
    };

    const res = await actualizarTasasCambioAction(payload);

    if (res.success) {
      toast.success("Tasas actualizadas correctamente");
      setIsEditing(false);
    } else {
      toast.error(res.error || "Hubo un error al guardar");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-transparent border border-primary text-primary flex items-center justify-center text-2xl font-bold shrink-0">
            $
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-black">Tasas Diarias</h3>
            <p className="text-[12px] text-gray-agro mt-1">
              Valores de conversión actuales
            </p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="green"
            onClick={() => setIsEditing(true)}
            fullWidth
            className="md:w-fit"
          >
            Editar Tasas
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Tasa USD a Pesos (COP)
          </label>
          {isEditing ? (
            <input
              type="number"
              min="0"
              step="0.01"
              name="usd_a_cop"
              value={formData.usd_a_cop}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.usd_a_cop?.toLocaleString() || "0"} COP
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Tasa Bs a Pesos (COP)
          </label>
          {isEditing ? (
            <input
              type="number"
              min="0"
              step="0.01"
              name="bs_a_cop"
              value={formData.bs_a_cop}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.bs_a_cop?.toLocaleString() || "0"} COP
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col md:flex-row items-center justify-end gap-4 mt-12 pt-6 border-t border-border-agro">
          <Button
            variant="white"
            onClick={() => setIsEditing(false)}
            fullWidth
            className="md:w-fit order-2 md:order-1"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="green"
            onClick={handleSave}
            fullWidth
            className="md:w-fit order-1 md:order-2"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      )}
    </div>
  );
}
