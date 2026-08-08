import Image from "next/image";
import Link from "next/link";

/**
 * @description Pie de página público de AgroTrack.
 * @returns {JSX.Element} Componente Footer responsivo.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-bg-nav">
      <div className="w-full border-t border-b border-border-agro">
        <div className="px-6 py-6 md:px-8 md:py-8 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <Link href="/">
                <Image
                  src="/logo-agrotrack.png"
                  alt="Logo AgroTrack"
                  width={121}
                  height={34}
                  className="object-contain"
                />
              </Link>
              <p className="text-4 text-gray-footer font-medium">
                Gestión inteligente para granjas porcinas.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-4 font-bold text-black">Producto</h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href="/about"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="/contact"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-4 font-bold text-black">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/terms"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Términos y Condiciones
                </Link>
                <Link
                  href="/privacy"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Política de Privacidad
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-4 font-bold text-black">Cuenta</h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-4 text-gray-agro-text hover:text-primary transition-colors"
                >
                  Crear cuenta
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="px-6 py-6 md:px-8 lg:px-12 text-center md:text-left flex flex-col md:flex-row justify-center items-center gap-2">
          <p className="text-[14px] font-medium text-gray-agro-text text-center">
            © 2026 AgroTrack. Todos los derechos reservados.
            <span className="hidden md:inline mx-2">|</span>
            <br className="md:hidden" />
            Desarrollado por{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:opacity-80 transition-opacity"
            >
              Mariana
            </a>
            ,{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:opacity-80 transition-opacity"
            >
              Luis
            </a>{" "}
            y{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:opacity-80 transition-opacity"
            >
              Osmar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
