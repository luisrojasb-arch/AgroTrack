"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

/**
 * @description Barra de navegación pública principal de AgroTrack.
 * @param {boolean} isAuthenticated - Indica si el usuario tiene una sesión activa.
 */
export default function Navbar({ isAuthenticated = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Sobre Nosotros", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full h-16 bg-bg-nav/80 backdrop-blur-md border-b border-border-agro transition-all">
        <div className="flex items-center justify-between h-full px-6 md:px-8 lg:px-12">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-agrotrack.png"
              alt="Logo AgroTrack"
              width={121}
              height={34}
              className="object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-[16px] font-medium text-black hover:text-primary transition-colors pb-1 group"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <Button variant="green" size="36" href="/overview">
                  Ir al Panel
                </Button>
              ) : (
                <>
                  <Button variant="white" size="36" href="/login">
                    Iniciar Sesión
                  </Button>
                  <Button variant="green" size="36" href="/register">
                    Registrarse
                  </Button>
                </>
              )}
            </div>

            <div className="hidden md:flex lg:hidden">
              {isAuthenticated ? (
                <Button variant="green" size="36" href="/overview">
                  Ir al Panel
                </Button>
              ) : (
                <Button variant="white" size="36" href="/login">
                  Iniciar Sesión
                </Button>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex lg:hidden flex-col justify-center items-center w-9 h-9 rounded-lg bg-gradient-green shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="Alternar menú"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5 text-white" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-16 z-40 bg-[#000000]/40 backdrop-blur-[10px]"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="fixed top-16 left-0 w-full bg-bg-nav border-b border-border-agro z-50 px-6 md:px-8 py-6 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
              <div className="flex flex-col gap-4 text-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[16px] font-medium text-black hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="w-full h-px bg-border-agro"></div>

              <div className="flex flex-col gap-4">
                {isAuthenticated ? (
                  <Button variant="green" size="36" href="/overview" fullWidth>
                    Ir al Panel
                  </Button>
                ) : (
                  <>
                    <div className="md:hidden w-full">
                      <Button variant="white" size="36" href="/login" fullWidth>
                        Iniciar Sesión
                      </Button>
                    </div>
                    <Button
                      variant="green"
                      size="36"
                      href="/register"
                      fullWidth
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
