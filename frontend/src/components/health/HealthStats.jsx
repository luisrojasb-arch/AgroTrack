import { getEstadisticasSaludAction } from "@/actions/salud.actions";
import StatCard from "@/components/layout/StatCard"; 

/**
 * @description Tarjetas de resumen estadístico para el módulo de salud.
 * @param {Object} props - Objeto con las estadísticas.
 */

export default async function HealthStats() {
  const response = await getEstadisticasSaludAction();
  
  const stats = response?.success ? response.data  : { pendientes: 0, vencidos: 0, completados: 0, total: 0 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <StatCard 
        title="Pendientes" 
        value={stats.pendientes} 
        subtitle="Seguimientos Pendientes" 
      />
      <StatCard 
        title="Vencidos" 
        value={stats.vencidos} 
        subtitle="Seguimientos Vencidos" 
      />
      <StatCard 
        title="Completados" 
        value={stats.completados} 
        subtitle="Seguimientos Completados" 
      />
      <StatCard 
        title="Total" 
        value={stats.total} 
        subtitle="Total de Seguimientos" 
      />
    </div>
  );
}