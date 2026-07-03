"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Calculator,
  Settings,
  ChevronLeft,
  Menu,
  Zap,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Panel Principal",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Inventario / Catálogo",
    href: "/admin/inventario",
    icon: Package,
  },
  {
    label: "Cotización de Tasas",
    href: "/admin",
    icon: Calculator,
  },
  {
    label: "Configuración",
    href: "/admin",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    // Delete authentication cookie
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    router.push("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="md:hidden fixed top-4 left-4 z-[110] p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-[100]
          flex flex-col
          bg-slate-950 border-r border-slate-800/80
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64"}
          min-h-screen
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800/80">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#007BFF]/10 border border-[#007BFF]/20 flex-shrink-0">
            <Zap className="h-4.5 w-4.5 text-[#007BFF]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-mono font-bold text-slate-200 tracking-wider leading-none uppercase">
                Administración
              </span>
              <span className="text-[9px] font-mono text-slate-500 tracking-widest mt-0.5 uppercase">
                Suministros L&D
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#007BFF]/10 text-[#007BFF] border border-[#007BFF]/15 shadow-[0_0_12px_rgba(0,123,255,0.04)]"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-[#007BFF]"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate text-xs font-semibold tracking-wide">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Separator and Logout Button */}
        <div className="px-3 py-2 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className={`
              w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-xs font-semibold tracking-wide text-red-400 hover:bg-red-400/10 hover:text-red-300
              transition-all duration-200 border border-transparent cursor-pointer
              ${collapsed ? "justify-center" : ""}
            `}
            title="Cerrar Sesión Segura"
          >
            <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
            {!collapsed && <span>Cerrar Sesión Segura</span>}
          </button>
        </div>

        {/* Collapse Toggle (desktop) */}
        <div className="hidden md:flex px-3 py-4 border-t border-slate-800/80">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-mono font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors rounded-lg hover:bg-slate-800/50 cursor-pointer"
          >
            <ChevronLeft
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}

export default AdminSidebar;
