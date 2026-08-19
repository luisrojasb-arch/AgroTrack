"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BarChart2, HeartPulse, DollarSign, Package, Activity, Calendar } from "lucide-react";

import ReporteHeader from "@/components/reports/ReporteHeader";
import ReporteCardContainer from "@/components/reports/ReporteCardContainer";
import ReporteCard from "@/components/reports/ReporteCard";
import ReporteConfigForm from "@/components/reports/ReporteConfigForm";

import {
  getDatosProduccionAction,
  getDatosSaludAction,
  getDatosFinancieroAction,
  getDatosInventarioAction,
  getDatosReproductivoAction,
  getDatosAnualAction
} from "@/actions/reportes.actions";

const REPORTES_LIST = [
  { id: "produccion", title: "Resumen de Producción", description: "Métricas y tendencias de producción", icon: BarChart2 },
  { id: "salud", title: "Análisis de Salud", description: "Cobertura de vacunas y tratamientos", icon: HeartPulse },
  { id: "financiero", title: "Reporte Financiero", description: "Ingresos, gastos y rentabilidad", icon: DollarSign },
  { id: "inventario", title: "Estado del Inventario", description: "Niveles de stock y consumo", icon: Package },
  { id: "reproductivo", title: "Rendimiento Reproductivo", description: "Tasas de éxito y partos", icon: Activity },
  { id: "anual", title: "Resumen Anual", description: "Reporte integral de fin de año", icon: Calendar },
];

export default function ReportesContainer() {
  const [selectedReportId, setSelectedReportId] = useState(REPORTES_LIST[0].id);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExportarPDF = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error("Por favor selecciona un rango de fechas (Desde y Hasta).");
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.error("La fecha 'Desde' no puede ser mayor que 'Hasta'.");
      return;
    }

    setIsLoading(true);
    const payload = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };
    let response;

    try {
      switch (selectedReportId) {
        case "produccion":
          response = await getDatosProduccionAction(payload);
          break;
        case "salud":
          response = await getDatosSaludAction(payload);
          break;
        case "financiero":
          response = await getDatosFinancieroAction(payload);
          break;
        case "inventario":
          response = await getDatosInventarioAction(payload);
          break;
        case "reproductivo":
          response = await getDatosReproductivoAction(payload);
          break;
        case "anual":
          response = await getDatosAnualAction({ anio: new Date(fechaInicio).getFullYear() });
          break;
        default:
          throw new Error("Reporte no válido");
      }

      if (response.success) {
        toast.success("Datos obtenidos. Construyendo PDF...");
        console.log("Data para el PDF en JSON crudo:", response.data);
        
      
        
      } else {
        toast.error(response.error || "Error al obtener datos del servidor");
      }
    } catch (error) {
      toast.error("Hubo un problema al generar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <ReporteHeader />

      <ReporteCardContainer>
        {REPORTES_LIST.map((reporte) => (
          <ReporteCard
            key={reporte.id}
            title={reporte.title}
            description={reporte.description}
            icon={reporte.icon}
            isSelected={selectedReportId === reporte.id}
            onClick={() => setSelectedReportId(reporte.id)}
          />
        ))}
      </ReporteCardContainer>

      <ReporteConfigForm
        reportesDisponibles={REPORTES_LIST}
        selectedReportId={selectedReportId}
        onReportChange={setSelectedReportId} 
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        onExportar={handleExportarPDF}
        isLoading={isLoading}
      />
    </div>
  );
}