"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { APP_STRINGS } from "@/lib/constants";
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  CalendarDays,
  Siren,
  Pill,
  FileText,
  Bell,
  Bot,
  LogOut,
  Activity,
  Archive,
  ShoppingCart
} from "lucide-react";

import { useUIStore } from "@/store/useUIStore";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "admin";
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    router.replace("/login");
  };

  const navItems = [
    { name: APP_STRINGS.sidebar.dashboard, path: "/dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "pharmacist", "doctor"] },
    
    { name: "Manajemen Pengguna", path: "/dashboard/users", icon: <Users size={20} />, roles: ["admin"] },
    { name: APP_STRINGS.sidebar.polyclinics, path: "/dashboard/polyclinics", icon: <Building2 size={20} />, roles: ["admin"] },
    { name: "Cabang RS", path: "/dashboard/branches", icon: <Building2 size={20} />, roles: ["admin"] },
    
    { name: "Manajemen Dokter", path: "/dashboard/doctors", icon: <Stethoscope size={20} />, roles: ["admin"] },
    { name: "Jadwal Praktik", path: "/dashboard/doctors", icon: <CalendarDays size={20} />, roles: ["doctor"] },
    
    { name: "Database Pasien", path: "/dashboard/patients", icon: <Users size={20} />, roles: ["admin"] },
    { name: "Pasien Saya", path: "/dashboard/patients", icon: <Users size={20} />, roles: ["doctor"] },
    { name: "Seluruh Antrean", path: "/dashboard/appointments", icon: <CalendarDays size={20} />, roles: ["admin"] },
    { name: "Antrean Klinik", path: "/dashboard/appointments", icon: <CalendarDays size={20} />, roles: ["doctor"] },
    
    { name: "Darurat", path: "/dashboard/emergencies", icon: <Siren size={20} />, roles: ["admin"] },
    
    { name: "Inventaris Apotek", path: "/dashboard/pharmacy", icon: <Pill size={20} />, roles: ["admin"] },
    { name: "Katalog Obat", path: "/dashboard/pharmacy", icon: <Pill size={20} />, roles: ["pharmacist"] },
    { name: "Log E-Resep", path: "/dashboard/prescriptions", icon: <FileText size={20} />, roles: ["admin"] },
    { name: "Proses E-Resep", path: "/dashboard/prescriptions", icon: <FileText size={20} />, roles: ["pharmacist"] },
    
    { name: "Arsip Medis", path: "/dashboard/medical-results", icon: <FileText size={20} />, roles: ["admin"] },
    { name: "Input Hasil Medis", path: "/dashboard/medical-results", icon: <FileText size={20} />, roles: ["doctor"] },
    
    { name: "Pengingat", path: "/dashboard/reminders", icon: <Bell size={20} />, roles: ["admin"] },
    { name: "Manajemen Promo", path: "/dashboard/promos", icon: <FileText size={20} />, roles: ["admin"] },
    { name: APP_STRINGS.sidebar.aiAudit, path: "/dashboard/ai-audit", icon: <Bot size={20} />, roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`w-64 border-r glass-panel flex flex-col h-screen fixed left-0 top-0 z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center px-6 border-b border-glass-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg mr-3 shadow-md">
            H
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            {APP_STRINGS.sidebar.title}
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground/75 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <span className={isActive ? "text-primary-foreground" : "text-foreground/60"}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-glass-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={20} />
            <span>{APP_STRINGS.sidebar.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
