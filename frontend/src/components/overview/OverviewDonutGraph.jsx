'use client'
import {Chart as ChartJS} from 'chart.js/auto'
import {Doughnut} from 'react-chartjs-2'
export default function OverviewDonutGraph({ data }) {
  return (
    <div className="bg-white rounded-3xl border border-(--color-border-agro) p-6 flex flex-col w-full h-full shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black mb-1">
          Distribución por Sexo
        </h2>
        <p className="text-(--color-gray-agro-muted) text-sm">
          Hembras vs machos (animales vivos)
        </p>
      </div>
      <div className="flex grow justify-center items-center w-full min-h-62.5 relative">
        <Doughnut
          data={{
            labels: ["Machos", "Hembras"],
            datasets: [
              {
                label: "Cantidad",
                data: [data.distribucion_sexo.machos, data.distribucion_sexo.hembras],
                backgroundColor: [
                  '#157937', 
                  '#0084ff', 
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  );
}