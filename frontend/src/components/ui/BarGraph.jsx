import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function BarGraph({ data, options }) {
  return (
    // Es crucial este div con position relative y flex-grow para que ChartJS sea responsivo
    <div className="relative w-full h-full min-h-[250px] flex-grow">
      <Bar data={data} options={options} />
    </div>
  );
}