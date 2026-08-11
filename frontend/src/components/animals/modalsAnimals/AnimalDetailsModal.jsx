"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
    <span className="text-[13px] font-semibold text-gray-500">{title}</span>
    <span className="text-[15px] text-black font-medium">{value || "-"}</span>
  </div>
);

export default function AnimalDetailsModal({ isOpen, onClose, data }) {
  if (!data || !data.datos_basicos) return null;

  const animal = data.datos_basicos;
  const stats = data.estadisticas_reproductivas;
  const ciclos = data.historial_ciclos || [];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const detailsFooter = (
    <Button variant="green" onClick={onClose} className="w-full sm:w-auto">
      Cerrar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Animal"
      description="Información completa del animal"
      width="max-w-3xl"
      footer={detailsFooter}
    >
      <div className="flex flex-col gap-6 mt-2 px-6 pb-2">
        <h3 className="text-[18px] font-bold text-center text-black">
          Código {animal.codigo} {animal.nombre ? `(${animal.nombre})` : ""}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard title="Sexo" value={animal.sexo} />
          <InfoCard title="Raza" value={animal.raza} />
          <InfoCard
            title="Peso"
            value={animal.peso ? `${animal.peso} kg` : "-"}
          />
          <InfoCard title="Estado" value={animal.estado} />
          <InfoCard
            title="Fecha nacimiento"
            value={formatDate(animal.fecha_nacimiento)}
          />
          <InfoCard title="Pezones" value={animal.cantidad_pezones} />
        </div>

        <div className="flex flex-col gap-1 border border-border-agro rounded-xl p-4 bg-white">
          <span className="text-[13px] font-semibold text-gray-500">Notas</span>
          <span className="text-[15px] text-black">
            {animal.nota || "Sin notas adicionales."}
          </span>
        </div>

        {stats && (
          <div className="flex flex-col gap-4 mt-2">
            <h4 className="text-[16px] font-bold text-black">
              Estadísticas Reproductivas
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard title="Total ciclos" value={stats.total_ciclos} />
              <InfoCard title="Partos" value={stats.partos} />
              <InfoCard title="Lechones vivos" value={stats.lechones_vivos} />
              <InfoCard
                title="Lechones muertos"
                value={stats.lechones_muertos}
              />
              <InfoCard title="Camada promedio" value={stats.camada_promedio} />
              <InfoCard
                title="Partos distócicos"
                value={stats.partos_distocicos}
              />
              <InfoCard title="Supervivencia" value={stats.supervivencia} />
              <InfoCard
                title="Utilidad reproductiva"
                value={stats.utilidad_reproductiva}
              />
            </div>

            {ciclos.length > 0 && (
              <div className="mt-4 w-full overflow-x-auto border border-border-agro rounded-xl">
                <table className="w-full text-left border-collapse min-w-150">
                  <thead>
                    <tr className="border-b border-border-agro bg-gray-50/50">
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Celo
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Servicio
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Parto
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Tipo
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Vivos
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Muertos
                      </th>
                      <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase">
                        Padrote
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ciclos.map((ciclo) => (
                      <tr
                        key={ciclo.id}
                        className="border-b border-border-agro last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-[13px]">
                          {formatDate(ciclo.celo)}
                        </td>
                        <td className="py-3 px-4 text-[13px]">
                          {formatDate(ciclo.servicio)}
                        </td>
                        <td className="py-3 px-4 text-[13px]">
                          {formatDate(ciclo.parto)}
                        </td>
                        <td className="py-3 px-4 text-[13px]">{ciclo.tipo}</td>
                        <td className="py-3 px-4 text-[13px]">{ciclo.vivos}</td>
                        <td className="py-3 px-4 text-[13px]">
                          {ciclo.muertos}
                        </td>
                        <td className="py-3 px-4 text-[13px]">
                          {ciclo.padrote}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
