"use client";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function NavigationWrapper() {
  const pathname = usePathname();
  // Rutas donde NO queremos que salga la barra
  const authRoutes = ["/login", "/registro", "/perfil","/configuracion", "/vendedor/nuevo"]; 

  if (authRoutes.includes(pathname)) return null;
  return <BottomNav />;
}