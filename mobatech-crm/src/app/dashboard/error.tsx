"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Dashboard Error Boundary Caught:", error);
  }, [error]);
  const handleForceLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) { console.error(e); }
    localStorage.removeItem("hermina-crm-auth");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-slide-in p-6">
      <Card className="max-w-md w-full flex flex-col items-center text-center p-8 border-rose-500/20 bg-rose-500/5">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Sesi Tidak Valid atau Kedaluwarsa</h2>
        <p className="text-sm text-foreground/60 mb-6">
          Maaf, terjadi kesalahan akses (kemungkinan besar karena token lama setelah database di-reset). Silakan coba lagi atau reset sesi Anda.
        </p>
        <div className="w-full space-y-3">
          <Button onClick={() => reset()} variant="primary" className="w-full justify-center">
            Coba Lagi
          </Button>
          <Button onClick={handleForceLogout} variant="outline" className="w-full justify-center text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
            Logout & Reset Sesi
          </Button>
        </div>
      </Card>
    </div>
  );
}

