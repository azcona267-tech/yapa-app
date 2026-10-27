"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NuevoProductoPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para publicar.");
      if (!file) throw new Error("Por favor, sube una foto del producto.");

      const formData = new FormData(formRef.current);
      const titulo = formData.get("titulo") as string;
      const descripcion = formData.get("descripcion") as string;
      const precio = formData.get("precio") as string;
      const categoria = formData.get("categoria") as string;
      const telefono = formData.get("telefono") as string;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = await supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('products').insert([
        {
          vendedor_id: user.id,
          titulo,
          descripcion,
          precio,
          categoria,
          telefono,
          imagen_url: publicUrl,
        }
      ]);

      if (dbError) throw dbError;
      
      router.push("/");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 pt-5 pb-10 bg-[#121212] text-white mx-auto max-w-md">
      <button onClick={() => router.back()} className="mb-6 flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500">
        <ChevronLeft size={20} /> Volver
      </button>
      
      <h1 className="text-3xl font-bold tracking-tight mb-6">Nuevo Producto</h1>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-extrabold">Foto del producto</label>
          <div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-[#1E1E1E] hover:bg-white/5">
            {preview ? (
              <img src={preview} alt="Vista previa" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <div className="flex flex-col items-center text-neutral-400">
                <ImageIcon size={40} className="mb-2 opacity-50" />
                <span className="text-sm font-medium">Toca para subir foto</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" required />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-extrabold">Título</label>
          <input type="text" name="titulo" placeholder="Ej. Chocotejas artesanales" required className="w-full rounded-2xl border border-white/10 bg-[#1E1E1E] py-3.5 px-4 outline-none focus:border-emerald-500" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-extrabold">Descripción y sabores</label>
          <textarea name="descripcion" rows={3} placeholder="Ej. Sabores: Pecana, manjar, maracuyá y coco." className="w-full rounded-2xl border border-white/10 bg-[#1E1E1E] py-3.5 px-4 outline-none focus:border-emerald-500 resize-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-extrabold">Tu número de WhatsApp (con código de país)</label>
          <input type="tel" name="telefono" placeholder="Ej. 51987654321" required className="w-full rounded-2xl border border-white/10 bg-[#1E1E1E] py-3.5 px-4 outline-none focus:border-emerald-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-extrabold">Precio (S/)</label>
            <input type="number" name="precio" step="0.10" min="0" placeholder="0.00" required className="w-full rounded-2xl border border-white/10 bg-[#1E1E1E] py-3.5 px-4 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-extrabold">Categoría</label>
            <select name="categoria" required defaultValue="" className="w-full appearance-none rounded-2xl border border-white/10 bg-[#1E1E1E] py-3.5 px-4 outline-none focus:border-emerald-500">
              <option value="" disabled>Elige...</option>
              <option value="snacks">Snacks & Dulces</option>
              <option value="tech">Tecnología & Accesorios</option>
              <option value="ropa">Ropa & Moda</option>
              <option value="books">Libros & Apuntes</option>
              <option value="belleza">Belleza & Cuidado Personal</option>
              <option value="utiles">Útiles & Papelería</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-60">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <><Upload size={20} /> Publicar Joyita</>}
        </button>
      </form>
    </div>
  );
}