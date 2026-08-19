"use client";

import { TriangleAlert } from "lucide-react";

export default function HealthCronoBase() {
  const cronograma = [
    {
      dia: "2",
      manejo: "Descolmillado y descola",
      producto: "Hierro dextrano + anticoccidial",
    },
    { dia: "5", manejo: "Vacuna edemas", producto: "Bepure (Inpra España)" },
    { dia: "12", manejo: "Vitaminas", producto: "Complejo B" },
    {
      dia: "15",
      manejo: "Castración de machos",
      producto: "Castración quirúrgica (lactancia)",
    },
    { dia: "21", manejo: "Vitaminas", producto: "Vitamina AD3E" },
    {
      dia: "35",
      manejo: "Destete y desparasitación",
      producto: "Desparasitante oral",
    },
    {
      dia: "40",
      manejo: "Vacuna cólera porcino",
      producto: "Vacuna PPC (obligatoria para salida)",
    },
  ];

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Día
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Manejo/Vacuna
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Producto
            </th>
          </tr>
        </thead>
        <tbody>
          {cronograma.map((item, index) => (
            <tr
              key={index}
              className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-2 text-[14px] text-black font-medium">
                {item.dia}
              </td>
              <td className="py-4 px-2 text-[14px] text-black">
                {item.manejo}
              </td>
              <td className="py-4 px-2 text-[14px] text-black">
                {item.producto}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Alerta de advertencia sin fondo, flotando abajo */}
      <div className="flex items-center gap-2 mt-6 px-2">
        <TriangleAlert className="w-[18px] h-[18px] text-amber-500 shrink-0" />
        <p className="text-[13px] text-gray-500">
          Ningún animal debe salir de la finca sin la vacuna contra el cólera
          porcino (día 40).
        </p>
      </div>
    </div>
  );
}
