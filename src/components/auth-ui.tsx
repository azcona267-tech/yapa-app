"use client";
import { useState, type InputHTMLAttributes } from "react";
import { Sun, Moon, Eye, EyeOff, type LucideIcon } from "lucide-react";

export function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute right-6 top-12 z-50 grid h-10 w-10 place-items-center rounded-full transition active:scale-90 ${
        dark ? "bg-[#1E1E1E] text-neutral-200" : "bg-white border border-black/10 text-neutral-700 shadow-sm"
      }`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  hint?: string;
  dark: boolean; // Obligamos a pasar el tema
};

export function Field({ label, icon: Icon, hint, type = "text", id, dark, ...props }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? props.name;

  // Colores absolutos y forzados para que el contraste no falle
  const labelColor = dark ? "text-white" : "text-black";
  const inputBg = dark ? "bg-[#1E1E1E] border-white/10 text-white placeholder:text-neutral-500" : "bg-white border-black/10 text-neutral-900 placeholder:text-neutral-400";
  const iconColor = dark ? "text-neutral-400" : "text-neutral-500";

  return (
    <div className="space-y-1.5">
      <label className={`text-sm font-extrabold ${labelColor}`}>
        {label}
      </label>
      <div className="relative">
        <Icon size={18} className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`} />
        <input
          id={inputId}
          type={isPassword && show ? "text" : type}
          className={`w-full rounded-2xl border py-3.5 pl-11 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 ${inputBg} ${isPassword ? "pr-12" : "pr-4"}`}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className={`absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full transition hover:scale-110 ${iconColor}`}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint && <p className={`text-xs ${iconColor}`}>{hint}</p>}
    </div>
  );
}

export const primaryBtn = "flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60";