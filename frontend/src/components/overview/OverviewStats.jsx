import StatCard from '@/components/layout/StatCard';

/**
 * @description Tarjetas de resumen estadístico global del Panel Principal.
 * @param {Object} props
 * @param {Object} props.stats - Datos consolidados.
 */

export default function OverviewStats({ stats }) {    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total de animales" value={stats.animales_activos} subtitle="Activos" />
            <StatCard title="Alertas pendientes" value={stats.alertas_pendientes} subtitle="Por atender" />
            <StatCard title="Gastos del mes" value={stats.gastos_mes} subtitle="Actual" />
            <StatCard title="Ingresos del mes" value={stats.ingresos_mes} subtitle="Actual" />
        </div>
    );
}