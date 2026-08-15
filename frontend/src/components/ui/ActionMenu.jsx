"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

/**
 * @description Menú de acciones desplegable reutilizable para tablas, utilizando Portales para evitar recortes (overflow).
 * @param {Object} props
 * @param {Array} props.opciones - Arreglo con { label, icono, accion, esDestructivo }
 */
export default function ActionMenu({ opciones = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({
    top: undefined,
    bottom: undefined,
    right: 0,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const alturaEstimadaMenu = opciones.length * 40 + 16;
      const espacioAbajo = window.innerHeight - rect.bottom;
      const abrirHaciaArriba = espacioAbajo < alturaEstimadaMenu;

      setCoords({
        top: abrirHaciaArriba ? undefined : rect.bottom + 4,
        bottom: abrirHaciaArriba
          ? window.innerHeight - rect.top + 4
          : undefined,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1 text-gray-400 hover:text-black transition-colors rounded-md focus:outline-none cursor-pointer"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top !== undefined ? `${coords.top}px` : "auto",
              bottom:
                coords.bottom !== undefined ? `${coords.bottom}px` : "auto",
              right: `${coords.right}px`,
            }}
            className="w-42.5 bg-white border border-border-agro rounded-lg shadow-[0px_4px_16px_rgba(0,0,0,0.12)] z-9999 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <ul className="py-1">
              {opciones.map((opcion, index) => (
                <li key={index}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      opcion.accion();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-[14px] transition-colors cursor-pointer ${
                      opcion.esDestructivo
                        ? "text-[#F04438] hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <span
                      className={
                        opcion.esDestructivo ? "text-[#F04438]" : "text-primary"
                      }
                    >
                      {opcion.icono}
                    </span>
                    {opcion.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
