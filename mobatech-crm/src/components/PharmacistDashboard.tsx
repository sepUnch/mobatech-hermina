import { useAuthStore } from "@/store/useAuthStore";
import { Formatters } from "@/lib/formatters";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Medicine, Prescription } from "@/types/api";
import { Pill, Activity, AlertTriangle, ArrowRight, CheckCircle, Package } from "lucide-react";

export function PharmacistDashboard() {
  const user = useAuthStore((state) => state.user);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Siang" : "Selamat Malam";

  const [stats, setStats] = useState({ totalMeds: 0, lowStock: 0, pendingPrescriptions: 0, completedPrescriptions: 0, totalPrescriptions: 0, loading: true });

  useEffect(() => {
    async function load() {
      try {
        const [medsRes, pRes] = await Promise.allSettled([
          api.get<Medicine[]>("/api/pharmacy/medicines"),
          api.get<Prescription[]>("/api/admin/pharmacy/prescriptions"),
        ]);
        
        let totalMeds = 0, lowStock = 0, pendingPrescriptions = 0, completedPrescriptions = 0, totalPrescriptions = 0;
        if (medsRes.status === "fulfilled") {
          const meds = medsRes.value.data || [];
          totalMeds = meds.length;
          lowStock = meds.filter(m => m.stock < 10).length;
        }
        if (pRes.status === "fulfilled") {
          const pres = pRes.value.data || [];
          pendingPrescriptions = pres.filter(p => p.status === "pending").length;
          completedPrescriptions = pres.filter(p => p.status === "completed").length;
          totalPrescriptions = pendingPrescriptions + completedPrescriptions;
        }
        setStats({ totalMeds, lowStock, pendingPrescriptions, completedPrescriptions, totalPrescriptions, loading: false });
      } catch {
        setStats(s => ({ ...s, loading: false }));
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-foreground/50">{greeting} 👋</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
            Apoteker {user?.full_name?.split(" ")[0] || "Utama"}
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            {Formatters.date(new Date(), "weekday")}
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Antrean Resep (Biru - Actionable) */}
        <div className="group relative glass-panel p-5 rounded-2xl border border-glass-border shadow-sm bg-blue-500/5 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Antrean E-Resep</p>
              <h2 className="text-3xl font-extrabold text-blue-600 mt-1">{stats.loading ? "..." : stats.pendingPrescriptions}</h2>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl"><Pill size={20} /></div>
          </div>
        </div>

        {/* Master Obat (Netral/Purple) */}
        <div className="group relative glass-panel p-5 rounded-2xl border border-glass-border shadow-sm overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Katalog Obat</p>
              <h2 className="text-3xl font-extrabold text-foreground mt-1">{stats.loading ? "..." : stats.totalMeds}</h2>
            </div>
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl"><CheckCircle size={20} /></div>
          </div>
        </div>

        {/* Stok Kritis (Merah - Peringatan) */}
        <div className="group relative glass-panel p-5 rounded-2xl border border-glass-border shadow-sm bg-red-500/5 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-red-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Stok Kritis</p>
              <h2 className="text-3xl font-extrabold text-red-600 mt-1">{stats.loading ? "..." : stats.lowStock}</h2>
            </div>
            <div className="p-2 bg-red-500/10 text-red-600 rounded-xl"><AlertTriangle size={20} /></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-sm text-foreground/60 uppercase tracking-wider mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/dashboard/prescriptions", icon: <Pill size={20}/>, label: "Proses E-Resep" },
            { href: "/dashboard/pharmacy", icon: <Package size={20}/>, label: "Manajemen Katalog" },
            { href: "/dashboard/stock-opname", icon: <Activity size={20}/>, label: "Stock Opname" },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="glass-panel rounded-2xl border p-4 flex items-center gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all group shadow-sm">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
                {action.icon}
              </div>
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
