export default function OverviewHeader({ name }) {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
        ¡Bienvenido de nuevo, {name}!
      </h1>
      <p className="text-gray-agro-muted text-sm md:text-base mb-10">
        Esto es lo que está pasando en tu granja hoy
      </p>
    </div>
  );
}