import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsContainer from "@/components/settings/SettingsContainer";
import { getPerfilAction } from "@/actions/user.actions";
import { getFincaAction } from "@/actions/finca.actions";
import { getSession } from "@/actions/auth.actions";

export const metadata = {
  title: "Configuración | AgroTrack",
  description: "Ajustes, tasas de cambio y preferencias de la finca.",
};


/**
 * @description Página de configuración general de la finca y preferencias del sistema.
 */

export default async function SettingsPage() {
  const session = await getSession();
  const userRole = session?.rol || "";

  const [perfilRes, fincaRes] = await Promise.all([
    getPerfilAction(),
    getFincaAction(),
  ]);

  const initialData = {
    perfil: perfilRes.success ? perfilRes.data : null,
    finca: fincaRes.success ? fincaRes.data : null,
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <SettingsHeader />
      <SettingsContainer initialData={initialData} userRole={userRole} />
    </div>
  );
}
