import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { BorderBeam } from "@/components/ui/BorderBeam";
import {
  LayoutDashboard,
  Users,
  RefreshCw,
  History,
  CalendarDays,
  DollarSign,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

// Estructura de navegación principal
const navItems = [
  { path: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { path: "/clientes",     label: "Clientes",     icon: Users },
  { path: "/renovaciones", label: "Renovaciones", icon: RefreshCw },
  { path: "/calendario",   label: "Calendario",   icon: CalendarDays },
  { path: "/finanzas",     label: "Finanzas",     icon: DollarSign },
  { path: "/historial",    label: "Reportes",     icon: History },
];

/**
 * Sidebar de navegación vertical con efecto glassmorphism
 * Desktop: fijo izquierda. Móvil: drawer deslizable con overlay.
 */
export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut, isAuthenticated } = useAuth();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <>
      {/* ── Barra superior móvil (solo visible en <md) ────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-black/70 px-4 backdrop-blur-xl md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo-simple.svg" alt="SociosMembres" className="h-8 w-8" />
          <span className="text-sm font-bold text-white">SociosMembres</span>
        </Link>
        <button
          onClick={() => setSidebarAbierto(!sidebarAbierto)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          {sidebarAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* ── Overlay móvil ──────────────────────────────────────────────── */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-60 flex-col",
          "border-r border-white/10 bg-black/75 backdrop-blur-xl",
          "transition-transform duration-300 ease-out",
          // Desktop: siempre visible
          "md:translate-x-0",
          // Móvil: slide in/out
          sidebarAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <BorderBeam className="h-9 w-9 shrink-0">
            <img src="/logo.svg" alt="SociosMembres" className="h-9 w-9" />
          </BorderBeam>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-white">SociosMembres</p>
            <p className="text-[10px] leading-tight text-white/40">Panel de gestión</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarAbierto(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                    "transition-all duration-200 ease-out",
                    isActive
                      ? "border border-primary/20 bg-gradient-to-r from-primary/20 to-accent/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-primary" : ""
                    )}
                  />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Usuario + logout */}
        {isAuthenticated && (
          <div className="space-y-1 border-t border-white/10 px-3 py-4">
            {profile && (
              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/30">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{profile.nombre}</p>
                  <p className="truncate text-[10px] text-white/40">{profile.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
