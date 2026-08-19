"use client";

import { Check, X, Eye } from "lucide-react";

const permissionsData = [
  {
    modulo: "Panel Principal",
    admin: "check",
    trabajador: "check",
    veterinario: "x",
  },
  {
    modulo: "Animales",
    admin: "check",
    trabajador: "check",
    veterinario: "eye",
  },
  {
    modulo: "Salud",
    admin: "check",
    trabajador: "check",
    veterinario: "check",
  },
  {
    modulo: "Reproduccion",
    admin: "check",
    trabajador: "check",
    veterinario: "check",
  },
  {
    modulo: "Inventario",
    admin: "check",
    trabajador: "check",
    veterinario: "x",
  },
  { modulo: "Finanzas", admin: "check", trabajador: "x", veterinario: "x" },
  { modulo: "Reportes", admin: "check", trabajador: "x", veterinario: "x" },
  { modulo: "Usuarios", admin: "check", trabajador: "x", veterinario: "x" },
];

/**
 * @description Tabla de consulta de matriz de permisos por roles.
 */

export default function PermissionsTable() {
  const renderIcon = (status) => {
    switch (status) {
      case "check":
        return (
          <Check size={20} className="text-primary mx-auto" strokeWidth={3} />
        );
      case "x":
        return (
          <X size={20} className="text-[#F04438] mx-auto" strokeWidth={3} />
        );
      case "eye":
        return (
          <Eye
            size={20}
            className="text-gray-agro-text mx-auto"
            strokeWidth={2.5}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none mt-2">
      <table className="w-full text-left border-collapse min-w-150">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[13px] font-bold text-gray-500 tracking-wider w-1/4">
              Modulo
            </th>
            <th className="py-4 px-2 text-[13px] font-bold text-gray-500 tracking-wider text-center w-1/4">
              Administrador
            </th>
            <th className="py-4 px-2 text-[13px] font-bold text-gray-500 tracking-wider text-center w-1/4">
              Trabajador
            </th>
            <th className="py-4 px-2 text-[13px] font-bold text-gray-500 tracking-wider text-center w-1/4">
              Veterinario
            </th>
          </tr>
        </thead>
        <tbody>
          {permissionsData.map((row, index) => (
            <tr
              key={index}
              className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-2 text-[14px] text-black font-medium">
                {row.modulo}
              </td>
              <td className="py-4 px-2 text-center">{renderIcon(row.admin)}</td>
              <td className="py-4 px-2 text-center">
                {renderIcon(row.trabajador)}
              </td>
              <td className="py-4 px-2 text-center">
                {renderIcon(row.veterinario)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
