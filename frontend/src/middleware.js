import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);
  const publicRoutes = ["/", "/about", "/contact", "/terms", "/privacy"];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  if (!token && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico).*)"],
};