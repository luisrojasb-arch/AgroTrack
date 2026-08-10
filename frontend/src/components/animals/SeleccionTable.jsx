import { MoreVertical } from "lucide-react";

export default function SeleccionTable({ selecciones = [] }) {
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "-";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Peso Prom.
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              ID Madre
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              ID Padre
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {selecciones.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No tienes animales en proceso de selección.
              </td>
            </tr>
          ) : (
            selecciones.map((seleccion) => {
              const ultimoPeso =
                seleccion.historial_pesos?.length > 0
                  ? seleccion.historial_pesos[
                      seleccion.historial_pesos.length - 1
                    ].peso
                  : "-";

              return (
                <tr
                  key={seleccion._id}
                  className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-2 text-[14px] text-black font-medium">
                    {seleccion.codigo}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {seleccion.lote_origen_id?.cantidad_total || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {ultimoPeso !== "-" ? `${ultimoPeso} kg` : "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {seleccion.lote_origen_id?.madre_id?.codigo || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {seleccion.lote_origen_id?.padre_id?.codigo || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {formatearFecha(seleccion.createdAt)}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button className="text-gray-400 hover:text-black transition-colors cursor-pointer">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
