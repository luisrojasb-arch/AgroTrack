export default function AboutCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-border-agro rounded-[12px] p-6 shadow-sm flex flex-col items-start text-left transition-all hover:shadow-md">
      {/* Ícono */}
      <div className="text-primary mb-4">
        {Icon && <Icon size={28} strokeWidth={2} />}
      </div>
      
      {/* Título de la tarjeta */}
      <h3 className="text-xl font-bold text-black mb-2">
        {title}
      </h3>
      
      {/* Descripción */}
      <p className="text-gray-agro-text text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}