import Link from "next/link";
import { DashboardStats } from "@/app/dashboard/types";
import { StatCard } from "./StatCard";

export function DashboardStatCards({ stats }: { stats: DashboardStats }) {
  if (stats.loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl border p-5 h-32 animate-pulse">
            <div className="w-10 h-10 bg-foreground/10 rounded-xl mb-3" />
            <div className="h-3 bg-foreground/10 rounded w-2/3 mb-2" />
            <div className="h-7 bg-foreground/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon="👥" label="Total Pasien" value={stats.patients} sub="Terdaftar di Mobile" href="/dashboard/patients" color="bg-blue-500" />
      <StatCard icon="📅" label="Antrean Hari Ini" value={stats.totalAppointments} sub={`${stats.pendingAppointments} Menunggu`} href="/dashboard/appointments" color="bg-primary" />
      <StatCard icon="🩺" label="Dokter" value={stats.doctors} sub={`${stats.polyclinics} Poliklinik`} href="/dashboard/doctors" color="bg-teal-500" />
      <StatCard icon="🚨" label="Gawat Darurat" value={stats.activeEmergencies} sub="Kasus Aktif" href="/dashboard/emergencies" color="bg-red-500" />
    </div>
  );
}
