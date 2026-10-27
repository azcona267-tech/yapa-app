"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Heart, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function GuardadosPage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") {
      setDark(false);
    }
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      // 1. Obtenemos los IDs guardados en el localStorage
      const savedIds = JSON.parse(localStorage.getItem("yapa-favoritos") || "[]");
      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Consultamos a Supabase solo los productos cuyos IDs estén en la lista
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", savedIds);

      if (error) throw error;
      if (data) setSavedProducts(data);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarFavorito = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nuevosIds = JSON.parse(localStorage.getItem("yapa-favoritos") || "[]").filter((item: string) => item !== id);
    localStorage.setItem("yapa-favoritos", JSON.stringify(nuevosIds));
    setSavedProducts(savedProducts.filter(p => p.id !== id));
  };

  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const cardClass = dark ? "bg-[#1E1E1E]" : "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]";
  const priceClass = dark ? "text-emerald-400" : "text-emerald-600";

  return (
    <div className={`mx-auto max-w-md min-h-screen px-6 pt-5 pb-24 ${bgClass}`}>
      <button onClick={() => router.back()} className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
        <ChevronLeft size={20} /> Volver
      </button>
      
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Tus Favoritos</h1>

      {loading ? (
        <div className="py-20 text-center text-sm text-neutral-400">Cargando favoritos...</div>
      ) : savedProducts.length > 0 ? (
        <div className="grid grid-cols-2 items-start gap-3">
          {savedProducts.map((p) => (
            <article key={p.id} className={`overflow-hidden rounded-3xl transition active:scale-[0.98] ${cardClass}`}>
              <div className="relative h-44 bg-neutral-800">
                <img src={p.imagen_url} alt={p.titulo} loading="lazy" className="h-full w-full object-cover" />
                <button 
                  onClick={(e) => eliminarFavorito(p.id, e)} 
                  className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-md transition active:scale-90"
                >
                  <Heart size={16} className="fill-emerald-500 text-emerald-500" />
                </button>
              </div>
              <div className="space-y-1.5 p-3.5">
                <h3 className="text-[15px] font-bold leading-snug">{p.titulo}</h3>
                {p.descripcion && (
                  <p className="text-xs text-neutral-400 line-clamp-2">{p.descripcion}</p>
                )}
                <p className={`text-lg font-extrabold ${priceClass}`}>S/ {p.precio}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="mb-4 text-neutral-300 dark:text-neutral-700" />
          <p className="text-neutral-500">Aún no has guardado ninguna joyita.</p>
        </div>
      )}
    </div>
  );
}