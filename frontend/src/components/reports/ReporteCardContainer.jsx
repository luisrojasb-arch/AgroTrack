"use client";

export default function ReporteCardContainer({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {children}
    </div>
  );
}