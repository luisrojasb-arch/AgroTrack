import OverviewHeader from "@/components/overview/OverviewHeader";
import OverviewStats from "@/components/overview/OverviewStats";
import { getSession } from "@/actions/auth.actions";
import OverviewDataSect1 from "@/components/overview/OverviewDataSect1";
import OverviewDataSect2 from "@/components/overview/OverviewDataSect2";
import {
  getAlertasDashboardAction,
  getDashboardGeneralAction,
} from "@/actions/finca.actions";



export default async function OverviewPage() {
  const dashboard = await getDashboardGeneralAction();
  const info_animales = await getAlertasDashboardAction({ page: 1, limit: 5 });
 
  console.log(dashboard.data.ingresos_vs_gastos);
  const user = await getSession();
  return (
    <div className="flex flex-col gap-6 w-full">
      <OverviewHeader name={user.nombre} />
      <OverviewStats stats={dashboard.data.tarjetas} />
      <OverviewDataSect1
        datagraph={dashboard.data}
        datalist={info_animales.data}
      />
      <OverviewDataSect2 
        datagraph1={dashboard.data}

      />
    </div>
  );
}
