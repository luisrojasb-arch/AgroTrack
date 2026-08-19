import StatCard from "@/components/layout/StatCard";

/**
 * @description Tarjetas resumen de usuarios (Activos, Inactivos, Roles).
 * @param {Object} props
 * @param {Object} props.stats - Estadísticas de usuarios.
 */

export default function UsersStats({ stats }) {
  const total = stats?.total || 0;
  const admin = stats?.admin || 0;
  const trabajadores = stats?.trabajadores || 0;
  const veterinarios = stats?.veterinarios || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="Total de Usuarios"
        value={total}
        subtitle="Cuentas registradas"
      />
      <StatCard
        title="Administradores"
        value={admin}
        subtitle="Cuentas admin"
      />
      <StatCard
        title="Trabajadores"
        value={trabajadores}
        subtitle="Cuentas trabajadores"
      />
      <StatCard
        title="Veterinarios"
        value={veterinarios}
        subtitle="Cuentas veterinarios"
      />
    </div>
  );
}
