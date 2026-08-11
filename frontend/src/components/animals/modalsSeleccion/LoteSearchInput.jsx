"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Loader2, X } from "lucide-react";
import { getLotesAction } from "@/actions/lote.actions";

export default function LoteSearchInput({
  valorInicial,
  onSelect,
  placeholder = "Buscar por nombre o código",
}) {
  const [searchTerm, setSearchTerm] = useState(valorInicial?.label || "");
  const [prevLabel, setPrevLabel] = useState(valorInicial?.label);

  if (valorInicial?.label !== prevLabel) {
    setPrevLabel(valorInicial?.label);
    setSearchTerm(valorInicial?.label || "");
  }

  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [coords, setCoords] = useState(null);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const openDropdown = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setHasSearched(false);
        setIsOpen(false);
        return;
      }
      if (valorInicial && searchTerm === valorInicial.label) return;

      setIsLoading(true);
      const res = await getLotesAction({ search: searchTerm, limit: 5 });
      if (res.success && res.data?.lotes) setResults(res.data.lotes);
      else setResults([]);

      setIsLoading(false);
      setHasSearched(true);
      openDropdown();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, valorInicial]);

  const handleSelect = (lote) => {
    const label = `${lote.codigo_lote}`;
    setSearchTerm(label);
    setIsOpen(false);
    onSelect(lote);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setHasSearched(false);
    setIsOpen(false);
    onSelect(null);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center" ref={inputRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHasSearched(false);
            setIsOpen(false);
          }}
          onFocus={() => {
            if (results.length > 0 || (hasSearched && searchTerm))
              openDropdown();
          }}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-8 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
        />
        {searchTerm && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: `${coords?.top}px`,
              left: `${coords?.left}px`,
              width: `${coords?.width}px`,
            }}
            className="z-9999 bg-white border border-border-agro rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-100"
          >
            {results.length > 0 && (
              <ul className="py-1 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {results.map((lote) => (
                  <li
                    key={lote._id}
                    onClick={() => handleSelect(lote)}
                    className="px-4 py-2 text-[14px] cursor-pointer hover:bg-gray-50 text-black flex flex-col"
                  >
                    <span className="font-medium">{lote.codigo_lote}</span>
                    <span className="text-[12px] text-gray-500">
                      Total: {lote.cantidad_total || 0}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {results.length === 0 && hasSearched && (
              <div className="p-3 text-center">
                <span className="text-[13px] text-gray-500">
                  No se encontraron lotes
                </span>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
