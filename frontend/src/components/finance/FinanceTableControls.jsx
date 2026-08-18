"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FinanceTableControls({ onAddTransaction }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlTipo = searchParams.get("tipo") || "Todos los tipos";
  const urlCategoria = searchParams.get("categoria") || "Todas las categorías";

  const [searchValue, setSearchValue] = useState(urlSearch);
  const [selectedTipo, setSelectedTipo] = useState(urlTipo);
  const [selectedCategoria, setSelectedCategoria] = useState(urlCategoria);

 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue !== urlSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) params.set("search", searchValue);
        else params.delete("search");

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, urlSearch, searchParams, pathname, router]);

  const handleFilterChange = (paramName, newValue, defaultValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue && newValue !== defaultValue) {
      params.set(paramName, newValue);
    } else {
      params.delete(paramName);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6 mb-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-black">Transacciones Financieras</h2>
          <p className="text-[14px] font-medium text-gray-agro mt-0.5">Historial de movimientos</p>
        </div>
        <Button variant="green" size="42" onClick={onAddTransaction}>
          Agregar Transacción
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por tipo o categoría"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 h-10.5 bg-white border border-border-agro rounded-lg text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        <Select
          opciones={["Todos los tipos", "Ingreso", "Egreso"]}
          valorSeleccionado={selectedTipo}
          onChange={(val) => {
            setSelectedTipo(val);
            handleFilterChange("tipo", val, "Todos los tipos");
          }}
          className="w-full md:w-48 shrink-0"
        />

        <Select
          opciones={["Todas las categorías", "Alimento", "Venta", "Salario", "Medicamento", "Insumos", "Herramientas"]}
          valorSeleccionado={selectedCategoria}
          onChange={(val) => {
            setSelectedCategoria(val);
            handleFilterChange("categoria", val, "Todas las categorías");
          }}
          className="w-full md:w-48 shrink-0"
        />
      </div>
    </div>
  );
}