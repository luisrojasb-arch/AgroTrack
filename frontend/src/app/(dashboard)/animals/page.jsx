import AnimalsHeader from "@/components/animals/AnimalsHeader";
import AnimalsStats from "@/components/animals/AnimalsStats";
import AnimalsTableContainer from "@/components/animals/AnimalsTableContainer";
import {
  getEstadisticasAnimalesAction,
  getAnimalesAction,
} from "@/actions/animal.actions";
import { getLotesAction } from "@/actions/lote.actions";
import {
  getSeleccionesAction,
  getSeleccionDashboardAction,
} from "@/actions/seleccion.actions";
import { getSession } from "@/actions/auth.actions";

export const metadata = {
  title: "Animales | AgroTrack",
  description: "Gestión de animales y ganado porcino.",
};

/**
 * @description Página principal del módulo de Animales de la finca.
 * @param {Object} props - Propiedades de Next.js (params, searchParams).
 */

export default async function AnimalsPage(props) {
  const searchParams = await props.searchParams;

  const session = await getSession();
  const userRole = session?.rol || "";

  const page = searchParams?.page || 1;
  const search = searchParams?.search || "";
  const filter = searchParams?.filter || "";
  const tab = searchParams?.tab || "individuales";

  const statsPromise = getEstadisticasAnimalesAction();

  let tablePromise;
  let dashboardPromise = Promise.resolve(null);

  if (tab === "lotes") {
    tablePromise = getLotesAction({ page, limit: 10, search });
  } else if (tab === "madre") {
    tablePromise = getSeleccionesAction({
      page,
      limit: 10,
      search,
      estado: filter || "Todos",
    });
    dashboardPromise = getSeleccionDashboardAction();
  } else {
    tablePromise = getAnimalesAction({ page, limit: 10, search, sexo: filter });
  }

  const [statsResponse, tableResponse, dashboardResponse] = await Promise.all([
    statsPromise,
    tablePromise,
    dashboardPromise,
  ]);

  const estadisticas = statsResponse.success ? statsResponse.data : null;

  const tablaDatos = tableResponse.success ? { ...tableResponse.data } : {};
  if (tab === "madre" && dashboardResponse?.success) {
    tablaDatos.seleccionDashboard = dashboardResponse.data;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <AnimalsHeader />
      <AnimalsStats stats={estadisticas} />
      <AnimalsTableContainer
        initialData={tablaDatos}
        activeTab={tab}
        userRole={userRole}
      />
    </div>
  );
}
