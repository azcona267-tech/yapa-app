"use client";
import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Field, ThemeToggle, primaryBtn } from "@/components/auth-ui";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      // 1. Supabase valida las credenciales
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // 2. Si es correcto, lo mandamos al campus (Inicio)
      router.push("/");
    } catch (error: any) {
      alert("Error al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${bgClass}`}>
      <div className="mx-auto relative flex min-h-screen max-w-md flex-col justify-center px-6">
        <ThemeToggle dark={dark} onToggle={cambiarTema} />

        <div className="mb-10">
          <h1 className={`text-6xl font-extrabold tracking-tight ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Yapa.</h1>
          <p className={`mt-3 text-[15px] ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>Compra y vende dentro de tu campus.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field dark={dark} label="Correo universitario" name="email" type="email" icon={Mail} placeholder="tucodigo@utp.edu.pe" autoComplete="email" required />
          <Field dark={dark} label="Contraseña" name="password" type="password" icon={Lock} placeholder="••••••••" autoComplete="current-password" required />

          <button type="submit" disabled={loading} className={`${primaryBtn} mt-2`}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Iniciar Sesión"}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          ¿No tienes cuenta? <Link href="/registro" className={`font-semibold hover:underline ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}