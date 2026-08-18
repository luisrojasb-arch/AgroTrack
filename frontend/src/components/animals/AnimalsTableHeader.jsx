import Button from "@/components/ui/Button";

export default function AnimalsTableHeader({
  activeTab,
  onAddAnimal,
  onAddLote,
  onAddSeleccion,
  userRole,
}) {
  const isVeterinario = userRole?.toLowerCase() === "veterinario";

  const getHeaderContent = () => {
    switch (activeTab) {
      case "lotes":
        return {
          title: "Registro de Lotes",
          buttons: isVeterinario ? null : (
            <>
              <Button
                variant="white"
                size="42"
                className="w-full sm:w-auto"
                onClick={onAddLote}
              >
                Agregar Lote
              </Button>
              <Button
                variant="green"
                size="42"
                className="w-full sm:w-auto"
                onClick={onAddAnimal}
              >
                Agregar Animal
              </Button>
            </>
          ),
        };
      case "madre":
        return {
          title: "Registro de Selección de Madre",
          buttons: isVeterinario ? null : (
            <Button
              variant="green"
              size="42"
              className="w-full sm:w-auto"
              onClick={onAddSeleccion}
            >
              Agregar Selección
            </Button>
          ),
        };
      default:
        return {
          title: "Registro de Animales",
          buttons: isVeterinario ? null : (
            <>
              <Button
                variant="white"
                size="42"
                className="w-full sm:w-auto"
                onClick={onAddLote}
              >
                Agregar Lote
              </Button>
              <Button
                variant="green"
                size="42"
                className="w-full sm:w-auto"
                onClick={onAddAnimal}
              >
                Agregar Animal
              </Button>
            </>
          ),
        };
    }
  };

  const content = getHeaderContent();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col">
        <h2 className="text-[24px] font-bold text-black leading-tight">
          {content.title}
        </h2>
        <p className="text-[14px] font-normal text-gray-agro mt-1">
          Administra tus animales de forma individual o en lote
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
        {content.buttons}
      </div>
    </div>
  );
}
