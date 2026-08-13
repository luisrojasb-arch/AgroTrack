import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsContainer from "@/components/settings/SettingsContainer";
import { getPerfilAction } from "@/actions/user.actions";
import { getFincaAction } from "@/actions/finca.actions";

export default async function SettingsPage() {
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
      <SettingsContainer initialData={initialData} />
    </div>
  );
}
