import { NextResponse } from "next/server";

/**
 * @description Middleware principal de Next.js. Intercepta las peticiones HTTP para verificar la autenticación (tokens), proteger rutas privadas y gestionar redirecciones.
 * @param {import('next/server').NextRequest} req - Objeto de la petición entrante.
 * @returns {import('next/server').NextResponse|void} Respuesta con redirección o continuación de la ruta.
 */

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthRoute =
    authRoutes.includes(pathname) || pathname.startsWith("/reset-password");

  const publicRoutes = ["/", "/about", "/contact", "/terms", "/privacy"];
  const isPublicRoute = publicRoutes.includes(pathname);

  const isCompleteProfile = pathname === "/complete-profile";

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  if (!token && !isPublicRoute && !isAuthRoute && !isCompleteProfile) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const payloadDecoded = atob(base64);
      const session = JSON.parse(payloadDecoded);

      const userRole = session.rol || "admin";

      const adminOnlyRoutes = ["/users", "/finances", "/reports"];
      const adminAndWorkerRoutes = ["/inventory"];

      const isTryingAdminRoute = adminOnlyRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isTryingAdminRoute && userRole !== "admin") {
        return NextResponse.redirect(new URL("/overview", req.url));
      }

      const isTryingInventory = adminAndWorkerRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isTryingInventory && userRole === "veterinario") {
        return NextResponse.redirect(new URL("/overview", req.url));
      }
    } catch (error) {
      console.error("Middleware falló al leer el token");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico).*)",
  ],
};
