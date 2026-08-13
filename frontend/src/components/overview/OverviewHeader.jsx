export default function OverviewHeader({ name }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-[30px] font-bold text-black leading-tight">
        ¡Bienvenido de nuevo, {name}!
      </h1>
      <p className="text-[16px] font-medium text-gray-agro leading-tight mt-1">
        Esto es lo que está pasando en tu granja hoy
      </p>
    </div>
  );
}
