import { Eye, Edit, Trash2, ArrowRightLeft } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

/**
 * @description Tabla de listado de artículos del inventario.
 * @param {Object} props - Propiedades de tabla (data y handlers).
 */

export default function InventoryTable({
  articulos = [],
  onView,
  onEdit,
  onAdjust,
  onDelete,
}) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Código</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Nombre</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Categoría</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Cantidad</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Stock Min</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Costo</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase">Estado</th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-12 text-center text-gray-500 text-[14px]">
                No tienes artículos registrados.
              </td>
            </tr>
          ) : (
            articulos.map((item) => (
              <tr key={item.id} className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2 text-[14px] text-black">
                  <div className="flex items-center gap-2">{item.codigo}</div>
                </td>
                <td className="py-4 px-2 text-[14px] text-black font-medium">{item.nombre || "-"}</td>
                <td className="py-4 px-2 text-[14px] text-black">{item.categoria}</td>
                <td className="py-4 px-2 text-[14px] text-black">{item.cantidad} {item.unidad || ""}</td>
                <td className="py-4 px-2 text-[14px] text-black">{item.stock_min}</td>
                <td className="py-4 px-2 text-[14px] text-black">{item.costo}</td>
                <td className="py-4 px-2 text-[14px]">
                  {item.estado === "Disponible" ? (
                    <span className="text-green-600 font-medium">{item.estado}</span>
                  ) : (
                    <span className="text-red-500 font-medium">{item.estado}</span>
                  )}
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      { label: "Ver Detalles", icono: <Eye size={16} />, accion: () => onView(item.id) },
                      { label: "Editar", icono: <Edit size={16} />, accion: () => onEdit(item.id) },
                      { label: "Ajustar Stock", icono: <ArrowRightLeft size={16} />, accion: () => onAdjust(item) },
                      { label: "Eliminar", icono: <Trash2 size={16} />, esDestructivo: true, accion: () => onDelete(item) },
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