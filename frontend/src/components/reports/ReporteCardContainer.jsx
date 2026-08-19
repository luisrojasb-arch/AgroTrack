"use client";

/**
 * @description Contenedor que agrupa y organiza las tarjetas de selección de reportes.
 * @param {Object} props - Propiedades del contenedor de tarjetas.
 */

export default function ReporteCardContainer({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {children}
    </div>
  );
}