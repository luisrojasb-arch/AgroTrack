"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import AuthCard from "@/components/auth/AuthCard";
import Button from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/actions/auth.actions";

export const metadata = {
  title: "Iniciar Sesión | AgroTrack",
  description: "Accede al sistema de gestión de tu finca porcina.",
};

/**
 * @description Página de inicio de sesión del sistema.
 */

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthSplitLayout>
      <AuthCard
        title="Iniciar Sesión"
        subtitle="Accede a tu finca"
        currentTab="login"
      >
        <form action={formAction} className="flex flex-col w-full">
          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium text-center">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-[14px] font-bold text-gray-agro-text">
              Correo Electrónico
            </label>
            <div className="relative flex items-center w-full h-10 border border-border-agro rounded-lg bg-white focus-within:border-primary transition-colors">
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Mail
                  size={16}
                  className="text-gray-agro-text"
                  strokeWidth={1.5}
                />
              </div>
              <input
                name="correo"
                type="email"
                placeholder="ej@gmail.com"
                className="w-full h-full bg-transparent outline-none text-black placeholder:text-(--color-gray-placeholder) text-[14px] pl-10 pr-4 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-agro-text">
              Contraseña
            </label>
            <div className="relative flex items-center w-full h-10 border border-border-agro rounded-lg bg-white focus-within:border-primary transition-colors">
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Lock
                  size={16}
                  className="text-gray-agro-text"
                  strokeWidth={1.5}
                />
              </div>
              <input
                name="contrasenha"
                type={showPassword ? "text" : "password"}
                placeholder="*****************"
                className="w-full h-full bg-transparent outline-none text-black placeholder:text-(--color-gray-placeholder) text-[14px] tracking-widest pl-10 pr-10 rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-agro-text hover:text-black transition-colors cursor-pointer flex items-center"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Ver contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-[14px] font-medium text-primary hover:underline"
            >
              ¿Olvidaste tu clave?
            </Link>
          </div>

          <div className="mt-4">
            <Button
              variant="green"
              size="42"
              fullWidth
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>
      </AuthCard>
    </AuthSplitLayout>
  );
}
