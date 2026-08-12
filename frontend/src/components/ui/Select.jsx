"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * @description Componente Select desplegable personalizado y reutilizable.
 * @param {Object} props
 * @param {Array<string>} props.opciones - Lista de opciones a mostrar.
 * @param {string} props.valorSeleccionado - El valor actualmente seleccionado.
 * @param {function} props.onChange - Función que se ejecuta al seleccionar una opción.
 * @param {string} [props.className=""] - Clases CSS adicionales para el contenedor.
 * @param {string} [props.placement="bottom"] - Dirección en la que se abre ("bottom" o "top").
 */
export default function Select({
  opciones = [],
  valorSeleccionado,
  onChange,
  className = "",
  placement = "bottom",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between h-10.5 bg-white border rounded-lg pl-4 pr-3 text-[14px] text-black focus:outline-none transition-colors cursor-pointer ${
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-border-agro hover:border-gray-300"
        }`}
      >
        <span>{valorSeleccionado}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white border border-border-agro rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <ul className="py-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            {opciones.map((opcion) => (
              <li
                key={opcion}
                onClick={() => {
                  onChange(opcion);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-[14px] cursor-pointer transition-colors ${
                  valorSeleccionado === opcion
                    ? "bg-[#E8F3EB] text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {opcion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
