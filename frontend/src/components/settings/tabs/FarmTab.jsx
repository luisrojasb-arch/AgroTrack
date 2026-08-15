"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { actualizarFincaAction } from "@/actions/finca.actions";
import { toast } from "sonner";

export default function FarmTab({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_finca: data?.nombre_finca || "",
    direccion_finca: data?.direccion_finca || "",
    tamanho_hectareas: data?.tamanho_hectareas || 0,
    telefono_finca: data?.telefono_finca || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    const res = await actualizarFincaAction(formData);

    if (res.success) {
      toast.success("Finca actualizada correctamente");
      setIsEditing(false);
    } else {
      toast.error(res.error || "Hubo un error al guardar");
    }
    setIsLoading(false);
  };

  const getInicial = () => data?.nombre_finca?.charAt(0).toUpperCase() || "F";

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-transparent border border-primary text-primary flex items-center justify-center text-2xl font-bold shrink-0">
            {getInicial()}
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-black">
              {data?.nombre_finca || "Finca"}
            </h3>
            <p className="text-[12px] text-gray-agro mt-1">
              Detalles y ubicación de la propiedad
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
            Editar Finca
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Nombre de la Granja
          </label>
          {isEditing ? (
            <input
              type="text"
              name="nombre_finca"
              value={formData.nombre_finca}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.nombre_finca || "-"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Ubicación
          </label>
          {isEditing ? (
            <input
              type="text"
              name="direccion_finca"
              value={formData.direccion_finca}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.direccion_finca || "-"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Tamaño (Hectáreas)
          </label>
          {isEditing ? (
            <input
              type="number"
              name="tamanho_hectareas"
              value={formData.tamanho_hectareas}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.tamanho_hectareas || "0"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Teléfono
          </label>
          {isEditing ? (
            <input
              type="text"
              name="telefono_finca"
              value={formData.telefono_finca}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.telefono_finca || "-"}
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
