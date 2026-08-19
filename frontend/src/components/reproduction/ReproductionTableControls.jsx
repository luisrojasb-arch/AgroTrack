"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Select from "@/components/ui/Select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * @description Controles de filtro adaptados a la pestaña activa de reproducción.
 * @param {Object} props
 * @param {string} props.activeTab - Pestaña actual para determinar filtros.
 */

export default function ReproductionTableControls({ activeTab }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getDefaultFilter = () => {
    if (activeTab === "preneces") return "Todos los métodos";
    if (activeTab === "nacimientos") return "Todos los tipos";
    return "Todos";
  };

  const defaultFilter = getDefaultFilter();
  const urlSearch = searchParams.get("search") || "";
  const urlFilter = searchParams.get("filter") || defaultFilter;

  const [searchValue, setSearchValue] = useState(urlSearch);
  const [selectedValue, setSelectedValue] = useState(urlFilter);

  const getOpcionesSelect = () => {
    if (activeTab === "preneces")
      return ["Todos los métodos", "Observacion", "Ecografia"];
    if (activeTab === "nacimientos")
      return ["Todos los tipos", "Normal", "Cesarea"];
    return ["Todos", "Confirmados", "Pendientes"];
  };

  const opcionesSelect = getOpcionesSelect();

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

  const handleSelectChange = (nuevoValor) => {
    setSelectedValue(nuevoValor);

    const params = new URLSearchParams(searchParams.toString());
    if (
      nuevoValor &&
      nuevoValor !== "Todos los métodos" &&
      nuevoValor !== "Todos los tipos" &&
      nuevoValor !== "Todos"
    ) {
      params.set("filter", nuevoValor);
    } else {
      params.delete("filter");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (activeTab === "cipa") return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="relative w-full flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o código"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 h-10.5 bg-white border border-border-agro rounded-lg text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <Select
        opciones={opcionesSelect}
        valorSeleccionado={selectedValue}
        onChange={handleSelectChange}
        className="w-full md:w-50 shrink-0"
      />
    </div>
  );
}
