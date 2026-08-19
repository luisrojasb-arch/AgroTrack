/**
 * @description Encabezado del módulo de reproducción.
 */

export default function ReproductionHeader() {
  return (
    <div className="flex flex-col">
      <h1 className="text-[30px] font-bold text-black leading-tight">
        Gestión de Reproducción
      </h1>
      <p className="text-[16px] font-medium text-gray-agro leading-tight mt-1">
        Ciclo completo: celo → preñez (114 días) → parto
      </p>
    </div>
  );
}
