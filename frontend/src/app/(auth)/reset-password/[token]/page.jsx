"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { restablecerContrasenhaAction } from "@/actions/user.actions";

export const metadata = {
  title: "Restablecer Contraseña | AgroTrack",
  description: "Ingresa tu nueva contraseña para recuperar el acceso.",
};

/**
 * @description Página para restablecer la contraseña utilizando un token válido.
 */

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [formData, setFormData] = useState({
    nuevaContrasenha: "",
    confirmarContrasenha: "",
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nuevaContrasenha !== formData.confirmarContrasenha) {
      return toast.error("Las contraseñas no coinciden");
    }

    setIsLoading(true);
    const res = await restablecerContrasenhaAction(token, formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.data.msg);
      router.push("/login");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-border-agro rounded-2xl shadow-sm p-8 max-w-md w-full flex flex-col items-center">
        <div className="w-14 h-14 bg-[#E8F3EB] rounded-full flex items-center justify-center mb-6">
          <Lock className="text-[#229A48] w-7 h-7" strokeWidth={2} />
        </div>

        <h1 className="text-[28px] font-bold text-black mb-2 text-center leading-tight">
          Restablecer Contraseña
        </h1>
        <p className="text-[14px] text-gray-500 text-center mb-8">
          Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type={showPassword1 ? "text" : "password"}
                value={formData.nuevaContrasenha}
                onChange={(e) =>
                  setFormData({ ...formData, nuevaContrasenha: e.target.value })
                }
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword1 ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <span className="text-[12px] text-gray-400 mt-1">
              Mín. 8 caracteres, una mayúscula, un número y un signo.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-black">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type={showPassword2 ? "text" : "password"}
                value={formData.confirmarContrasenha}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmarContrasenha: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-border-agro focus:outline-none focus:ring-1 focus:ring-primary text-[14px] text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword2 ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            variant="green"
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-[15px] mt-2"
          >
            {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
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
