"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * @description Componente Modal reutilizable (Cascarón estructural).
 * @param {Object} props
 * @param {boolean} props.isOpen - Define si el modal está visible.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {string} props.title - Título principal del modal.
 * @param {string} [props.description] - Descripción o subtítulo (opcional).
 * @param {React.ReactNode} props.children - Contenido central (formularios, tablas, etc.).
 * @param {React.ReactNode} [props.footer] - Botones de acción inferiores (opcional).
 * @param {string} [props.width="max-w-2xl"] - Ancho máximo del modal (ej. max-w-md, max-w-3xl).
 * @returns {JSX.Element | null}
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = "max-w-2xl",
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 bg-[#000000]/40 backdrop-blur-[10px] animate-in fade-in duration-200"
      onMouseDown={onClose}
    >
      <div
        className={`bg-gradient-card border border-border-agro w-full ${width} max-h-[85vh] rounded-2xl shadow-xl flex flex-col p-6`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-end w-full">
            <button
              onClick={onClose}
              className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg border border-border-agro text-black hover:brightness-95 bg-white transition-all cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-col gap-1 pr-4">
            <h2 className="text-[20px] font-bold text-black leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-[14px] font-medium text-gray-agro">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {children}
        </div>

        {footer && (
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-end w-full gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}