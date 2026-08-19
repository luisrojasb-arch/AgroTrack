"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { updatePerfilAction } from "@/actions/user.actions";
import { toast } from "sonner";

/**
 * @description Pestaña de perfil del usuario logueado.
 * @param {Object} props
 * @param {Object} props.data - Datos del usuario.
 */

export default function ProfileTab({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: data?.nombre || "",
    apellido: data?.apellido || "",
    telefono: data?.telefono || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);

    const payload = { ...formData };
    if (payload.telefono === "") {
      payload.telefono = null;
    }

    const res = await updatePerfilAction(payload);

    if (res.success) {
      toast.success("Perfil actualizado correctamente");
      setIsEditing(false);
    } else {
      toast.error(res.error || "Hubo un error al guardar");
    }
    setIsLoading(false);
  };

  const getInicial = () => data?.nombre?.charAt(0).toUpperCase() || "U";

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-transparent border border-primary text-primary flex items-center justify-center text-2xl font-bold shrink-0">
            {getInicial()}
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-black">
              {data?.nombre} {data?.apellido}
            </h3>
            <span className="bg-primary-transparent text-primary text-[12px] font-bold px-3 py-1 rounded-full mt-1 inline-block capitalize">
              {data?.rol_finca || "Usuario"}
            </span>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="green"
            onClick={() => setIsEditing(true)}
            fullWidth
            className="md:w-fit"
          >
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">Nombre</label>
          {isEditing ? (
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.nombre || "-"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Apellido
          </label>
          {isEditing ? (
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.apellido || "-"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Correo Electrónico
          </label>
          <p className="text-[16px] text-gray-agro font-medium">
            {data?.correo || "-"}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-bold text-gray-agro">
            Teléfono
          </label>
          {isEditing ? (
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="h-10.5 border border-border-agro rounded-lg px-4 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-[16px] text-black font-medium">
              {data?.telefono || "-"}
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
