import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

/**
 * @description Gráfico de barras genérico basado en Chart.js.
 * @param {Object} props
 * @param {Object} props.data - Configuración de datasets de Chart.js.
 * @param {Object} props.options - Opciones de configuración del gráfico.
 */

export default function BarGraph({ data, options }) {
  return (
    <div className="relative w-full h-full min-h-[250px] flex-grow">
      <Bar data={data} options={options} />
    </div>
  );
}