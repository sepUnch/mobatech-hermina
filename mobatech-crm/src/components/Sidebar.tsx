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
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "admin";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    router.replace("/login");
  };

  const navItems = [
    { name: APP_STRINGS.sidebar.dashboard, path: "/dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "pharmacist", "doctor"] },
    { name: "Daftar Pasien", path: "/dashboard/patients", icon: <Users size={20} />, roles: ["admin", "doctor"] },
    { name: APP_STRINGS.sidebar.polyclinics, path: "/dashboard/polyclinics", icon: <Building2 size={20} />, roles: ["admin"] },
    { name: "Cabang RS", path: "/dashboard/branches", icon: <Building2 size={20} />, roles: ["admin"] },
    { name: APP_STRINGS.sidebar.doctors, path: "/dashboard/doctors", icon: <Stethoscope size={20} />, roles: ["admin"] },
    { name: "Antrean", path: "/dashboard/appointments", icon: <CalendarDays size={20} />, roles: ["admin", "doctor"] },
    { name: "Darurat", path: "/dashboard/emergencies", icon: <Siren size={20} />, roles: ["admin"] },
    { name: "Apotek", path: "/dashboard/pharmacy", icon: <Pill size={20} />, roles: ["admin", "pharmacist"] },
    { name: "Hasil Medis", path: "/dashboard/medical-results", icon: <FileText size={20} />, roles: ["admin", "doctor"] },
    { name: "Pengingat", path: "/dashboard/reminders", icon: <Bell size={20} />, roles: ["admin"] },
    { name: APP_STRINGS.sidebar.aiAudit, path: "/dashboard/ai-audit", icon: <Bot size={20} />, roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 border-r glass-panel flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-glass-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg mr-3 shadow-md">
          H
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">
          {APP_STRINGS.sidebar.title}
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
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
  );
}
