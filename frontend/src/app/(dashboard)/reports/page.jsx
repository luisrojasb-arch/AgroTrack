import ReportesContainer from "@/components/reports/ReportesContainer";
export const metadata = {
  title: "Reportes | AgroTrack",
  description: "Generación de informes y análisis de datos de la finca.",
};

/**
 * @description Página principal del módulo de reportes de la finca.
 */

export default function ReportsPage() {
  return (
    <div>
      <ReportesContainer/>
    </div>
  );
}