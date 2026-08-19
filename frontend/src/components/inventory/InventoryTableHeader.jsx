import Button from "@/components/ui/Button";

/**
 * @description Encabezado de la tabla de inventario con botón de registro.
 * @param {Object} props
 * @param {Function} props.onAddArticle - Función para abrir creación.
 */

export default function InventoryTableHeader({ onAddArticle }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col">
        <h2 className="text-[24px] font-bold text-black leading-tight">
          Registro de Inventario
        </h2>
        <p className="text-[14px] font-normal text-gray-agro mt-1">
          Administra los artículos de tu finca
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
        <Button
          variant="green"
          size="42"
          className="w-full sm:w-auto"
          onClick={onAddArticle}
        >
          Agregar Artículo
        </Button>
      </div>
    </div>
  );
}