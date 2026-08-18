"use client";

import { useState, useEffect } from "react";
import Select from "./Select"; 
import BarGraph from "./BarGraph"; 

export default function BargraphContainer({ data, title }) {

  const rawData = data?.ingresos_vs_gastos || [];

  
  const [disp, setDisp] = useState("pc");
  const [opcionTablet, setOpcionTablet] = useState("Trimestre Actual");
  
  const [opcionTelefono, setOpcionTelefono] = useState(
    rawData.length > 0 ? rawData[rawData.length - 1].mes : ""
  );

  
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

    evaluarTamaño(); 
    window.addEventListener("resize", evaluarTamaño);
    return () => window.removeEventListener("resize", evaluarTamaño);
  }, []);

  
  let datosFiltrados = [];
  let opcionesSelect = [];
  let valorSeleccionado = "";
  let handleChangeSelect = () => {};

  if (disp === "pc") {
    
    datosFiltrados = rawData;
  } else if (disp === "tablet") {
   
    opcionesSelect = ["Trimestre Anterior", "Trimestre Actual"];
    valorSeleccionado = opcionTablet;
    handleChangeSelect = setOpcionTablet;

    if (opcionTablet === "Trimestre Actual") {
      datosFiltrados = rawData.slice(-3); // Los últimos 3 elementos
    } else {
      datosFiltrados = rawData.slice(0, 3); // Los primeros 3 elementos
    }
  } else if (disp === "telefono") {
    
    opcionesSelect = rawData.map((item) => item.mes); // ['Mar', 'Abr', ...]
    valorSeleccionado = opcionTelefono;
    handleChangeSelect = setOpcionTelefono;

   
    datosFiltrados = rawData.filter((item) => item.mes === opcionTelefono);
    
    
    if (datosFiltrados.length === 0 && rawData.length > 0) {
      datosFiltrados = [rawData[rawData.length - 1]];
    }
  }

  
  const chartData = {
    labels: datosFiltrados.map((d) => d.mes),
    datasets: [
      {
        label: "Ingresos",
        data: datosFiltrados.map((d) => d.ingresos),
        backgroundColor:  "#0084ff", 
        borderRadius: 4, 
        barPercentage: 0.6,
      },
      {
        label: "Gastos",
        data: datosFiltrados.map((d) => d.gastos),
        backgroundColor:"#157937", 
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true, 
          boxWidth: 8,
          padding: 20,
          color: "#157937", 
          font: { weight: "bold" }
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5], 
        },
      },
      x: {
        grid: {
          display: false, 
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border-agro)] p-6 flex flex-col w-full h-full shadow-sm min-h-[400px]">
      
     
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

     
      <div className="flex-grow w-full relative">
        <BarGraph data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}