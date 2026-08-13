"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  totalRegistros = 0,
  totalPaginas = 1,
  paginaActual = 1,
  limite = 10,
  compact = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mostrandoDe =
    totalRegistros === 0 ? 0 : (paginaActual - 1) * limite + 1;
  const mostrandoHasta = Math.min(paginaActual * limite, totalRegistros);

  const getPaginasVisible = () => {
    if (totalPaginas <= 3) {
      return Array.from({ length: Math.max(1, totalPaginas) }, (_, i) => i + 1);
    }
    if (paginaActual === 1) {
      return [1, 2, 3];
    }
    if (paginaActual === totalPaginas) {
      return [totalPaginas - 2, totalPaginas - 1, totalPaginas];
    }
    return [paginaActual - 1, paginaActual, paginaActual + 1];
  };

  const paginas = getPaginasVisible();

  const cambiarPagina = (nuevaPagina) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas ||
      nuevaPagina === paginaActual
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nuevaPagina.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={`flex items-center gap-4 pt-6 ${
        compact
          ? "flex-col justify-center"
          : "flex-col sm:flex-row justify-between"
      }`}
    >
      <p className="text-[14px] text-gray-500 text-center">
        Mostrando <span className="font-bold text-black">{mostrandoDe}</span> a{" "}
        <span className="font-bold text-black">{mostrandoHasta}</span> de{" "}
        <span className="font-bold text-black">{totalRegistros}</span> registros
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1 || totalRegistros === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors ${
            paginaActual === 1 || totalRegistros === 0
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-border-agro text-gray-600 hover:bg-gray-50 hover:text-black cursor-pointer"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        {paginas.map((pagina) => (
          <button
            key={pagina}
            onClick={() => cambiarPagina(pagina)}
            className={`w-8 h-8 flex items-center justify-center rounded-md font-medium text-[14px] transition-colors cursor-pointer ${
              pagina === paginaActual
                ? "bg-primary text-white border border-primary shadow-sm"
                : "border border-border-agro text-black hover:bg-gray-50"
            }`}
          >
            {pagina}
          </button>
        ))}

        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas || totalRegistros === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors ${
            paginaActual === totalPaginas || totalRegistros === 0
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-border-agro text-gray-600 hover:bg-gray-50 hover:text-black cursor-pointer"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
