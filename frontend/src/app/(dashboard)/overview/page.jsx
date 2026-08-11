import OverviewHeader from '@/components/overview/OverviewHeader';
import OverviewStats from '@/components/overview/OverviewStats';
import { getSession } from '@/actions/auth.actions';
import {getAlertasDashboardAction, getDashboardGeneralAction} from '@/actions/finca.actions';
export default async function OverviewPage() {
  const dashboard = await getDashboardGeneralAction();
  const info_animales = await getAlertasDashboardAction({page: 1, limit: 5});
  console.log(dashboard);
  console.log(info_animales);
  const user = await getSession();
  console.log(user);
  console.log(info_animales);
  return (
    <div>
      <OverviewHeader name={user.nombre} />
      <OverviewStats stats={3} />
    </div>
    
  );
}