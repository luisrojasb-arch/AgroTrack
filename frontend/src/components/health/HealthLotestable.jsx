"use client";

/**
 * @description Tabla de control sanitario a nivel de lotes.
 * @param {Object} props - Propiedades de la tabla.
 */

export default function HealthLotestable({
  data = [],
  onVerTareasClick,
  userRole,
}) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Progreso
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Próxima Tarea
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              const estadoTexto = item.estado || "-";
              let estadoEstilos = "bg-gray-50 text-gray-600 border-gray-200";

              if (
                ["Aplicado", "Completado", "Finalizado", "Al día"].includes(
                  estadoTexto,
                )
              ) {
                estadoEstilos = "bg-green-50 text-green-600 border-green-200";
              } else if (
                ["Pendiente", "En proceso", "Programado"].includes(estadoTexto)
              ) {
                estadoEstilos =
                  "bg-yellow-50 text-yellow-600 border-yellow-200";
              } else if (
                ["Cancelado", "Atrasado", "Vencido"].includes(estadoTexto)
              ) {
                estadoEstilos = "bg-red-50 text-red-600 border-red-200";
              }

              return (
                <tr
                  key={item.id || index}
                  className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-2 text-[14px] text-black font-medium">
                    {item.codigo || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {item.progreso || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {item.proxima_tarea || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {item.fecha
                      ? new Date(item.fecha).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px]">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${estadoEstilos}`}
                    >
                      {estadoTexto}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button
                      onClick={() => onVerTareasClick && onVerTareasClick(item)}
                      className="px-3 py-1.5 text-[12px] font-semibold text-black bg-white border border-border-agro rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                    >
                      Ver Tareas
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="6"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No hay registros de salud en lote para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
