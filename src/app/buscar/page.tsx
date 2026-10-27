"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Search } from "lucide-react";

export default function BuscarPage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);

  // Solo necesitamos leer la memoria del navegador al cargar
  useEffect(() => {
    const temaGuardado = localStorage.getItem("yapa-tema");
    if (temaGuardado === "claro") {
      setDark(false);
    }
  }, []);

  // Variables de color dependiendo del tema (igual que en page.tsx)
  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const inputClass = dark ? "bg-[#1E1E1E] text-white ring-white/10" : "bg-white text-neutral-900 ring-black/5";

  return (
    <div className={`mx-auto max-w-md min-h-screen px-6 pt-5 ${bgClass}`}>
      <button onClick={() => router.back()} className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
        <ChevronLeft size={20} /> Volver
      </button>
      
      <h1 className="text-3xl font-bold tracking-tight mb-6">Buscar</h1>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input 
          type="text" 
          placeholder="Ej. chocotejas pabellón C" 
          className={`w-full rounded-2xl border-none py-4 pl-12 pr-4 shadow-sm outline-none ring-1 placeholder:text-neutral-500 ${inputClass}`} 
        />
      </div>
    </div>
  );
}