"use client";

import { useMemo } from "react";
import TablaGenerica from "./TablaGenerica";

const SHORT_MONTHS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * @description Tabla de registros CIPA (Inseminación Artificial).
 */

export default function CipaTable() {
  const generarTabla = (diasAAgregar) => {
    const filas = [];
    for (let dia = 1; dia <= 31; dia++) {
      const filaMeses = [];
      for (let mes = 0; mes < 12; mes++) {
        if (dia > DAYS_IN_MONTH[mes]) {
          filaMeses.push(null);
        } else {
          const fechaBase = new Date(2023, mes, dia);
          fechaBase.setDate(fechaBase.getDate() + diasAAgregar);

          filaMeses.push({
            diaServicio: dia,
            diaResultado: fechaBase.getDate(),
            mesResultado: SHORT_MONTHS[fechaBase.getMonth()],
          });
        }
      }
      filas.push(filaMeses);
    }
    return filas;
  };

  const tabla21Dias = useMemo(() => generarTabla(21), []);
  const tabla114Dias = useMemo(() => generarTabla(114), []);

  return (
    <div className="flex flex-col gap-10">
      <TablaGenerica
        titulo="Tabla para chequeo de repetición de servicio (21 días)"
        descripcion="Fecha de repetición esperada del celo = fecha de servicio + 21 días."
        datos={tabla21Dias}
        labelResultado="Repet."
      />

      <TablaGenerica
        titulo="Tabla de gestación de la cerda (114 días)"
        descripcion="Fecha probable de parto = fecha de servicio + 114 días."
        datos={tabla114Dias}
        labelResultado="Parto"
      />
    </div>
  );
}
