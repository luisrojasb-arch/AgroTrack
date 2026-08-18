export default function HealthAnimalsTable({ data = [], onVerTareasClick }) {
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[var(--color-border-agro)] shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-[var(--color-border-agro)]">
            <th className="p-4 text-[12px] font-bold text-[var(--color-gray-agro)] uppercase tracking-wider">
              Código
            </th>
            <th className="p-4 text-[12px] font-bold text-[var(--color-gray-agro)] uppercase tracking-wider">
              Progreso
            </th>
            <th className="p-4 text-[12px] font-bold text-[var(--color-gray-agro)] uppercase tracking-wider">
              Próxima Tarea
            </th>
            <th className="p-4 text-[12px] font-bold text-[var(--color-gray-agro)] uppercase tracking-wider">
              Fecha
            </th>
            <th className="p-4 text-[12px] font-bold text-[var(--color-gray-agro)] uppercase tracking-wider">
              Estado
            </th>
            <th className="p-4 text-[12px] font-bold text-[var(--color-gray-agro)] uppercase tracking-wider text-center">
              Acciones
            </th>
          </tr>
        </thead>
        
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-[var(--color-border-agro)] last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-sm text-black font-medium">
                  {item.codigo || "-"}
                </td>
                <td className="p-4 text-sm text-black font-medium">
                  {item.progreso || "-"}
                </td>
                <td className="p-4 text-sm text-black font-medium">
                  {item.proxima_tarea || "-"}
                </td>
                <td className="p-4 text-sm text-black font-medium">
                  {formatearFecha(item.fecha)}
                </td>
                <td className="p-4 text-sm text-black font-medium">
                  {item.estado || "-"}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onVerTareasClick && onVerTareasClick(item)}
                    className="px-3 py-1.5 text-[12px] font-semibold text-black bg-white border border-[var(--color-border-agro)] rounded-lg hover:bg-[var(--color-bg-nav)] transition-colors shadow-sm cursor-pointer"
                  >
                    Ver Tareas
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-6 text-center text-[var(--color-gray-agro-muted)]">
                No hay registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}