import { Eye, Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

export default function SeleccionTable({
  selecciones = [],
  onView,
  onEdit,
  onDelete,
  userRole,
}) {
  const isVeterinario = userRole?.toLowerCase() === "veterinario";

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "-";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calcularPesoPromedio = (animales) => {
    if (!animales || animales.length === 0) return "-";
    let suma = 0;
    animales.forEach((a) => {
      const ultimoPeso =
        a.historial_pesos?.length > 0
          ? a.historial_pesos[a.historial_pesos.length - 1].peso
          : a.peso_inicial;
      suma += ultimoPeso || 0;
    });
    return (suma / animales.length).toFixed(1) + " kg";
  };

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Código Grupo
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
                No tienes grupos de selección registrados.
              </td>
            </tr>
          ) : (
            selecciones.map((grupo) => {
              let opcionesMenu = [
                {
                  label: "Ver Detalles",
                  icono: <Eye size={16} />,
                  accion: () => onView(grupo._id),
                },
              ];

              if (!isVeterinario) {
                opcionesMenu.push(
                  {
                    label: "Editar Grupo",
                    icono: <Edit size={16} />,
                    accion: () => onEdit(grupo),
                  },
                  {
                    label: "Eliminar Grupo",
                    icono: <Trash2 size={16} />,
                    esDestructivo: true,
                    accion: () => onDelete(grupo),
                  },
                );
              }

              return (
                <tr
                  key={grupo._id}
                  className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-2 text-[14px] text-black font-medium">
                    {grupo.codigo_grupo}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {grupo.animales?.length || 0}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {calcularPesoPromedio(grupo.animales)}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {grupo.lote_origen_id?.madre_id?.codigo || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {grupo.lote_origen_id?.padre_id?.codigo || "-"}
                  </td>
                  <td className="py-4 px-2 text-[14px] text-black">
                    {formatearFecha(grupo.createdAt)}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <ActionMenu opciones={opcionesMenu} />
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
