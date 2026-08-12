import UsersHeader from "@/components/users/UsersHeader";
import UsersStats from "@/components/users/UsersStats";
import UsersTableContainer from "@/components/users/UsersTableContainer";
import {
  getEstadisticasUsuariosAction,
  getUsuariosAction,
} from "@/actions/user.actions";

export const metadata = {
  title: "Usuarios | AgroTrack",
  description: "Gestión de usuarios y permisos del sistema.",
};

export default async function UsersPage(props) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page || 1;
  const search = searchParams?.search || "";
  const filter = searchParams?.filter || "";

  const statsPromise = getEstadisticasUsuariosAction();
  const tablePromise = getUsuariosAction({
    page,
    limit: 10,
    search,
    rol: filter,
  });

  const [statsResponse, tableResponse] = await Promise.all([
    statsPromise,
    tablePromise,
  ]);

  const backendStats = statsResponse?.success
    ? statsResponse.data.estadisticas
    : null;
  const estadisticas = backendStats
    ? {
        total: backendStats.total_usuarios,
        admin: backendStats.administradores,
        trabajadores: backendStats.trabajadores,
        veterinarios: backendStats.veterinarios,
      }
    : null;

  const backendTable = tableResponse?.success ? tableResponse.data : null;
  const tablaDatos = backendTable
    ? {
        usuarios: backendTable.miembros,
        paginacion: backendTable.paginacion,
      }
    : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <UsersHeader />
      <UsersStats stats={estadisticas} />
      <UsersTableContainer initialData={tablaDatos} />
    </div>
  );
}
