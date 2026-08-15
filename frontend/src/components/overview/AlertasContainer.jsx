import ListAlertElm from "@/components/overview/ListAlertElm";

export default function AlertasContainer({ alertas }) {
  return (
    <div className="overflow-hidden flex flex-col w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-black">Alertas Recientes</h2>
        <p className="text-sm text-(--color-gray-agro-muted)">
          Notificaciones importantes que requieren atención
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {alertas && alertas.length > 0 ? (
          alertas.map((alerta, index) => (
            <ListAlertElm key={index} data={alerta} />
          ))
        ) : (
          <div className="p-6 text-center text-(--color-gray-agro-muted)">
            No hay alertas para mostrar en esta página.
          </div>
        )}
      </div>
    </div>
  );
}
