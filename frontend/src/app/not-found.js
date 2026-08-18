import { cookies } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import BackButton from "@/components/backbutton";

export default async function NotFound() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAuthenticated = !!token;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-black mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-agro-text mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/" variant="green" size="42">
            Ir al Inicio
          </Button>

          <BackButton />
        </div>
      </main>

      <Footer />
    </div>
  );
}
