"use client";

import Button from "@/components/ui/Button";

/**
 * @description Formulario de configuración para filtrar, parametrizar y generar los reportes de la finca.
 * @param {Object} props
 * @param {Function} props.onSubmit - Función que procesa los parámetros de configuración.
 * @param {Object} props.initialValues - Valores iniciales del formulario.
 */

export default function ReporteConfigForm({
  reportesDisponibles,
  selectedReportId,
  onReportChange,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  onExportar,
  isLoading
}) {
  return (
    <div className="bg-white border border-border-agro rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-black">Configuración del Reporte</h2>
        <p className="text-[13px] text-gray-500 mt-1">
          Selecciona el tipo de reporte y rango de fechas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Selector de Tipo de Reporte */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Tipo de Reporte</label>
          <select
            value={selectedReportId}
            onChange={(e) => onReportChange(e.target.value)}
            className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white cursor-pointer"
          >
            {reportesDisponibles.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.title}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Desde */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <Button 
          variant="green" 
          onClick={onExportar} 
          disabled={isLoading}
          className="w-full sm:w-auto px-8"
        >
          {isLoading ? "Generando..." : "Exportar PDF"}
        </Button>
      </div>
    </div>
  );
}