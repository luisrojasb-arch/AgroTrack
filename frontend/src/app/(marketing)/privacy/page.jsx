export const metadata = {
  title: "Políticas de Privacidad | AgroTrack",
  description: "Conoce cómo protegemos y manejamos los datos en la plataforma.",
};

/**
 * @description Página de Políticas de Privacidad.
 */

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
          Política de Privacidad
        </h1>
        <p className="text-gray-agro-muted text-sm md:text-base mb-10">
          Última actualización: Julio 2026
        </p>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              1. Información que Recopilamos
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Recolectamos los datos necesarios para operar el Servicio: nombre, correo, información de la finca y los registros que tú ingresas (animales, ciclos, salud, finanzas, etc.).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              2. Uso de la Información
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Usamos tus datos únicamente para que puedas operar tu cuenta y la finca. No vendemos ni compartimos tu información con terceros con fines comerciales.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              3. Seguridad de Datos
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Los datos se almacenan en proveedores de infraestructura seguros con cifrado en tránsito y en reposo.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              4. Acceso por Roles
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Solo los usuarios invitados a tu finca pueden acceder a sus datos, según el rol que les asignes (administrador, trabajador o veterinario).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              5. Tus Derechos
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento contactándonos
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              6. Cookies
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Usamos cookies funcionales necesarias para mantener tu sesión iniciada.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              7. Cambios
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Podemos actualizar esta política y te lo notificaremos por el Servicio.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              8. Contacto
            </h2>
            <p className="text-gray-agro-text leading-relaxed">
              Para cualquier pregunta sobre Política y Privacidad, contáctenos en:<br /><br />
              Email: prueba@prueba.com<br />
              Teléfono: +00 0000000000
            </p>
          </div>
        </section>
    </div>
  );
}