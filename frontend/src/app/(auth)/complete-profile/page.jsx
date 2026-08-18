"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { activarCuentaAction } from "@/actions/user.actions";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nuevaContrasenha: "",
    confirmarContrasenha: "",
    acepto_terminos: false,
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nuevaContrasenha !== formData.confirmarContrasenha) {
      return toast.error("Las contraseñas no coinciden");
    }
    if (!formData.acepto_terminos) {
      return toast.error("Debes aceptar los términos de servicio");
    }

    setIsLoading(true);
    const res = await activarCuentaAction(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.data.msg);
      router.push("/overview");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-border-agro rounded-2xl shadow-sm p-8 max-w-md w-full flex flex-col items-center">
        <div className="w-14 h-14 bg-[#E8F3EB] rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="text-[#229A48] w-7 h-7" strokeWidth={2} />
        </div>

        <h1 className="text-[28px] font-bold text-[#101828] mb-2 text-center leading-tight">
          Activa tu Cuenta
        </h1>
        <p className="text-[14px] text-gray-500 text-center mb-8">
          Para tu seguridad, crea una nueva contraseña y acepta los términos
          legales.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#344054]">
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
              Mínimo 8 caracteres
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#344054]">
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

          <label className="flex items-start gap-3 mt-2 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.acepto_terminos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    acepto_terminos: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-[#229A48]"
              />
            </div>
            <span className="text-[13px] text-gray-500 leading-tight">
              Confirmo que he leído y acepto los{" "}
              <a href="#" className="font-bold text-[#229A48] hover:underline">
                Términos de Servicio
              </a>{" "}
              para activar mi acceso a AgroTrack.
            </span>
          </label>

          <Button
            variant="green"
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-[15px] mt-2"
          >
            {isLoading ? "Activando..." : "Activar Cuenta"}
          </Button>
        </form>
      </div>
    </div>
  );
}
