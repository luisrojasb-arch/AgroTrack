export const metadata = {
  title: "Términos y Condiciones | AgroTrack",
  description: "Condiciones de uso y normativas de los servicios de AgroTrack.",
};

/**
 * @description Página de Términos y Condiciones de uso de la plataforma.
 */

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
          Terminos y Condiciones
        </h1>
        <p className="text-gray-agro-muted text-sm md:text-base mb-10">
          Última actualización: Julio 2026
        </p>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Al acceder y utilizar AgroTrack, usted acepta estar sujeto a estos Términos y Condiciones de uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              2. Uso del Servicio
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              AgroTrack es una herramienta de gestión para granjas porcinas. Te comprometes a usarlo únicamente para fines lícitos y a no afectar su disponibilidad o integridad.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              3. Cuenta y Responsabilidad
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Para acceder a ciertas funciones de AgroTrack, debe crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              4. Datos del Usuario
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Los datos que registras (animales, ciclos, finanzas, etc.) son tuyos. AgroTrack los almacena de forma segura para que puedas consultarlos.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              AgroTrack es una herramienta de apoyo y no reemplaza la evaluación veterinaria o profesional. No nos hacemos responsables por decisiones tomadas únicamente con base en la información del sistema.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              6. Modificaciones
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Podemos actualizar estos términos. Notificaremos cambios relevantes a través del Servicio.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              7. Contacto
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Para cualquier pregunta sobre estos Términos y Condiciones, contáctenos en:<br /><br />
              Email: prueba@prueba.com<br />
              Teléfono: +00 0000000000
            </p>
          </div>
        </section>
    </div>
  );
}