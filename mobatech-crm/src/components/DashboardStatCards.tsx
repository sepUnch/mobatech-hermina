import { DashboardStats } from "@/app/dashboard/types";
import { StatCard } from "./StatCard";
import { Users, CalendarDays, Stethoscope, Siren } from "lucide-react";

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
      <StatCard 
        icon={<Users size={20} />} 
        label="Total Pasien" 
        value={stats.patients} 
        sub="Terdaftar" 
        href="/dashboard/patients" 
        colorClass="bg-blue-500 text-blue-600" 
      />
      <StatCard 
        icon={<CalendarDays size={20} />} 
        label="Antrean Hari Ini" 
        value={stats.totalAppointments} 
        sub={`${stats.pendingAppointments} Menunggu`} 
        href="/dashboard/appointments" 
        colorClass="bg-purple-500 text-purple-600" 
      />
      <StatCard 
        icon={<Stethoscope size={20} />} 
        label="Dokter" 
        value={stats.doctors} 
        sub={`${stats.polyclinics} Poliklinik`} 
        href="/dashboard/doctors" 
        colorClass="bg-emerald-500 text-emerald-600" 
      />
      <StatCard 
        icon={<Siren size={20} />} 
        label="Darurat" 
        value={stats.activeEmergencies} 
        sub="Kasus Aktif" 
        href="/dashboard/emergencies" 
        colorClass="bg-red-500 text-red-600" 
      />
    </div>
  );
}
