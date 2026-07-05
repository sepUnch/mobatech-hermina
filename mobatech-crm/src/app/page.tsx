"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [mounted, token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-foreground/60 animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
