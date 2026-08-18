"use client";

import { useState } from "react";
import Select from "@/components/ui/Select";
import BarGraph from "@/components/ui/BarGraph";

const COLORS = [
  "#157937",
  "#0084ff",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#ef4444",
  "#6366f1",
  "#06b6d4",
];

export default function SeleccionDashboard({ dashboardData }) {
  const graficaData = dashboardData?.grafica || [];
  const topProspectos = dashboardData?.top_prospectos || [];

  const [grupoSeleccionadoManual, setGrupoSeleccionadoManual] = useState("");

  const grupoSeleccionado =
    grupoSeleccionadoManual ||
    (graficaData.length > 0 ? graficaData[0].codigo_grupo : "");

  const opcionesGrupos = graficaData.map((g) => g.codigo_grupo);
  const grupoActivo = graficaData.find(
    (g) => g.codigo_grupo === grupoSeleccionado,
  );

  let chartData = { labels: [], datasets: [] };

  if (grupoActivo && grupoActivo.animales.length > 0) {
    const maxControles = Math.max(
      ...grupoActivo.animales.map((a) => a.historial_pesos.length),
    );

    chartData.labels = [
      "Inicio",
      ...Array.from({ length: maxControles }, (_, i) => `Control ${i + 1}`),
    ];

    chartData.datasets = grupoActivo.animales.map((anim, index) => {
      const pesos = [
        anim.peso_inicial,
        ...anim.historial_pesos.map((h) => h.peso),
      ];

      return {
        label: anim.codigo,
        data: pesos,
        backgroundColor: COLORS[index % COLORS.length],
        borderRadius: 4,
        barPercentage: 0.7,
      };
    });
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, boxWidth: 8, padding: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)", borderDash: [5, 5] },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="flex flex-col gap-6 w-full mb-8">
      {/* SECCIÓN 1: GRAFICA DE RENDIMIENTO */}
      <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 flex flex-col w-full shadow-sm min-h-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-black mb-1">
              Gráfica de Rendimiento
            </h2>
            <p className="text-[14px] text-gray-agro-muted">
              Ver el rendimiento de pesos en los controles
            </p>
          </div>
          {opcionesGrupos.length > 0 && (
            <div className="w-full sm:w-64 z-10">
              <Select
                opciones={opcionesGrupos}
                valorSeleccionado={grupoSeleccionado}
                onChange={setGrupoSeleccionadoManual}
              />
            </div>
          )}
        </div>
        <div className="grow w-full relative h-75">
          {grupoActivo ? (
            <BarGraph data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-placeholder text-[14px]">
              No hay datos para graficar.
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: TOP 10 MEJORES PROSPECTOS (NUEVO DISEÑO EN TABLA) */}
      <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 flex flex-col w-full shadow-sm">
        <h2 className="text-xl font-bold text-black mb-1">
          Top Mejores Prospectos
        </h2>
        <p className="text-[14px] text-gray-agro-muted mb-6">
          Candidatas rankeadas por sus atributos físicos (Peso, Pezones y Patas)
        </p>

        {topProspectos.length === 0 ? (
          <div className="text-center text-gray-placeholder text-[14px] py-8">
            No hay candidatas registradas actualmente en tus grupos de
            selección.
          </div>
        ) : (
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="border-b border-border-agro">
                  <th className="py-4 px-2 text-[12px] font-bold text-gray-agro uppercase tracking-wider w-16 text-center">
                    Rango
                  </th>
                  <th className="py-4 px-2 text-[12px] font-bold text-gray-agro uppercase tracking-wider">
                    Código
                  </th>
                  <th className="py-4 px-2 text-[12px] font-bold text-gray-agro uppercase tracking-wider">
                    Peso
                  </th>
                  <th className="py-4 px-2 text-[12px] font-bold text-gray-agro uppercase tracking-wider">
                    Pezones
                  </th>
                  <th className="py-4 px-2 text-[12px] font-bold text-gray-agro uppercase tracking-wider">
                    Patas (Del. / Tras.)
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProspectos.map((prospecto, index) => (
                  <tr
                    key={prospecto._id || prospecto.codigo}
                    className="border-b border-[#F4F5F7] hover:bg-white/50 transition-colors"
                  >
                    <td className="py-4 px-2 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold ${
                          index === 0
                            ? "bg-[#FFD700]/20 text-[#B8860B]" // Oro
                            : index === 1
                              ? "bg-[#C0C0C0]/30 text-[#696969]" // Plata
                              : index === 2
                                ? "bg-[#CD7F32]/20 text-[#8B4513]" // Bronce
                                : "bg-gray-100 text-gray-agro-text"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-[14px] font-medium text-black">
                      {prospecto.codigo}{" "}
                      {prospecto.nombre ? `(${prospecto.nombre})` : ""}
                    </td>
                    <td className="py-4 px-2 text-[14px] text-black">
                      {prospecto.peso} kg
                    </td>
                    <td className="py-4 px-2 text-[14px] text-black">
                      {prospecto.pezones}
                    </td>
                    <td className="py-4 px-2 text-[14px] text-black">
                      {prospecto.patas_delanteras} / {prospecto.patas_traseras}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
