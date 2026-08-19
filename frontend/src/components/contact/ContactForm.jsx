"use client";

import { useState } from "react";
import { User, Mail, FileText, MessageSquare, Phone } from "lucide-react";
import { enviarMensajeContacto } from "@/actions/contacto.actions";
import Button from "@/components/ui/Button";
import { toast } from "sonner"; 

export default function ContactForm() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const respuesta = await enviarMensajeContacto(formData);

    if (respuesta.success) {
      
      toast.success(respuesta.message || "¡Mensaje enviado con éxito!");
      setFormData({ nombre: "", apellido: "", correo: "", asunto: "", mensaje: "" });
    } else {
      toast.error(respuesta.message || "Hubo un error al enviar el mensaje.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Formulario */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-black mb-2">Envíanos un mensaje</h2>
        <p className="text-gray-500 text-sm mb-6">Completa el formulario y nos pondremos en contacto.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nombre</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Mariana" className="w-full bg-transparent outline-none text-black" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Apellido</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ej: Gafaro" className="w-full bg-transparent outline-none text-black" required />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Correo Electrónico</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Ej: marianagafaro@gmail.com" className="w-full bg-transparent outline-none text-black" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Asunto</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FileText className="w-5 h-5 text-gray-400 mr-2" />
              <input type="text" name="asunto" value={formData.asunto} onChange={handleChange} placeholder="Consulta" className="w-full bg-transparent outline-none text-black" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Mensaje</label>
            <div className="flex items-start border border-gray-300 rounded-md px-3 py-2">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-2 mt-1" />
              <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} placeholder="Escribe tu mensaje..." rows="4" className="w-full bg-transparent outline-none text-black resize-none" required></textarea>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="green" 
            disabled={isSubmitting} 
            className="w-full py-3 text-[16px]"
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </Button>
        </form>
      </div>

      {/* Información de Contacto */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-black mb-2">Información de Contacto</h2>
        <p className="text-gray-500 text-sm mb-8">Comunícate con nosotros directamente.</p>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="bg-[#e0ebe4] p-3 rounded-md mr-4"><Mail className="w-6 h-6 text-[#157937]" /></div>
            <div>
              <p className="text-black font-semibold text-sm">Correo electrónico</p>
              <p className="text-gray-500 text-sm">infoagrotrack2026@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#e0ebe4] p-3 rounded-md mr-4"><Phone className="w-6 h-6 text-[#157937]" /></div>
            <div>
              <p className="text-black font-semibold text-sm">Teléfono</p>
              <p className="text-gray-500 text-sm">+58 412-1234567</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}