import AnimalsHeader from "@/components/animals/AnimalsHeader";
import AnimalsStats from "@/components/animals/AnimalsStats";
import AnimalsTableContainer from "@/components/animals/AnimalsTableContainer";
import {
  getEstadisticasAnimalesAction,
  getAnimalesAction,
} from "@/actions/animal.actions";
import { getLotesAction } from "@/actions/lote.actions";
import { getSeleccionesAction } from "@/actions/seleccion.actions";

export const metadata = {
  title: "Animales | AgroTrack",
  description: "Gestión de animales y ganado porcino.",
};

export default async function AnimalsPage(props) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page || 1;
  const search = searchParams?.search || "";
  const filter = searchParams?.filter || "";
  const tab = searchParams?.tab || "individuales";

  const statsPromise = getEstadisticasAnimalesAction();

  let tablePromise;
  if (tab === "lotes") {
    tablePromise = getLotesAction({ page, limit: 10, search });
  } else if (tab === "madre") {
    tablePromise = getSeleccionesAction({
      page,
      limit: 10,
      search,
      estado: filter || "Todos",
    });
  } else {
    tablePromise = getAnimalesAction({ page, limit: 10, search, sexo: filter });
  }

  const [statsResponse, tableResponse] = await Promise.all([
    statsPromise,
    tablePromise,
  ]);

  const estadisticas = statsResponse.success ? statsResponse.data : null;
  const tablaDatos = tableResponse.success ? tableResponse.data : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AnimalsHeader />
      <AnimalsStats stats={estadisticas} />
      <AnimalsTableContainer initialData={tablaDatos} activeTab={tab} />
    </div>
  );
}
