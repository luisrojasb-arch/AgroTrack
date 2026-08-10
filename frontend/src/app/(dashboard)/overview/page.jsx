import OverviewHeader from '@/components/overview/OverviewHeader';
import OverviewStats from '@/components/overview/OverviewStats';
import { getSession } from '@/actions/auth.actions';
import {getAnimalesAction} from '@/actions/animal.actions';

export default async function OverviewPage() {

  const info_animales = await getAnimalesAction({page: 1, limit: 100, search: "", sexo: "Todos"}); 
  const user = await getSession();
  console.log(user);
  console.log(info_animales);
  return (
    <div>
      <OverviewHeader name={user.nombre} />
      <OverviewStats stats={info_animales.data.paginacion.totalRegistros} />
    </div>
    
  );
}