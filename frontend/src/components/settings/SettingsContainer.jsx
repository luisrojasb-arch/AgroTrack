"use client";

import { useSearchParams } from "next/navigation";
import SettingsTabs from "./SettingsTabs";
import ProfileTab from "./tabs/ProfileTab";
import FarmTab from "./tabs/FarmTab";
import RatesTab from "./tabs/RatesTab";

export default function SettingsContainer({ initialData }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "perfil";

  const tabTitles = {
    perfil: {
      title: "Tus Datos de Usuario",
      desc: "Administra tu información personal y de contacto",
    },
    granja: {
      title: "Datos de la Finca",
      desc: "Administra los detalles y ubicación de la propiedad",
    },
    tasas: {
      title: "Tasas de Cambio",
      desc: "Gestiona las tasas de conversión para tus transacciones",
    },
  };

  return (
    <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm">
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-black leading-tight">
          {tabTitles[activeTab]?.title}
        </h2>
        <p className="text-[14px] text-gray-agro mt-1">
          {tabTitles[activeTab]?.desc}
        </p>
      </div>

      <SettingsTabs />

      <div className="mt-4">
        {activeTab === "perfil" && <ProfileTab data={initialData.perfil} />}
        {activeTab === "granja" && <FarmTab data={initialData.finca} />}
        {activeTab === "tasas" && (
          <RatesTab data={initialData.finca?.tasas_cambio} />
        )}
      </div>
    </div>
  );
}
