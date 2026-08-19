import OverviewDonutGraph from '@/components/overview/OverviewDonutGraph';
import OverviewList from '@/components/overview/OverviewList';

/**
 * @description Primera sección de datos del Overview (Gráficos principales).
 * @param {Object} props
 * @param {Array} props.datagraph - Datos del gráfico principal.
 * @param {Array} props.datalist - Datos de la lista lateral.
 */

export default function OverviewDataSect1({ datagraph, datalist }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <OverviewList data={datalist} />
      <OverviewDonutGraph data={datagraph} />
      
    </div>
  );
}