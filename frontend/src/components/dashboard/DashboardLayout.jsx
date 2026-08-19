"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * @description Layout principal para todas las vistas internas de la plataforma.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la página.
 * @param {Object} props.usuario - Información del usuario logueado.
 */

export default function DashboardLayout({ children, usuario }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} usuario={usuario} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} usuario={usuario} />

        <main className="flex-1 overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
