"use client";

export default function FinanceExpenseBreakdown({ data = [] }) {

  const totalGastos = data.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);


  const formatMoney = (amount) => {
    return `$${Number(amount).toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="bg-white border border-border-agro rounded-3xl p-6 shadow-sm flex flex-col w-full h-full min-h-[300px]">
      
      <div className="mb-8">
        <h3 className="text-[20px] font-bold text-black leading-tight mb-1">
          Desglose de Gastos
        </h3>
        <p className="text-[14px] text-gray-400">
          Distribución de costos por categoría
        </p>
      </div>

      <div className="flex flex-col gap-5 flex-grow justify-top">
        {data.length > 0 ? (
          data.map((item, index) => {
            // Porcentaje
            const percentage = totalGastos > 0 ? (item.value / totalGastos) * 100 : 0;

            return (
              <div key={index} className="flex items-center justify-between w-full">
                
                <span className="text-[14px] font-medium text-black w-1/3 truncate pr-2">
                  {item.label}
                </span>

                <div className="flex-grow flex items-center justify-center px-4">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#157937] h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <span className="text-[14px] text-black text-right w-1/4 whitespace-nowrap">
                  {formatMoney(item.value)}
                </span>
                
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-gray-400 w-full">
            No hay gastos registrados para desglosar.
          </div>
        )}
      </div>

    </div>
  );
}