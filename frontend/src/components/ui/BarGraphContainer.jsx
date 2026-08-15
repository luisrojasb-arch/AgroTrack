"use client";

import { useState, useEffect } from "react";
import Select from "./Select"; // Ajusta la ruta a tu componente Select
import BarGraph from "./BarGraph"; // Ajusta la ruta a tu componente BarGraph

export default function BargraphContainer({ data, title }) {
  // 1. Obtenemos el arreglo de datos o un arreglo vacío por seguridad
  const rawData = data?.ingresos_vs_gastos || [];

  // 2. Definición de Estados
  const [disp, setDisp] = useState("pc");
  const [opcionTablet, setOpcionTablet] = useState("Trimestre Actual");
  // Por defecto en teléfono seleccionamos el último mes disponible
  const [opcionTelefono, setOpcionTelefono] = useState(
    rawData.length > 0 ? rawData[rawData.length - 1].mes : ""
  );

  // 3. Efecto para detectar el tamaño de la pantalla
  useEffect(() => {
    const evaluarTamaño = () => {
      const ancho = window.innerWidth;
      if (ancho < 768) {
        setDisp("telefono");
      } else if (ancho >= 768 && ancho < 1024) {
        setDisp("tablet");
      } else {
        setDisp("pc");
      }
    };

    evaluarTamaño(); // Ejecución inicial
    window.addEventListener("resize", evaluarTamaño);
    return () => window.removeEventListener("resize", evaluarTamaño);
  }, []);

  // 4. Lógica dinámica de filtrado y configuración del Select según 'disp'
  let datosFiltrados = [];
  let opcionesSelect = [];
  let valorSeleccionado = "";
  let handleChangeSelect = () => {};

  if (disp === "pc") {
    // En PC mostramos todo, no hay Select
    datosFiltrados = rawData;
  } else if (disp === "tablet") {
    // Configuración para Tablet
    opcionesSelect = ["Trimestre Anterior", "Trimestre Actual"];
    valorSeleccionado = opcionTablet;
    handleChangeSelect = setOpcionTablet;

    if (opcionTablet === "Trimestre Actual") {
      datosFiltrados = rawData.slice(-3); // Los últimos 3 elementos
    } else {
      datosFiltrados = rawData.slice(0, 3); // Los primeros 3 elementos
    }
  } else if (disp === "telefono") {
    // Configuración para Teléfono
    opcionesSelect = rawData.map((item) => item.mes); // ['Mar', 'Abr', ...]
    valorSeleccionado = opcionTelefono;
    handleChangeSelect = setOpcionTelefono;

    // Filtramos para que solo quede el mes seleccionado
    datosFiltrados = rawData.filter((item) => item.mes === opcionTelefono);
    
    // Fallback por si la data cambia y la opción seleccionada ya no existe
    if (datosFiltrados.length === 0 && rawData.length > 0) {
      datosFiltrados = [rawData[rawData.length - 1]];
    }
  }

  // 5. Transformamos la data filtrada al formato exacto de Chart.js
  const chartData = {
    labels: datosFiltrados.map((d) => d.mes),
    datasets: [
      {
        label: "Ingresos",
        data: datosFiltrados.map((d) => d.ingresos),
        backgroundColor: "#157937", // Verde AgroTrack
        borderRadius: 4, // Bordes redondeados de las barras
        barPercentage: 0.6,
      },
      {
        label: "Gastos",
        data: datosFiltrados.map((d) => d.gastos),
        backgroundColor: "#0084ff", // Azul de las imagenes
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  // 6. Opciones visuales de la gráfica (Leyenda inferior con círculos, etc)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true, // Hace que los indicadores sean círculos
          boxWidth: 8,
          padding: 20,
          color: "#157937", // Ajusta si prefieres otro color para el texto de leyenda
          font: { weight: "bold" }
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5], // Líneas punteadas horizontales
        },
      },
      x: {
        grid: {
          display: false, // Quitamos las líneas verticales para limpiar el diseño
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border-agro)] p-6 flex flex-col w-full h-full shadow-sm min-h-[400px]">
      
      {/* Encabezado: Título y Select condicional */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">{title}</h2>
          <p className="text-sm text-[var(--color-gray-agro-muted)]">
            {disp === "pc" 
              ? "Últimos 6 meses" 
              : disp === "tablet" 
                ? valorSeleccionado 
                : `Información de ${valorSeleccionado}`}
          </p>
        </div>

        {/* Solo renderizamos el Select si NO estamos en PC */}
        {disp !== "pc" && (
          <div className="w-full sm:w-48 z-10">
            <Select
              opciones={opcionesSelect}
              valorSeleccionado={valorSeleccionado}
              onChange={handleChangeSelect}
              placement="bottom"
            />
          </div>
        )}
      </div>

      {/* Contenedor de la gráfica */}
      <div className="flex-grow w-full relative">
        <BarGraph data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}