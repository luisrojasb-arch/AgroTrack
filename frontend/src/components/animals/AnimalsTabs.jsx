"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function AnimalsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "individuales";

  const tabs = [
    { id: "individuales", label: "Animales Individuales" },
    { id: "lotes", label: "Lotes de Animales" },
    { id: "madre", label: "Seleccion de Madre" },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;

    const params = new URLSearchParams();
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none mb-6">
      <div className="inline-flex items-center bg-[#F4F5F7] p-1 rounded-xl">
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
