"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, Search, MessageCircle, Heart, Plus, HelpCircle } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname(); // Detecta la ruta actual

  const tabs = [
    { id: "home", label: "Inicio", Icon: Home, path: "/" },
    { id: "buscar", label: "Buscar", Icon: Search, path: "/buscar" },
    { id: "soporte", label: "Soporte", Icon: HelpCircle, path: "/soporte" },
    { id: "guardados", label: "Guardados", Icon: Heart, path: "/guardados" },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 mx-auto max-w-[calc(28rem-2rem)] px-4">
      <nav className="relative flex items-center justify-between rounded-[32px] bg-[#1a1a1a] px-6 py-4 shadow-2xl ring-1 ring-white/10 dark:bg-[#1C1C1E] dark:ring-white/5">
        
        {/* Primer bloque: Inicio y Buscar */}
        {tabs.slice(0, 2).map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-emerald-500" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <tab.Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}

        {/* Espaciador invisible para el botón central */}
        <div className="w-14" aria-hidden="true" />

        {/* Segundo bloque: Chats y Guardados */}
        {tabs.slice(2, 4).map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-emerald-500" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <tab.Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}

        {/* Botón Flotante Central (+) */}
        <button
          onClick={() => router.push("/vendedor")}
          className="absolute left-1/2 -top-5 grid h-[60px] w-[60px] -translate-x-1/2 place-items-center rounded-full bg-emerald-500 text-[#06251a] shadow-[0_8px_24px_rgba(16,185,129,0.4)] ring-[6px] ring-[#1a1a1a] transition hover:bg-emerald-400 active:scale-90 dark:ring-[#1C1C1E]"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
}