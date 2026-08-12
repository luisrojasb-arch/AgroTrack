import OverviewDonutGraph from '@/components/overview/OverviewDonutGraph';
import OverviewList from '@/components/overview/OverviewList';


export default function OverviewDataSect1({ datagraph, datalist }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <OverviewList data={datalist} />
      <OverviewDonutGraph data={datagraph} />
      
    </div>
  );
}