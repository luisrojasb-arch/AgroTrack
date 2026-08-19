import { cookies } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * @description Layout específico para las páginas públicas (Landing, Contacto, etc).
 * @param {Object} props
 * @param {React.ReactNode} props.children - Páginas y componentes anidados de marketing.
 */

export default async function MarketingLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAuthenticated = !!token;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
