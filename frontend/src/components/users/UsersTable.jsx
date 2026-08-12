import { Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

export default function UsersTable({ usuarios = [], onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Correo Electrónico
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Último Acceso
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No hay usuarios registrados que coincidan con la búsqueda.
              </td>
            </tr>
          ) : (
            usuarios.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 text-[14px] text-black font-medium">
                  {user.nombre || "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-gray-600">
                  {user.correo || "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {user.rol || "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-gray-600">
                  {user.ultimo_acceso || "-"}
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      {
                        label: "Editar",
                        icono: <Edit size={16} />,
                        accion: () => onEdit(user),
                      },
                      {
                        label: "Eliminar",
                        icono: <Trash2 size={16} />,
                        esDestructivo: true,
                        accion: () => onDelete(user),
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
