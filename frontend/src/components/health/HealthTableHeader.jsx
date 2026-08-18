"use client";

import Button from "@/components/ui/Button";

export default function HealthTableHeader({ activeTab, onAddAnimal, onAddLote }) {
  const getHeaderContent = () => {
    if (activeTab === "lotes" || activeTab === "individuales") {
      return {
        title: "Registro de Salud",
        buttons: (
          <>
            <Button variant="white" size="42" className="w-full sm:w-auto" onClick={onAddLote}>
              Agregar Salud Lote
            </Button>
            <Button variant="green" size="42" className="w-full sm:w-auto" onClick={onAddAnimal}>
              Agregar Salud Individual
            </Button>
          </>
        ),
        caption: "Administra la salud de tus animales de forma individual o en lote",
      };
    } else {
      return {
        title: "Cronograma Sanitario",
        buttons: null,
        caption: "Cronograma sanitario porcino aplicado automáticamente a cada lote de nacimiento",
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
        <p className="text-[14px] font-normal text-gray-500 mt-1">
          {content.caption}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
        {content.buttons}
      </div>
    </div>
  );
}