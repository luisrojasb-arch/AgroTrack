"use client";

import { Menu } from "lucide-react";

/**
 * @description Barra de navegación superior del sistema.
 * @param {Object} props
 * @param {Function} props.onMenuClick - Acción para abrir el menú móvil.
 * @param {Object} props.usuario - Información del usuario logueado.
 */

export default function Navbar({ onMenuClick, usuario }) {
  const usuarioNombre = usuario?.nombre
    ? `${usuario.nombre} ${usuario.apellido}`
    : "Usuario";

  let usuarioRol = "Miembro";
  if (usuario?.rol === "admin") usuarioRol = "Administrador";
  if (usuario?.rol === "trabajador") usuarioRol = "Trabajador";
  if (usuario?.rol === "veterinario") usuarioRol = "Veterinario";

  const inicial = usuarioNombre.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-bg-nav border-b border-border-agro flex items-center justify-between lg:justify-end px-4 lg:px-8 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-green text-white shadow-sm hover:opacity-90 transition-opacity"
      >
        <Menu size={24} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-4 border-l border-border-agro pl-4 lg:pl-6 h-10">
        <div className="flex flex-col items-end justify-center">
          <span className="text-[14px] font-bold text-black leading-tight">
            {usuarioNombre}
          </span>
          <span className="text-[12px] font-semibold text-primary leading-tight">
            {usuarioRol}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[16px]">
          {inicial}
        </div>
      </div>
    </header>
  );
}
