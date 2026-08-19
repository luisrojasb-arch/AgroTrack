"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * @description Pestañas de navegación del módulo reproductivo (Celos, Preñez, etc).
 */

export default function ReproductionTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "celos";

  const tabs = [
    { id: "celos", label: "Celos" },
    { id: "preneces", label: "Preñeces" },
    { id: "nacimientos", label: "Nacimientos" },
    { id: "cipa", label: "Tabla CIPA" },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;

    const params = new URLSearchParams();
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none mb-6">
      <div className="inline-flex items-center bg-bg-tab p-1 rounded-xl min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap px-5 py-2 text-[14px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-agro hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
