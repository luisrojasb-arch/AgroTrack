"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import {
  LayoutDashboard,
  PawPrint,
  Heart,
  Activity,
  Package,
  DollarSign,
  FileText,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Panel Principal",
    href: "/overview",
    icon: LayoutDashboard,
    roles: ["admin", "trabajador", "veterinario"],
  },
  {
    name: "Animales",
    href: "/animals",
    icon: PawPrint,
    roles: ["admin", "trabajador", "veterinario"],
  },
  {
    name: "Salud",
    href: "/health",
    icon: Heart,
    roles: ["admin", "trabajador", "veterinario"],
  },
  {
    name: "Reproducción",
    href: "/breeding",
    icon: Activity,
    roles: ["admin", "trabajador", "veterinario"],
  },
  {
    name: "Inventario",
    href: "/inventory",
    icon: Package,
    roles: ["admin", "trabajador"],
  },
  {
    name: "Finanzas",
    href: "/finances",
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileText,
    roles: ["admin"],
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
];

/**
 * @description Menú lateral de navegación.
 * @param {Object} props
 * @param {Function} props.onClose - Función para cerrar el menú en móvil.
 * @param {Object} props.usuario - Información del usuario logueado.
 */

export default function Sidebar({ onClose, usuario }) {
  const pathname = usePathname();

  const userRole = usuario?.rol || "admin";

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside className="flex flex-col h-full bg-bg-nav border-r border-border-agro w-72">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border-agro shrink-0">
        <Image
          src="/logo-agrotrack.png"
          alt="Logo AgroTrack"
          width={121}
          height={34}
          className="object-contain"
        />

        <button
          onClick={onClose}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border-agro bg-white text-black hover:bg-gray-50 transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {/* Renderizamos la lista filtrada */}
        {filteredMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-[#E8F3EB] text-primary"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-agro space-y-1 shrink-0">
        <Link
          href="/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            pathname.startsWith("/settings")
              ? "bg-[#E8F3EB] text-primary"
              : "text-black hover:bg-gray-50"
          }`}
        >
          <Settings size={20} strokeWidth={2} />
          <span className="text-[15px]">Configuración</span>
        </Link>
        <button
          onClick={() => logoutAction()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[#F44336] hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-[15px]">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
