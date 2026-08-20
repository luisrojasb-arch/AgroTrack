"use client";

import { useState, useActionState } from "react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import AuthCard from "@/components/auth/AuthCard";
import Button from "@/components/ui/Button";
import { User, Mail, Lock, Eye, EyeOff, Home, Check } from "lucide-react";
import Link from "next/link";
import { registrarUsuarioAction } from "@/actions/auth.actions";





/**
 * @description Página de registro para nuevos usuarios.
 */

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registrarUsuarioAction,
    null,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  return (
    <AuthSplitLayout>
      <AuthCard
        title="Crea tu Cuenta"
        subtitle="Únete a la gestión porcina inteligente"
        currentTab="register"
      >
        <form action={formAction} className="flex flex-col w-full">
          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium text-center">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-agro-text">
                Nombre
              </label>
              <div className="relative flex items-center w-full h-10 border border-border-agro rounded-lg bg-white focus-within:border-primary transition-colors">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <User
                    size={16}
                    className="text-gray-agro-text"
                    strokeWidth={1.5}
                  />
                </div>
                <input
                  name="nombre"
                  type="text"
                  placeholder="Ej: Luis"
                  className="w-full h-full bg-transparent outline-none text-black placeholder:text-gray-placeholder text-sm pl-10 pr-4 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-agro-text">
                Apellido
              </label>
              <div className="relative flex items-center w-full h-10 border border-border-agro rounded-lg bg-white focus-within:border-primary transition-colors">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <User
                    size={16}
                    className="text-gray-agro-text"
                    strokeWidth={1.5}
                  />
                </div>
                <input
                  name="apellido"
                  type="text"
                  placeholder="Ej: Rojas"
                  className="w-full h-full bg-transparent outline-none text-black placeholder:text-gray-placeholder text-sm pl-10 pr-4 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-bold text-gray-agro-text">
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
                className="w-full h-full bg-transparent outline-none text-black placeholder:text-gray-placeholder text-sm pl-10 pr-4 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-bold text-gray-agro-text">
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
                placeholder="************"
                className="w-full h-full bg-transparent outline-none text-black placeholder:text-gray-placeholder text-sm tracking-widest pl-10 pr-10 rounded-lg"
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
            <p className="text-xs text-gray-agro-text">
              Mín. 8 caracteres, una mayúscula, un número y un signo.
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label className="text-sm font-bold text-gray-agro-text">
              Nombre de la Finca
            </label>
            <div className="relative flex items-center w-full h-10 border border-border-agro rounded-lg bg-white focus-within:border-primary transition-colors">
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Home
                  size={16}
                  className="text-gray-agro-text"
                  strokeWidth={1.5}
                />
              </div>
              <input
                name="nombre_finca"
                type="text"
                placeholder="Ej: Santa Barbara"
                className="w-full h-full bg-transparent outline-none text-black placeholder:text-gray-placeholder text-sm pl-10 pr-4 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAceptoTerminos(!aceptoTerminos)}
              className={`mt-1 flex items-center justify-center shrink-0 w-4 h-4 rounded-full border transition-colors cursor-pointer ${
                aceptoTerminos
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-gray-agro text-transparent"
              }`}
            >
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </button>

            <input
              type="checkbox"
              name="acepto_terminos"
              checked={aceptoTerminos}
              readOnly
              className="hidden"
            />

            <p className="text-sm text-black leading-tight">
              Acepto los{" "}
              <Link
                href="/terms"
                className="font-bold text-primary hover:underline"
              >
                Términos y Condiciones
              </Link>{" "}
              y la{" "}
              <Link
                href="/privacy"
                className="font-bold text-primary hover:underline"
              >
                Política de Privacidad
              </Link>{" "}
              de AgroTrack.
            </p>
          </div>

          <Button
            variant="green"
            size="42"
            fullWidth
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </AuthCard>
    </AuthSplitLayout>
  );
}
