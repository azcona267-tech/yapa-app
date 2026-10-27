"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Store, ChevronLeft, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function VendedorPage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [misProductos, setMisProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") {
      setDark(false);
    }
    cargarMisProductos();
  }, []);

  const cargarMisProductos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Consultamos únicamente los productos del vendedor logueado
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendedor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setMisProductos(data);
    } catch (error) {
      console.error("Error al cargar productos del vendedor:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta joyita de tu catálogo?")) return;
    
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setMisProductos(misProductos.filter(p => p.id !== id));
    } catch (error: any) {
      alert("Error al eliminar: " + error.message);
    }
  };

  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const cardClass = dark ? "bg-[#1E1E1E]" : "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]";
  const priceClass = dark ? "text-emerald-400" : "text-emerald-600";

  return (
    <div className={`mx-auto max-w-md min-h-screen px-6 pt-5 pb-32 ${bgClass}`}>
      
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push("/")} className="flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
          <ChevronLeft size={20} /> Volver al inicio
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Mi Negocio</h1>
        <p className="text-sm text-neutral-400 mt-1">Gestiona las joyitas que tienes publicadas en el campus.</p>
      </div>

      {/* Botón principal para publicar */}
      <button 
        onClick={() => router.push("/vendedor/nuevo")}
        className="w-full mb-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-base shadow-lg shadow-emerald-500/20 transition active:scale-95"
      >
        <Plus size={20} /> Publicar Nuevo Producto
      </button>

      {/* Listado de productos del vendedor */}
      <h2 className="text-lg font-bold mb-4">Tus productos activos</h2>

      {loading ? (
        <div className="py-12 text-center text-sm text-neutral-400">Cargando tus publicaciones...</div>
      ) : misProductos.length > 0 ? (
        <div className="grid grid-cols-2 items-start gap-3">
          {misProductos.map((p) => (
            <article key={p.id} className={`overflow-hidden rounded-3xl relative ${cardClass}`}>
              <div className="relative h-40 bg-neutral-800">
                <img src={p.imagen_url} alt={p.titulo} className="h-full w-full object-cover" />
                <button 
                  onClick={() => eliminarProducto(p.id)}
                  className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-red-500/90 text-white shadow-md transition active:scale-90 hover:bg-red-600"
                  title="Eliminar producto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="p-3.5 space-y-1">
                <h3 className="text-sm font-bold leading-snug line-clamp-1">{p.titulo}</h3>
                <p className={`text-base font-extrabold ${priceClass}`}>S/ {p.precio}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-3xl p-6">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#1E1E1E] text-neutral-400">
            <Store size={28} />
          </div>
          <h3 className="text-base font-bold">Aún no tienes productos</h3>
          <p className="mt-1 text-xs text-neutral-400 max-w-[220px]">
            Publica tus chocotejas, postres o accesorios para que los alumnos los vean al instante.
          </p>
        </div>
      )}

    </div>
  );
}