import { Bell } from "lucide-react";

export default function ListAlertElm({ data }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-(--color-border-agro) rounded-xl hover:bg-(--color-bg-nav) transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-(--color-gray-agro) shrink-0">
          {/* Ajusté el tamaño de la campana para que sea proporcional */}
          <Bell className="w-5 h-5" />
        </div>

        <div className="flex flex-col">
          {/* Cambié font-sm (no existe en Tailwind) por font-medium */}
          <span className="text-sm font-sm text-black">{data.titulo}</span>
          <span className="text-sm text-(--color-gray-agro-muted)">
            {data.subtitulo}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end text-right">
        <span className="text-sm text-(--color-gray-agro)">{data.fecha}</span>
        <span
          className={`text-sm ${
            data.estado_relativo === "Vencido"
              ? "text-[#e55353]"
              : data.estado_relativo === "Mañana"
                ? "text-(--color-primary)"
                : "text-(--color-gray-agro-muted)"
          }`}
        >
          {data.estado_relativo}
        </span>
      </div>
    </div>
  );
}
