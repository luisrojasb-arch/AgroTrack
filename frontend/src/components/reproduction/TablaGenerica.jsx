import { Fragment } from "react";

const MONTHS = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

export default function TablaGenerica({
  titulo,
  descripcion,
  datos,
  labelResultado,
}) {
  return (
    <div className="w-full">
      <h3 className="text-[18px] font-bold text-black leading-tight">
        {titulo}
      </h3>
      <p className="text-[14px] text-gray-500 mb-4">{descripcion}</p>

      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none border border-border-agro rounded-xl shadow-sm">
        <table className="w-full text-center border-collapse min-w-300 bg-white">
          <thead className="bg-[#E8F3EB] border-b border-border-agro">
            {/* Fila de Meses */}
            <tr>
              {MONTHS.map((mes, i) => (
                <th
                  key={i}
                  colSpan="2"
                  className="py-3 text-[12px] font-bold text-[#229A48] tracking-wider"
                >
                  {mes}
                </th>
              ))}
            </tr>
            <tr className="border-b border-border-agro bg-[#f4faf6]">
              {MONTHS.map((_, i) => (
                <Fragment key={`sub-${i}`}>
                  <th className="py-2 text-[11px] font-medium text-gray-500 w-[4%]">
                    Serv.
                  </th>
                  <th className="py-2 text-[11px] font-medium text-gray-500 w-[4%]">
                    {labelResultado}
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, indexFila) => (
              <tr
                key={indexFila}
                className="border-b border-[#F4F5F7] hover:bg-gray-50 transition-colors last:border-0"
              >
                {fila.map((celda, indexCol) => {
                  if (!celda) {
                    return (
                      <Fragment key={`empty-${indexFila}-${indexCol}`}>
                        <td className="py-2"></td>
                        <td className="py-2 border-r border-[#F4F5F7] last:border-r-0"></td>
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={`cell-${indexFila}-${indexCol}`}>
                      <td className="py-2 text-[13px] font-bold text-black">
                        {celda.diaServicio}
                      </td>
                      <td className="py-2 text-[13px] font-bold text-[#229A48] border-r border-[#F4F5F7] last:border-r-0">
                        {celda.diaResultado} {celda.mesResultado}
                      </td>
                    </Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
