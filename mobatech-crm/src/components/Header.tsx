"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Sun, Moon, Menu } from "lucide-react";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const [dark, setDark] = useState(false);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const isDark = !dark;
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="h-16 border-b glass-panel flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 lg:left-64 z-10 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-foreground/70"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border glass-panel hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-foreground/70"
          aria-label="Toggle Theme"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-foreground">
              {user?.full_name || "Admin User"}
            </p>
            <p className="text-[10px] text-foreground/50">
              {user?.email || "admin@herminahospitals.com"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
            {getInitials(user?.full_name)}
          </div>
        </div>
      </div>
    </header>
  );
}
