import Button from "@/components/ui/Button";

export default function ReproductionTableHeader({ activeTab, onAdd }) {
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "preneces":
        return "Registro de Preñez";
      case "nacimientos":
        return "Registro de Nacimiento";
      case "cipa":
        return "Tabla CIPA";
      default:
        return "Registro de Celo";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col">
        <h2 className="text-[24px] font-bold text-black leading-tight">
          {getHeaderTitle()}
        </h2>
        <p className="text-[14px] font-normal text-gray-agro mt-1">
          Administra tus animales de forma individual o en lote
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
        <Button
          variant="green"
          size="42"
          className="w-full sm:w-auto"
          onClick={onAdd}
        >
          Agregar Celo
        </Button>
      </div>
    </div>
  );
}
