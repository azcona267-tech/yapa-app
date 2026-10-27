"use client";
import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, ShoppingBag, Store, Loader2, MapPin } from "lucide-react";
import { Field, ThemeToggle, primaryBtn } from "@/components/auth-ui";
import { supabase } from "@/lib/supabase";

type Role = "comprar" | "vender";
const ROLES: { id: Role; label: string; Icon: typeof ShoppingBag }[] = [
  { id: "comprar", label: "Comprar", Icon: ShoppingBag },
  { id: "vender", label: "Vender", Icon: Store },
];

export default function RegistroPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("comprar");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") {
      setDark(false);
    }
  }, []);

  const cambiarTema = () => {
    const nuevoDark = !dark;
    setDark(nuevoDark);
    localStorage.setItem("yapa-tema", nuevoDark ? "oscuro" : "claro");
  };

  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const tabBgClass = dark ? "border-white/10 bg-[#1E1E1E]" : "border-black/10 bg-white";
  const selectClass = dark ? "bg-[#1E1E1E] border-white/10 text-white" : "bg-white border-black/10 text-neutral-900";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email: data.get("email") as string, 
        password: data.get("password") as string 
      });
      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          { 
            id: authData.user.id, 
            nombre: data.get("name") as string, 
            email: data.get("email") as string, 
            rol: role === "vender" ? "vendedor" : "comprador", 
            whatsapp: role === "vender" ? `+51${data.get("whatsapp")}` : null, 
            campus_id: data.get("campus") as string 
          }
        ]);
        if (profileError) throw profileError;
        router.push("/");
      }
    } catch (error: any) {
      alert("Error al registrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors pb-10 ${bgClass}`}>
      <div className="mx-auto relative flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <ThemeToggle dark={dark} onToggle={cambiarTema} />

        <div className="mb-8">
          <h1 className={`text-5xl font-extrabold tracking-tight ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Yapa.</h1>
          <p className={`mt-3 text-[15px] ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>Crea tu cuenta y únete al campus.</p>
        </div>

        <div role="tablist" className={`relative mb-6 grid grid-cols-2 rounded-2xl border p-1 ${tabBgClass}`}>
          <span className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-emerald-600 shadow-md shadow-emerald-500/25 transition-transform duration-300 ease-out ${dark ? "bg-emerald-500" : ""} ${role === "vender" ? "translate-x-full" : "translate-x-0"}`} />
          {ROLES.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setRole(id)} className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${role === id ? "text-white" : (dark ? "text-neutral-400" : "text-neutral-500")}`}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field dark={dark} label="Nombre" name="name" icon={User} placeholder="Tu nombre" required />
          <Field dark={dark} label="Correo universitario" name="email" type="email" icon={Mail} placeholder="tucodigo@utp.edu.pe" required />
          <Field dark={dark} label="Contraseña" name="password" type="password" icon={Lock} placeholder="Mínimo 8 caracteres" minLength={8} required />
          
          <div className="flex flex-col gap-1.5">
            <label className={`text-sm font-extrabold ${dark ? "text-white" : "text-black"}`}>Sede UTP</label>
            <div className="relative">
              <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-neutral-400" : "text-neutral-500"}`} size={20} />
              <select name="campus" required defaultValue="" className={`w-full appearance-none rounded-2xl border py-3.5 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 ${selectClass}`}>
                <option value="" disabled>Selecciona tu sede</option>
                <option value="utp-lima-sur">UTP Lima Sur</option>
                <option value="utp-lima-centro">UTP Lima Centro</option>
                <option value="utp-lima-norte">UTP Lima Norte</option>
                <option value="utp-ate">UTP Ate</option>
              </select>
            </div>
          </div>

          {role === "vender" && <Field dark={dark} label="Número de WhatsApp" name="whatsapp" type="tel" icon={Phone} placeholder="987654321" pattern="9[0-9]{8}" maxLength={9} required />}

          <button type="submit" disabled={loading} className={`${primaryBtn} mt-4`}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Crear Cuenta"}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          ¿Ya tienes cuenta? <Link href="/login" className={`font-semibold hover:underline ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}