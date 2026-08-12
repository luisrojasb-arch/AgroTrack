
import OverviewHeader from '@/components/overview/OverviewHeader';
import OverviewStats from '@/components/overview/OverviewStats';
import { getSession } from '@/actions/auth.actions';
import OverviewDataSect1 from '@/components/overview/OverviewDataSect1';
import {getAlertasDashboardAction, getDashboardGeneralAction} from '@/actions/finca.actions';
export default async function OverviewPage() {
  const dashboard = await getDashboardGeneralAction();
  const info_animales = await getAlertasDashboardAction({page: 1, limit: 5});
  const data_alertas = info_animales.data.alertas;
  const data_pag = info_animales.data.pagination;
  console.log(dashboard);
  console.log(info_animales);
  const user = await getSession();
  return (
    <div>
      <OverviewHeader name={user.nombre} />
      <OverviewStats stats={dashboard.data.tarjetas} />
      <OverviewDataSect1 
        datagraph={{male: 6, female: 7}} 
        datalist={[]} 
      />
    </div>
    
  );
}