import { Eye, Edit, ClipboardList, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";

const calcularEdad = (fecha) => {
  if (!fecha) return "-";

  const hoy = new Date();
  const nacimiento = new Date(fecha);
  const mesesTotales =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    hoy.getMonth() -
    nacimiento.getMonth();

  if (mesesTotales < 1) return "Menos de 1 mes";
  if (mesesTotales < 12)
    return `${mesesTotales} ${mesesTotales === 1 ? "Mes" : "Meses"}`;

  const anios = Math.floor(mesesTotales / 12);
  const mesesSobrantes = mesesTotales % 12;

  if (mesesSobrantes === 0) return `${anios} ${anios === 1 ? "Año" : "Años"}`;
  return `${anios} ${anios === 1 ? "Año" : "Años"} y ${mesesSobrantes} ${
    mesesSobrantes === 1 ? "Mes" : "Meses"
  }`;
};

export default function AnimalsTable({
  animales = [],
  onView,
  onEdit,
  onDelete,
  onSituation,
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
              Sexo
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Raza
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Edad
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Peso
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Pezones
            </th>
            <th className="py-4 px-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {animales.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="py-12 text-center text-gray-500 text-[14px]"
              >
                No tienes animales registrados en esta finca aún.
              </td>
            </tr>
          ) : (
            animales.map((animal) => (
              <tr
                key={animal._id}
                className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 text-[14px] text-black">
                  <div className="flex items-center gap-2">{animal.codigo}</div>
                </td>
                <td className="py-4 px-2 text-[14px] text-black font-medium">
                  {animal.nombre || "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {animal.sexo}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {animal.raza}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {calcularEdad(animal.fecha_nacimiento)}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {animal.peso ? `${animal.peso} kg` : "-"}
                </td>
                <td className="py-4 px-2 text-[14px] text-black">
                  {animal.sexo === "Hembra" ? animal.cantidad_pezones : "-"}
                </td>
                <td className="py-4 px-2 text-center">
                  <ActionMenu
                    opciones={[
                      {
                        label: "Ver Detalles",
                        icono: <Eye size={16} />,
                        accion: () => onView(animal._id),
                      },
                      {
                        label: "Editar",
                        icono: <Edit size={16} />,
                        accion: () => onEdit(animal),
                      },
                      {
                        label: "Situaciones",
                        icono: <ClipboardList size={16} />,
                        accion: () => onSituation(animal),
                      },
                      {
                        label: "Eliminar",
                        icono: <Trash2 size={16} />,
                        esDestructivo: true,
                        accion: () => onDelete(animal),
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
