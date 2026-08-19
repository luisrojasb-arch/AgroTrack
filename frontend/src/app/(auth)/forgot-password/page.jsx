"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Mail, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { solicitarRecuperacionAction } from "@/actions/user.actions";


export const metadata = {
  title: "Recuperar Contraseña | AgroTrack",
  description: "Solicita un enlace para restablecer el acceso a tu cuenta.",
};

/**
 * @description Página para solicitar la recuperación de contraseña (envío de enlace).
 */

export default function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo) return toast.error("Ingresa tu correo electrónico");

    setIsLoading(true);
    const res = await solicitarRecuperacionAction(correo);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.data.msg);
      setCorreo("");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-border-agro rounded-2xl shadow-sm p-8 max-w-md w-full flex flex-col items-center">
        <div className="w-14 h-14 bg-[#E8F3EB] rounded-full flex items-center justify-center mb-6">
          <Leaf className="text-[#229A48] w-7 h-7" strokeWidth={2} />
        </div>

        <h1 className="text-[28px] font-bold text-black mb-2 text-center leading-tight">
          ¿Olvidaste tu Contraseña?
        </h1>
        <p className="text-[14px] text-gray-500 text-center mb-8">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ej@gmail.com"
                required
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
              />
            </div>
          </div>

          <Button
            variant="green"
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-[15px]"
          >
            {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </Button>
        </form>

        <Link
          href="/login"
          className="mt-6 flex items-center gap-2 text-[14px] font-medium text-[#229A48] hover:text-[#1c7e3b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio de Sesión
        </Link>
      </div>
    </div>
  );
}
