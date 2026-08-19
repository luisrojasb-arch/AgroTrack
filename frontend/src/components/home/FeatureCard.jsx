/**
 * @description Tarjeta individual de característica en la Landing Page.
 * @param {Object} props
 * @param {string} props.title - Título de la característica.
 * @param {string} props.description - Descripción.
 * @param {React.ElementType} props.icon - Ícono.
 */

export default function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col p-8 rounded-2xl border border-border-agro bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-[#E8F3EB] flex items-center justify-center mb-6">
        <Icon className="text-primary w-6 h-6" strokeWidth={2} />
      </div>

      <h3 className="text-[18px] font-bold text-black mb-3">{title}</h3>
      <p className="text-[14px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
