export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-gradient-card border border-border-agro p-5 rounded-2xl flex flex-col w-full shadow-sm">
      <h3 className="text-gray-agro text-[14px] font-medium mb-3">
        {title}
      </h3>
      <p className="text-black text-[24px] font-bold mb-2">{value}</p>
      <p className="text-gray-agro-muted text-[12px] font-medium">{subtitle}</p>
    </div>
  );
}
