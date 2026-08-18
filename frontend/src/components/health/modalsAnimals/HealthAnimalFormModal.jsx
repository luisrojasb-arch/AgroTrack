"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function HealthAnimalFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  animalesDisponibles = [] 
}) {
  const [formData, setFormData] = useState({
    animal_id: "",
    tipo: "Vacuna",
    producto: "",
    dosis: "",
    fecha: "",
    proxima_dosis: "",
    nota: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  const animalesFiltrados = animalesDisponibles.filter((animal) => {
    const busqueda = searchTerm.toLowerCase();
    const codigo = animal.codigo?.toLowerCase() || "";
    const nombre = animal.nombre?.toLowerCase() || "";
    return codigo.includes(busqueda) || nombre.includes(busqueda);
  }).slice(0, 5); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFormData((prev) => ({ ...prev, animal_id: "" }));
    setIsDropdownOpen(true);
  };

  const handleSelectAnimal = (animal) => {
    setFormData((prev) => ({ ...prev, animal_id: animal._id }));
    setSearchTerm(`${animal.codigo} ${animal.nombre ? `- ${animal.nombre}` : ""}`);
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.animal_id) {
      alert("Por favor, seleccione un animal válido de la lista desplegable.");
      return;
    }

    const dataToSend = {
      ...formData,
      dosis: formData.dosis ? Number(formData.dosis) : null,
      proxima_dosis: formData.proxima_dosis || null,
    };
    onSubmit(dataToSend);
  };

  const formFooter = (
    <>
      <Button type="button" variant="white" onClick={onClose} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button type="submit" variant="green" form="animal-health-form" className="w-full sm:w-auto">
        Registrar Salud
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Evento de Salud"
      description="Completa la información médica"
      footer={formFooter}
      width="max-w-2xl"
    >
      <form id="animal-health-form" onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        
        <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
          <label className="text-[13px] font-semibold text-black">Animal *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              required
              placeholder="Buscar por nombre o código"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full h-10.5 pl-9 pr-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {isDropdownOpen && searchTerm && (
            <div className="absolute z-50 top-full mt-1 w-full bg-white border border-border-agro rounded-lg shadow-lg overflow-hidden">
              <ul className="py-1 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {animalesFiltrados.length > 0 ? (
                  animalesFiltrados.map((animal) => (
                    <li
                      key={animal._id}
                      onClick={() => handleSelectAnimal(animal)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F3EB] hover:text-primary cursor-pointer transition-colors"
                    >
                      <span className="font-semibold">{animal.codigo}</span> {animal.nombre ? `- ${animal.nombre}` : ""}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-400 text-center">
                    No se encontraron animales.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Tipo *</label>
          <select
            name="tipo"
            required
            value={formData.tipo}
            onChange={handleChange}
            className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="Vacuna">Vacuna</option>
            <option value="Desparasitación">Desparasitación</option>
            <option value="Descolmille">Descolmille</option>
            <option value="Castración">Castración</option>
            <option value="Cirugía">Cirugía</option>
            <option value="Revisión">Revisión</option>
            <option value="Tratamiento">Tratamiento</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Producto *</label>
            <input
              type="text"
              name="producto"
              required
              placeholder="Ej: Bepure"
              value={formData.producto}
              onChange={handleChange}
              className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Dosis (ml) *</label>
            <input
              type="number"
              name="dosis"
              required
              min="0"
              step="0.1"
              placeholder="0"
              value={formData.dosis}
              onChange={handleChange}
              className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Fecha *</label>
            <input
              type="date"
              name="fecha"
              required
              value={formData.fecha}
              onChange={handleChange}
              className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-black">Proxima dosis (Opcional)</label>
            <input
              type="date"
              name="proxima_dosis"
              value={formData.proxima_dosis}
              onChange={handleChange}
              className="w-full h-10.5 px-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-black">Nota</label>
          <textarea
            name="nota"
            placeholder="Nota sobre el animal"
            rows={3}
            value={formData.nota}
            onChange={handleChange}
            className="w-full p-3 border border-border-agro rounded-lg text-sm text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}