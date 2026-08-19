import ReproductionHeader from "@/components/reproduction/ReproductionHeader";
import ReproductionStats from "@/components/reproduction/ReproductionStats";
import ReproductionTableContainer from "@/components/reproduction/ReproductionTableContainer";

import {
  getEstadisticasReproduccionAction,
  getCelosAction,
  getPrenecesAction,
  getNacimientosAction,
} from "@/actions/reproduction.actions";

export const metadata = {
  title: "Reproducción | AgroTrack",
  description: "Gestión de ciclo reproductivo y nacimientos.",
};

/**
 * @description Página del módulo de Reproducción de la finca.
 * @param {Object} props - Propiedades de Next.js (params, searchParams).
 */

export default async function ReproductionPage(props) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page || 1;
  const search = searchParams?.search || "";
  const filter = searchParams?.filter || "";
  const tab = searchParams?.tab || "celos";

  const statsPromise = getEstadisticasReproduccionAction();

  let tablePromise;
  if (tab === "preneces") {
    tablePromise = getPrenecesAction({ page, limit: 10, search, filter });
  } else if (tab === "nacimientos") {
    tablePromise = getNacimientosAction({ page, limit: 10, search, filter });
  } else if (tab === "cipa") {
    tablePromise = Promise.resolve({ success: true, data: null });
  } else {
    tablePromise = getCelosAction({ page, limit: 10, search, filter });
  }

  const [statsResponse, tableResponse] = await Promise.all([
    statsPromise,
    tablePromise,
  ]);

  const estadisticas = statsResponse.success ? statsResponse.data : null;
  const tablaDatos = tableResponse.success ? tableResponse.data : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <ReproductionHeader />
      <ReproductionStats stats={estadisticas} />
      <ReproductionTableContainer initialData={tablaDatos} activeTab={tab} />
    </div>
  );
}
