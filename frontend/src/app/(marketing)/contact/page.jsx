import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contacto | AgroTrack",
  description: "¿Tienes preguntas sobre AgroTrack? Contáctanos.",
};

/**
 * @description Página de contacto para comunicación con el equipo de soporte o ventas.
 */

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 md:py-20">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">Contacto</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
            ¿Tienes preguntas sobre AgroTrack? Estamos aquí para ayudarte. Envíanos un
            mensaje y te responderemos pronto.
          </p>
        </div>

        {/* Formulario */}
        <ContactForm />

      </main>
    </div>
  );
}