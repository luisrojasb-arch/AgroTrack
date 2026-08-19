"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

const generarContrasenha = () => {
  const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const minusculas = "abcdefghijklmnopqrstuvwxyz";
  const numeros = "0123456789";
  const especiales = "@$!%*?&";

  const todos = mayusculas + minusculas + numeros + especiales;
  let password = "";

  password += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  password += minusculas[Math.floor(Math.random() * minusculas.length)];
  password += numeros[Math.floor(Math.random() * numeros.length)];
  password += especiales[Math.floor(Math.random() * especiales.length)];

  for (let i = password.length; i < 8; i++) {
    password += todos[Math.floor(Math.random() * todos.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

const getInitialState = (user) => {
  if (user) {
    return {
      nombre: user.nombre?.split(" ")[0] || "",
      apellido: user.nombre?.split(" ").slice(1).join(" ") || "",
      correo: user.correo || "",
      rol: user.rol || "Trabajador",
      contrasenha_temporal: "",
    };
  }
  return {
    nombre: "",
    apellido: "",
    correo: "",
    rol: "Trabajador",
    contrasenha_temporal: generarContrasenha(),
  };
};

/**
 * @description Modal para registrar nuevos usuarios o editar existentes.
 * @param {Object} props - Propiedades del formulario.
 */

export default function UserFormModal({
  isOpen,
  onClose,
  userToEdit = null,
  onSubmit,
}) {
  const isEditMode = !!userToEdit;

  const [formData, setFormData] = useState(() => getInitialState(userToEdit));
  const [prevUser, setPrevUser] = useState(userToEdit);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (userToEdit !== prevUser || isOpen !== prevIsOpen) {
    setPrevUser(userToEdit);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData(getInitialState(userToEdit));
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegenerar = () => {
    setFormData((prev) => ({
      ...prev,
      contrasenha_temporal: generarContrasenha(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido || !formData.rol) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    if (!isEditMode && (!formData.correo || !formData.contrasenha_temporal)) {
      toast.error(
        "El correo y la contraseña son obligatorios para un nuevo usuario.",
      );
      return;
    }

    let rolBackend = "trabajador";
    if (formData.rol === "Administrador") rolBackend = "admin";
    if (formData.rol === "Veterinario") rolBackend = "veterinario";

    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      rol: rolBackend,
    };

    if (!isEditMode) {
      dataToSend.correo = formData.correo;
      dataToSend.contrasenha_temporal = formData.contrasenha_temporal;
    }

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
        {isEditMode ? "Editar Miembro" : "Registrar Miembro"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Usuario" : "Registrar Usuario"}
      description="Ingresa los datos del usuario"
      width="max-w-2xl"
      footer={formFooter}
    >
      <form
        className="flex flex-col gap-4 mt-2 px-6 pb-2"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Osmar"
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Apellido *
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ej: Porras"
              required
              className="w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Correo *</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Ej: osmarporras@gmail.com"
            required={!isEditMode}
            disabled={isEditMode}
            className={`w-full h-10 px-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] ${
              isEditMode
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "text-black"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-black">Rol *</label>
          <Select
            opciones={["Administrador", "Trabajador", "Veterinario"]}
            valorSeleccionado={formData.rol}
            onChange={(val) => handleSelectChange("rol", val)}
            placement="top"
          />
        </div>

        {!isEditMode && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Contraseña temporal *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="contrasenha_temporal"
                value={formData.contrasenha_temporal}
                readOnly
                className="w-full h-10 px-3 rounded-lg border border-border-agro bg-gray-50 text-[14px] text-gray-600 focus:outline-none"
              />
              <Button
                variant="white"
                onClick={handleRegenerar}
                type="button"
                className="shrink-0"
              >
                Regenerar
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
