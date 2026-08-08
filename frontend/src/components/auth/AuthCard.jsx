import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthCard({
  title,
  subtitle,
  currentTab = "login",
  children,
}) {
  return (
    <div className="w-full max-w-110 bg-gradient-card rounded-2xl shadow-sm border border-border-agro p-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-14 h-14 rounded-full bg-primary-transparent flex items-center justify-center mb-4 text-primary">
        <Leaf className="w-6 h-6" strokeWidth={1.5} />
      </div>

      <h1 className="text-3xl font-bold text-black mb-1 text-center leading-tight">
        {title}
      </h1>
      <p className="text-sm font-normal text-gray-agro-text mb-5.5 text-center">
        {subtitle}
      </p>

      <div className="flex w-full bg-bg-tab rounded-xl p-1 mb-6">
        <Link
          href="/login"
          className={`flex items-center justify-center flex-1 h-9 text-sm font-bold rounded-xl transition-all duration-200 ${
            currentTab === "login"
              ? "bg-white shadow-sm text-black"
              : "text-gray-placeholder hover:text-black"
          }`}
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className={`flex items-center justify-center flex-1 h-9 text-sm font-bold rounded-xl transition-all duration-200 ${
            currentTab === "register"
              ? "bg-white shadow-sm text-black"
              : "text-gray-placeholder hover:text-black"
          }`}
        >
          Registrarse
        </Link>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
}
