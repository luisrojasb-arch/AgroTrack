import { Check, Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

export default function CelosTable({
  celos = [],
  onConfirmar,
  onEdit,
  onDelete,
}) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Fecha de Celo
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Próximo Celo (21D)
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Notas
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {celos.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No hay registros de celos actualmente.
              </td>
            </tr>
          ) : (
            celos.map((celo) => (
              <tr
                key={celo._id}
                className="border-b border-border-agro hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 text-[14px] text-black">
                  {celo.codigo}
                </td>
                <td className="py-4 px-2 text-[14px] text-black font-medium">
                  {celo.nombre}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {celo.fecha_celo}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {celo.proximo_celo}
                </td>
                <td className="py-4 px-2 text-[14px] text-gray-600">
                  {celo.notas}
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      {
                        label: "Confirmar Preñez",
                        icono: <Check size={16} className="text-primary" />,
                        accion: () => onConfirmar(celo),
                      },
                      {
                        label: "Editar",
                        icono: <Edit size={16} />,
                        accion: () => onEdit(celo),
                      },
                      {
                        label: "Eliminar",
                        icono: <Trash2 size={16} />,
                        esDestructivo: true,
                        accion: () => onDelete(celo),
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
