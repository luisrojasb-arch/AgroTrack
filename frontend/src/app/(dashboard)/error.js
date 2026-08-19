"use client";

import { useEffect } from "react";

/**
 * @description Plantilla de Next.js para el manejo y visualización de errores (error.js).
 * @param {Object} props
 * @param {Error} props.error - Objeto del error capturado.
 * @param {Function} props.reset - Función para intentar recargar el componente fallido.
 */

export default function ErrorTemplate({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>¡Uy! Algo salió mal en esta sección.</h2>
      <button
        onClick={() => reset()}
        style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
