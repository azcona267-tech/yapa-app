"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, MapPin, Phone, Camera, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dark, setDark] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (localStorage.getItem("yapa-tema") === "claro") setDark(false);
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setPerfil(data);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa.");

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Subir al Bucket de Storage (usamos el bucket 'productos' o uno llamado 'avatars')
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("productos")
        .getPublicUrl(filePath);

      // 3. Actualizar la tabla profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Refrescar estado local
      setPerfil({ ...perfil, avatar_url: publicUrl });
      alert("¡Foto de perfil actualizada con éxito!");
    } catch (error: any) {
      alert("Error al subir imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const bgClass = dark ? "bg-[#121212] text-white" : "bg-[#FAFAF8] text-neutral-900";
  const cardClass = dark ? "bg-[#1E1E1E] border-white/10" : "bg-white border-black/10 shadow-sm";

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <Loader2 size={40} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 pt-6 pb-12 transition-colors mx-auto max-w-md ${bgClass}`}>
      <button onClick={() => router.back()} className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
        <ChevronLeft size={20} /> Volver
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Mi Perfil</h1>

      {/* Avatar interactivo estilo app normal */}
      <div className="flex flex-col items-center mb-8">
        <label className="relative group cursor-pointer">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-emerald-500 flex items-center justify-center bg-emerald-600/20 text-emerald-500 text-3xl font-bold shadow-inner transition group-hover:opacity-90">
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-emerald-500" />
            ) : perfil?.avatar_url ? (
              <img src={perfil.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              perfil?.nombre ? perfil.nombre.charAt(0).toUpperCase() : "U"
            )}
          </div>
          
          {/* Icono de cámara flotante al pasar el mouse o tocar */}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={24} className="text-white" />
          </div>

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange} 
            className="hidden" 
          />
        </label>
        
        <span className="text-xs text-neutral-400 mt-2">Toca la foto para cambiarla</span>
        <h2 className="text-xl font-bold mt-2">{perfil?.nombre}</h2>
        <span className="mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
          {perfil?.rol}
        </span>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${cardClass}`}>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><Mail size={20} /></div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Correo Institucional</p>
            <p className="text-sm font-semibold">{perfil?.email}</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${cardClass}`}>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><MapPin size={20} /></div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Sede / Campus</p>
            <p className="text-sm font-semibold capitalize">{perfil?.campus_id?.replace("utp-", "").replace("-", " ")}</p>
          </div>
        </div>

        {perfil?.whatsapp && (
          <div className={`p-4 rounded-2xl border flex items-center gap-4 ${cardClass}`}>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><Phone size={20} /></div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">WhatsApp de contacto</p>
              <p className="text-sm font-semibold">{perfil?.whatsapp}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}