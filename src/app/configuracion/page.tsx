"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, Store, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ConfiguracionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [rolActual, setRolActual] = useState<string>("comprador");

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") setDark(false);
    verificarRol();
  }, []);

  const verificarRol = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
    if (data) setRolActual(data.rol);
  };

  const cambiarAVendedor = async () => {
    if (!confirm("¿Estás seguro de habilitar tu cuenta para vender en el campus?")) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa.");

      const { error } = await supabase
        .from("profiles")
        .update({ rol: "vendedor", whatsapp: "+51999999999" }) // Puedes pedir WhatsApp si deseas luego
        .eq("id", user.id);

      if (error) throw error;
      alert("¡Felicidades! Ahora tu cuenta es de Vendedor.");
      setRolActual("vendedor");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const cardClass = dark ? "bg-[#1E1E1E] border-white/10" : "bg-white border-black/10 shadow-sm";

  return (
    <div className={`min-h-screen px-6 pt-6 pb-12 transition-colors mx-auto max-w-md ${bgClass}`}>
      <button onClick={() => router.back()} className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
        <ChevronLeft size={20} /> Volver
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Configuración</h1>

      <div className="space-y-4">
        {/* Cambiar a Vendedor (Solo si es comprador) */}
        {rolActual === "comprador" && (
          <div className={`p-5 rounded-2xl border flex items-center justify-between ${cardClass}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><Store size={20} /></div>
              <div>
                <p className="font-bold text-sm">Cambiar a Vendedor</p>
                <p className="text-xs text-neutral-400">Publica tus productos en el campus</p>
              </div>
            </div>
            <button onClick={cambiarAVendedor} disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition">
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Activar"}
            </button>
          </div>
        )}

        {rolActual === "vendedor" && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-emerald-500 bg-emerald-500/5 ${cardClass}`}>
            <CheckCircle2 size={20} />
            <p className="text-sm font-bold">Tu cuenta ya está configurada como Vendedor.</p>
          </div>
        )}

        {/* Cambiar Contraseña */}
        <button onClick={() => alert("Próximamente: Te enviaremos un correo para reestablecer tu contraseña.")} className={`w-full p-5 rounded-2xl border flex items-center justify-between transition hover:border-emerald-500/50 ${cardClass}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-500/10 text-neutral-400"><Lock size={20} /></div>
            <div className="text-left">
              <p className="font-bold text-sm">Cambiar Contraseña</p>
              <p className="text-xs text-neutral-400">Actualiza tus credenciales de acceso</p>
            </div>
          </div>
        </button>

        {/* Zona de Peligro: Eliminar Cuenta */}
        <button onClick={() => alert("Por seguridad, contacta con soporte para eliminar tu cuenta.")} className={`w-full p-5 rounded-2xl border border-red-500/20 flex items-center justify-between transition hover:bg-red-500/5 ${cardClass}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500"><Trash2 size={20} /></div>
            <div className="text-left">
              <p className="font-bold text-sm text-red-500">Eliminar Cuenta</p>
              <p className="text-xs text-neutral-400">Borrar permanentemente tus datos</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}