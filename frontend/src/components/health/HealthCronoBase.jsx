import { TriangleAlert } from "lucide-react";

export default function HealthCronoBase() {
  const cronograma = [
    { dia: "2", manejo: "Descolmillado y descola", producto: "Hierro dextrano + anticoccidial" },
    { dia: "5", manejo: "Vacuna edemas", producto: "Bepure (Inpra España)" },
    { dia: "12", manejo: "Vitaminas", producto: "Complejo B" },
    { dia: "15", manejo: "Castración de machos", producto: "Castración quirúrgica (lactancia)" },
    { dia: "21", manejo: "Vitaminas", producto: "Vitamina AD3E" },
    { dia: "35", manejo: "Destete y desparasitación", producto: "Desparasitante oral" },
    { dia: "40", manejo: "Vacuna cólera porcino", producto: "Vacuna PPC (obligatoria para salida)" },
  ];

  return (
    <div className="bg-white border border-[var(--color-border-agro)] rounded-2xl overflow-hidden shadow-sm w-full">
      
      <div className="grid grid-cols-[80px_1fr_1fr] sm:grid-cols-[100px_1fr_1fr] p-5 border-b border-[var(--color-border-agro)]">
        <div className="text-[13px] font-semibold text-[var(--color-gray-agro)] uppercase tracking-wide">
          Dia
        </div>
        <div className="text-[13px] font-semibold text-[var(--color-gray-agro)] uppercase tracking-wide">
          Manejo/Vacuna
        </div>
        <div className="text-[13px] font-semibold text-[var(--color-gray-agro)] uppercase tracking-wide">
          Producto
        </div>
      </div>

      <div className="flex flex-col">
        {cronograma.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[80px_1fr_1fr] sm:grid-cols-[100px_1fr_1fr] p-5 border-b border-[var(--color-border-agro)] last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm text-black font-medium">{item.dia}</div>
            <div className="text-sm text-black pr-4">{item.manejo}</div>
            <div className="text-sm text-black">{item.producto}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-bg-nav)] p-5 flex items-start sm:items-center gap-3 border-t border-[var(--color-border-agro)]">
        <TriangleAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-[var(--color-gray-agro-muted)]">
          Ningún animal debe salir de la finca sin la vacuna contra el cólera porcino (día 40).
        </p>
      </div>
      
    </div>
  );
}