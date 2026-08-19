import StatCard from "@/components/layout/StatCard";

export default function InventoryStats({ stats }) {
  const total = stats?.total_articulos || 0;
  const stockBajo = stats?.alertas_stock_bajo || 0;
  const vencidos = stats?.articulos_vencidos || 0;
  const valorTotal = stats?.valor_total || "$0 COP";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard title="Total de Artículos" value={total} subtitle="Artículos activos" />
      <StatCard title="Alertas Stock Bajo" value={stockBajo} subtitle="Necesitan reorden" />
      <StatCard title="Artículos Vencidos" value={vencidos} subtitle="Requiere remoción" />
      <StatCard title="Valor Total" value={valorTotal} subtitle="Inventario actual" />
    </div>
  );
}