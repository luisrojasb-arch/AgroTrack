import { Eye, Edit, ClipboardList, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

export default function LotesTable({ lotes = [], onView, onEdit, onDelete }) {
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
              Machos
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Hembras
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
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {lotes.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No tienes lotes registrados en esta finca aún.
              </td>
            </tr>
          ) : (
            lotes.map((lote) => (
              <tr
                key={lote._id}
                className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 text-[14px] text-black font-medium">
                  {lote.codigo_lote}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {lote.cantidad_total || "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {lote.cantidad_machos || "0"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {lote.cantidad_hembras || "0"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {lote.peso_promedio ? `${lote.peso_promedio} kg` : "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {lote.madre_id ? lote.madre_id.codigo : "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {lote.padre_id ? lote.padre_id.codigo : "-"}
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      {
                        label: "Ver Detalles",
                        icono: <Eye size={16} />,
                        accion: () => onView(lote._id),
                      },
                      {
                        label: "Editar",
                        icono: <Edit size={16} />,
                        accion: () => onEdit(lote),
                      },
                      {
                        label: "Situaciones",
                        icono: <ClipboardList size={16} />,
                        accion: () => console.log("Situaciones lote", lote._id),
                      },
                      {
                        label: "Eliminar",
                        icono: <Trash2 size={16} />,
                        esDestructivo: true,
                        accion: () => onDelete(lote),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
