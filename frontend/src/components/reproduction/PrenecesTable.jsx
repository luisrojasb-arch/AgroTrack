import { Check, Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

/**
 * @description Tabla de seguimiento de preñeces.
 * @param {Object} props - Data y handlers.
 */

export default function PrenecesTable({
  preneces = [],
  onConfirmar,
  onEdit,
  onDelete,
}) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-225">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Madre
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Padrote
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Fecha Servicio
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Método Detección
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Parto Probable
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {preneces.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No hay registros de preñeces.
              </td>
            </tr>
          ) : (
            preneces.map((prenez) => (
              <tr
                key={prenez._id}
                className="border-b border-border-agro hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 text-[14px] text-black font-medium">
                  {prenez.madre}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {prenez.padrote}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {prenez.fecha_servicio}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {prenez.metodo_deteccion}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {prenez.parto_probable}
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      {
                        label: "Confirmar Nacimiento",
                        icono: <Check size={16} className="text-primary" />,
                        accion: () => onConfirmar(prenez),
                      },
                      {
                        label: "Editar",
                        icono: <Edit size={16} />,
                        accion: () => onEdit(prenez),
                      },
                      {
                        label: "Eliminar",
                        icono: <Trash2 size={16} />,
                        esDestructivo: true,
                        accion: () => onDelete(prenez),
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
