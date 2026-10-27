"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, HelpCircle, MapPin, ShieldCheck, MessageCircle, BookOpen } from "lucide-react";

export default function SoportePage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") {
      setDark(false);
    }
  }, []);

  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const cardClass = dark ? "bg-[#1E1E1E] border-white/5" : "bg-white border-black/5 shadow-sm";

  return (
    <div className={`mx-auto max-w-md min-h-screen px-6 pt-5 pb-32 ${bgClass}`}>
      
      {/* Botón Volver */}
      <button onClick={() => router.push("/")} className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
        <ChevronLeft size={20} /> Volver al inicio
      </button>

      {/* Título */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle size={14} /> Centro de Ayuda
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Soporte y Guías</h1>
        <p className="text-sm text-neutral-400 mt-1">Todo lo que necesitas saber para comprar y vender seguro en la UTP.</p>
      </div>

      <div className="space-y-4">

        {/* Tarjeta 1: Puntos seguros de entrega */}
        <div className={`p-5 rounded-3xl border ${cardClass} space-y-2`}>
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-base">
            <MapPin size={20} /> Puntos de entrega sugeridos
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Para mayor seguridad, te recomendamos coordinar la entrega de tus productos en zonas transitadas del campus como la <strong>cafetería principal</strong> o el <strong>ingreso a los pabellones</strong> entre clases.
          </p>
        </div>

        {/* Tarjeta 2: Venta segura */}
        <div className={`p-5 rounded-3xl border ${cardClass} space-y-2`}>
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-base">
            <ShieldCheck size={20} /> Transacciones directas
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Yapa no cobra comisiones. El pago y la entrega se coordinan directamente entre comprador y vendedor mediante WhatsApp al concretar el acuerdo.
          </p>
        </div>

        {/* Tarjeta 3: Reglas de la comunidad */}
        <div className={`p-5 rounded-3xl border ${cardClass} space-y-2`}>
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-base">
            <BookOpen size={20} /> Reglas del marketplace
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Solo se permiten productos aptos para la comunidad universitaria (snacks, apuntes, tecnología, accesorios). Evita publicar artículos prohibidos.
          </p>
        </div>

      </div>

      {/* Botón de contacto directo con soporte */}
      <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-900/10 border border-emerald-500/20 text-center space-y-4">
        <h3 className="font-bold text-base">¿Tienes algún problema con un producto?</h3>
        <p className="text-xs text-neutral-400">Escríbenos directamente al soporte oficial de Yapa para ayudarte a resolverlo.</p>
        <button 
          onClick={() => window.open("https://wa.me/51999999999?text=Hola,%20necesito%20soporte%20con%20la%20app%20Yapa.", "_blank")}
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <MessageCircle size={18} /> Hablar con Soporte
        </button>
      </div>

    </div>
  );
}