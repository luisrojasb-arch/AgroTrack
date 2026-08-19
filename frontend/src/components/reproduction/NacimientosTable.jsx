import { Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

/**
 * @description Tabla de listado de nacimientos y destetes.
 * @param {Object} props - Data y handlers.
 */

export default function NacimientosTable({
  nacimientos = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-250">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Madre
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Padrote
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Fecha Parto
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Vivos
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Muertos
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              M / H
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Peso Prom.
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {nacimientos.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No hay registros de nacimientos.
              </td>
            </tr>
          ) : (
            nacimientos.map((nacimiento) => (
              <tr
                key={nacimiento._id}
                className="border-b border-border-agro hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 text-[14px] text-black font-medium">
                  {nacimiento.madre}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.padrote}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.fecha_parto}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.tipo}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.vivos}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.muertos}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.machos} / {nacimiento.hembras}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {nacimiento.peso_promedio}kg
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      {
                        label: "Editar",
                        icono: <Edit size={16} />,
                        accion: () => onEdit(nacimiento),
                      },
                      {
                        label: "Eliminar",
                        icono: <Trash2 size={16} />,
                        esDestructivo: true,
                        accion: () => onDelete(nacimiento),
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
