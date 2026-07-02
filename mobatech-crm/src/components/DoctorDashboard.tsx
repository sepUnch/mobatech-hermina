import { useAuthStore } from "@/store/useAuthStore";
import { Formatters } from "@/lib/formatters";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Appointment, Doctor } from "@/types/api";
import { Clock, CheckCircle, CalendarDays, ArrowRight, UserPlus } from "lucide-react";

export function DoctorDashboard() {
  const user = useAuthStore((state) => state.user);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Siang" : "Selamat Malam";

  const [stats, setStats] = useState({ pending: 0, completed: 0, today: 0, loading: true });

  useEffect(() => {
    async function load() {
      try {
        const [docsRes, apptsRes] = await Promise.allSettled([
          api.get<Doctor[]>("/api/doctors"),
          api.get<Appointment[]>("/api/admin/appointments"),
        ]);
        
        let pending = 0, completed = 0, today = 0;
        if (docsRes.status === "fulfilled" && apptsRes.status === "fulfilled") {
          const docs = docsRes.value.data || [];
          const appts = apptsRes.value.data || [];
          const myDoc = docs.find(d => d.user_id === user?.id);
          
          if (myDoc) {
            const myAppts = appts.filter(a => a.doctor_id === myDoc.id);
            pending = myAppts.filter(a => a.status === "pending").length;
            completed = myAppts.filter(a => a.status === "completed").length;
            today = myAppts.length;
          } else {
            pending = appts.filter(a => a.status === "pending").length;
            completed = appts.filter(a => a.status === "completed").length;
            today = appts.length;
          }
        }
        setStats({ pending, completed, today, loading: false });
      } catch {
        setStats(s => ({ ...s, loading: false }));
      }
    }
    load();
  }, [user?.id]);

  const progress = stats.today > 0 ? Math.round((stats.completed / stats.today) * 100) : 0;

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-foreground/50">{greeting} 👋</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
            Dr. {user?.full_name?.split(" ")[0] || "Spesialis"}
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            {Formatters.date(new Date(), "weekday")}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs font-semibold text-foreground/50 mb-1">Progress Pasien ({stats.completed}/{stats.today})</div>
          <div className="w-32 h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="group relative glass-panel p-5 rounded-2xl border border-glass-border shadow-sm overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Total Antrean</p>
              <h2 className="text-3xl font-extrabold text-foreground mt-1">{stats.loading ? "..." : stats.today}</h2>
            </div>
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl"><CalendarDays size={20} /></div>
          </div>
        </div>

        <div className="group relative glass-panel p-5 rounded-2xl border border-glass-border shadow-sm overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Menunggu</p>
              <h2 className="text-3xl font-extrabold text-amber-600 mt-1">{stats.loading ? "..." : stats.pending}</h2>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl"><Clock size={20} /></div>
          </div>
        </div>

        <div className="group relative glass-panel p-5 rounded-2xl border border-glass-border shadow-sm overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Selesai</p>
              <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.loading ? "..." : stats.completed}</h2>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-sm text-foreground/60 uppercase tracking-wider mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/dashboard/doctors", icon: <CalendarDays size={20}/>, label: "Jadwal Praktik" },
            { href: "/dashboard/medical-results", icon: <CheckCircle size={20}/>, label: "Input Rekam Medis" },
            { href: "/dashboard/patients", icon: <UserPlus size={20}/>, label: "Daftar Pasien" },
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
