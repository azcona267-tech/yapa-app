"use client";

// app/page.tsx — Marketplace universitario UTP Lima Sur
import { useState, useRef, useEffect } from "react";
import { Sun, Moon, User, Settings, LogOut, Search, Heart, MapPin, X, MessageCircle, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "all", label: "🔥 Destacados" },
  { id: "snacks", label: "🍔 Snacks & Dulces" },
  { id: "tech", label: "🎧 Tecnología & Accesorios" },
  { id: "books", label: "📚 Libros & Apuntes" },
  { id: "ropa", label: "👕 Ropa & Moda" },
  { id: "belleza", label: "✨ Belleza & Cuidado Personal" },
  { id: "utiles", label: "✏️ Útiles & Papelería" },
];

function UserMenu({ onProfile, onSettings, onLogout }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [inicial, setInicial] = useState<string>("U");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarAvatarReal();

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cargarAvatarReal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("nombre, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.nombre) setInicial(data.nombre.charAt(0).toUpperCase());
      }
    } catch (error) {
      console.error("Error cargando avatar en header:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 overflow-hidden rounded-full border-2 border-transparent transition-all hover:border-emerald-500 active:scale-95 flex items-center justify-center bg-emerald-600/20 text-emerald-500 font-bold"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span>{inicial}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-black/10 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#1E1E1E] z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <button onClick={onProfile} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/5">
            <User size={18} /> Mi Perfil
          </button>
          <button onClick={onSettings} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/5">
            <Settings size={18} /> Configuración
          </button>
          
          <div className="my-1 h-px w-full bg-black/5 dark:bg-white/5" />
          
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [cat, setCat] = useState("all");
  const [saved, setSaved] = useState<string[]>([]);

  // Lee los favoritos guardados al iniciar la página
  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") {
      setDark(false);
    }
    const guardadosLocales = JSON.parse(localStorage.getItem("yapa-favoritos") || "[]");
    setSaved(guardadosLocales);
    cargarProductos();
  }, []);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") {
      setDark(false);
    }
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const cambiarTema = () => {
    const nuevoDark = !dark;
    setDark(nuevoDark);
    localStorage.setItem("yapa-tema", nuevoDark ? "oscuro" : "claro");
  };

  const items = cat === "all" ? products : products.filter((p) => p.categoria === cat);
  
  const toggleSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const stored = JSON.parse(localStorage.getItem("yapa-favoritos") || "[]");
    let nuevos;
    if (stored.includes(id)) {
      nuevos = stored.filter((x: string) => x !== id);
    } else {
      nuevos = [...stored, id];
    }
    localStorage.setItem("yapa-favoritos", JSON.stringify(nuevos));
    setSaved(nuevos);
  };

  const cols = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];

  const t = dark
    ? {
        root: "bg-[#121212] text-white",
        header: "bg-[#121212]/90 border-white/5",
        soft: "bg-[#1E1E1E] text-neutral-200",
        muted: "text-neutral-400",
        card: "bg-[#1E1E1E]",
        price: "text-emerald-400",
        chip: "bg-[#1E1E1E] text-neutral-200 border-white/5",
        chipOn: "bg-emerald-500 text-[#06251a]",
        modalBg: "bg-[#1E1E1E] text-white",
      }
    : {
        root: "bg-[#FAFAF8] text-neutral-900",
        header: "bg-[#FAFAF8]/90 border-black/5",
        soft: "bg-white text-neutral-800 shadow-sm",
        muted: "text-neutral-500",
        card: "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]",
        price: "text-emerald-600",
        chip: "bg-white text-neutral-800 border-black/10",
        chipOn: "bg-neutral-950 text-white",
        modalBg: "bg-white text-neutral-900",
      };

  return (
    <div className={`${t.root} max-w-md mx-auto min-h-screen relative overflow-x-hidden shadow-2xl transition-colors duration-300`}>
      <header className={`sticky top-0 z-30 border-b px-4 pb-3 pt-4 backdrop-blur-xl ${t.header}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
              <MapPin size={20} />
            </span>
            <div className="leading-tight">
              <p className={`text-xs ${t.muted}`}>Estás comprando en</p>
              <p className="text-base font-bold">UTP — Lima Sur</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={cambiarTema}
              aria-label="Cambiar tema"
              className={`grid h-10 w-10 place-items-center rounded-full transition active:scale-90 ${t.soft}`}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <UserMenu
              onProfile={() => router.push("/perfil")}
              onSettings={() => router.push("/configuracion")}
              onLogout={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
            />
          </div>
        </div>

        <label className={`mt-4 flex items-center gap-3 rounded-2xl px-4 py-3.5 ${t.soft}`}>
          <Search size={18} className={t.muted} />
          <input
            placeholder="¿Qué buscas en el campus?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
          />
        </label>
      </header>

      <main className="px-4 pb-36 pt-5">
        <div className="flex items-end justify-between gap-4">
          <div className="shrink min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-emerald-500">CERCA DE TI</p>
            <h1 className="truncate text-[28px] font-extrabold leading-tight tracking-tight">Encuentra joyitas</h1>
          </div>
        </div>

        <div className="-mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
                cat === c.id ? `${t.chipOn} border-transparent` : t.chip
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loadingProducts ? (
          <div className="mt-20 text-center text-sm text-neutral-400">Cargando joyitas del campus...</div>
        ) : items.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 items-start gap-3">
            {cols.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-3">
                {col.map((p) => {
                  const isSaved = saved.includes(p.id);
                  return (
                    <article 
                      key={p.id} 
                      onClick={() => setSelectedProduct(p)}
                      className={`overflow-hidden rounded-3xl transition active:scale-[0.98] cursor-pointer ${t.card}`}
                    >
                      <div className="relative h-44 bg-neutral-800">
                        <img src={p.imagen_url} alt={p.titulo} loading="lazy" className="h-full w-full object-cover" />
                        <button 
                          onClick={(e) => toggleSaved(p.id, e)} 
                          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-md transition active:scale-90"
                        >
                          <Heart size={16} className={isSaved ? "fill-emerald-500 text-emerald-500" : "text-neutral-700"} />
                        </button>
                      </div>
                      <div className="space-y-1.5 p-3.5">
                        <h3 className="text-[15px] font-bold leading-snug">{p.titulo}</h3>
                        {p.descripcion && (
                          <p className="text-xs text-neutral-400 line-clamp-2">{p.descripcion}</p>
                        )}
                        <p className={`text-lg font-extrabold ${t.price}`}>S/ {p.precio}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center text-center px-4">
            <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-neutral-200 dark:bg-[#1E1E1E]">
              <MapPin size={32} className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Aún no hay joyitas</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-[250px]">
              Sé el primero en publicar un producto en tu campus y empieza a ganar dinero hoy.
            </p>
          </div>
        )}
      </main>

      {/* MODAL DE DETALLE DEL PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${t.modalBg} animate-in slide-in-from-bottom duration-300`}>
            
            {/* Imagen del producto en el modal */}
            <div className="relative h-72 w-full bg-neutral-900">
              <img src={selectedProduct.imagen_url} alt={selectedProduct.titulo} className="h-full w-full object-cover" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
              >
                <X size={20} />
              </button>
              <span className="absolute left-4 bottom-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-[#06251a] uppercase tracking-wider">
                {selectedProduct.categoria}
              </span>
            </div>

            {/* Contenido del detalle */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <h2 className="text-2xl font-extrabold">{selectedProduct.titulo}</h2>
                <p className={`text-2xl font-black mt-1 ${t.price}`}>S/ {selectedProduct.precio}</p>
              </div>

              {selectedProduct.descripcion && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Descripción y sabores</p>
                  <p className="text-sm leading-relaxed opacity-90">{selectedProduct.descripcion}</p>
                </div>
              )}

              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex gap-3">
                <button 
                  onClick={() => {
                    const telefonoVendedor = selectedProduct.telefono || "51999999999"; // Número de respaldo por seguridad
                    const mensaje = encodeURIComponent(`¡Hola! Vi tu producto "${selectedProduct.titulo}" en Yapa (UTP Lima Sur) y estoy interesado/a.`);
                    window.open(`https://wa.me/${telefonoVendedor}?text=${mensaje}`, "_blank");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition active:scale-95"
                >
                  <MessageCircle size={20} /> Contactar por WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}