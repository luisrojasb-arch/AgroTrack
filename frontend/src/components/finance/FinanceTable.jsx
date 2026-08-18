import { Eye, Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

export default function FinanceTable({ transacciones = [], onView, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className="border-b border-border-agro">
            {["Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Acciones"].map((h) => (
              <th key={h} className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transacciones.map((item) => (
            <tr key={item.id || item._id} className="border-b border-[#F4F5F7] hover:bg-gray-50">
              <td className="py-4 px-2 text-[14px] text-black text-center">{item.fecha}</td>
              <td className="py-4 px-2 text-[14px] text-black font-medium text-center">{item.tipo}</td>
              <td className="py-4 px-2 text-[14px] text-black text-center">{item.categoria}</td>
              <td className="py-4 px-2 text-[14px] text-black">{item.descripcion}</td>
              <td className="py-4 px-2 text-[14px] font-medium text-center">
                {/* Imprimimos el monto directamente, el backend ya manda el formato y el signo "-" */}
                <span className={item.tipo === "Egreso" ? "text-red-500" : "text-green-600"}>
                  {item.monto}
                </span>
              </td>
              <td className="py-4 px-2 text-center">
                <ActionMenu opciones={[
                  { label: "Ver Detalles", icono: <Eye size={16} />, accion: () => onView(item) },
                  { label: "Editar", icono: <Edit size={16} />, accion: () => onEdit(item) },
                  { label: "Eliminar", icono: <Trash2 size={16} />, esDestructivo: true, accion: () => onDelete(item) },
                ]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}