import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSession } from "@/actions/auth.actions";

/**
 * @description Layout principal para las páginas públicas de autenticación.
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido de la página actual.
 * @returns {JSX.Element} Estructura del layout con Navbar y contenido.
 */
export default async function AuthLayout({ children }) {
  const session = await getSession();
  const isAuthenticated = session ? true : false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
