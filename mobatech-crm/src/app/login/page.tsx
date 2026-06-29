"use client";

import { useState, useEffect } from "react";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { APP_STRINGS } from "@/lib/constants";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    if (prefersDark) document.documentElement.classList.add("dark");
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

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ isOpen: true, message, type });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl border glass-panel hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Toggle Theme"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <main className="w-full max-w-md p-8 rounded-2xl border glass-card animate-slide-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg text-primary-foreground font-bold text-xl">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{APP_STRINGS.login.title}</h1>
          <p className="text-sm text-foreground/60 text-center mt-2">{APP_STRINGS.login.subtitle}</p>
        </div>

        <LoginForm showToast={showToast} />
      </main>

      <CustomSnackbar
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, isOpen: false }))}
      />
    </div>
  );
}
