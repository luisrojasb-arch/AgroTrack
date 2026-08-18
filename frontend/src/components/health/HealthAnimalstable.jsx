"use client";

export default function HealthAnimalstable({ data = [], onVerTareasClick, userRole }) {
  return (
    <div className="w-full bg-white rounded-3xl border border-border-agro shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-border-agro">
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Código</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Producto</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Dosis</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="p-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id || index} className="border-b border-border-agro last:border-b-0 hover:bg-gray-50">
                <td className="p-4 text-sm text-black font-medium">{item.codigo || "-"}</td>
                <td className="p-4 text-sm text-black">{item.nombre || "-"}</td>
                <td className="p-4 text-sm text-black">{item.fecha ? new Date(item.fecha).toLocaleDateString("es-ES") : "-"}</td>
                <td className="p-4 text-sm text-black">{item.tipo || "-"}</td>
                <td className="p-4 text-sm text-black">{item.producto || "-"}</td>
                <td className="p-4 text-sm text-black">{item.dosis || "-"}</td>
                <td className="p-4 text-sm text-black">{item.estado || "-"}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onVerTareasClick && onVerTareasClick(item)}
                    className="px-3 py-1.5 text-[12px] font-semibold text-black bg-white border border-border-agro rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                  >
                    Ver Tareas
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-6 text-center text-gray-400">No hay registros de salud individual para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}