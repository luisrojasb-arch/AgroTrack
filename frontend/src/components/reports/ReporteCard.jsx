"use client";

export default function ReporteCard({ title, description, icon: Icon, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
        isSelected
          ? "bg-[#E8F3EB] border-primary shadow-sm"
          : "bg-white border-border-agro hover:border-primary/50"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
          isSelected ? "bg-primary text-white" : "bg-[#F4F5F7] text-primary"
        }`}
      >
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <h3 className="text-[16px] font-bold text-black">{title}</h3>
      <p className="text-[13px] text-gray-500 mt-1">{description}</p>
    </div>
  );
}