import Link from "next/link";
import { DashboardStats } from "@/app/dashboard/types";

export function DashboardRightPanel({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-5">
      {/* Progress Antrean */}
      <div className="glass-panel rounded-2xl border p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-sm">Status Antrean</h2>
        {[
          { label: "Menunggu",  value: stats.pendingAppointments,   total: stats.totalAppointments || 1, color: "bg-yellow-500" },
          { label: "Selesai",   value: stats.completedAppointments, total: stats.totalAppointments || 1, color: "bg-green-500"  },
          { label: "Lainnya",   value: stats.totalAppointments - stats.pendingAppointments - stats.completedAppointments, total: stats.totalAppointments || 1, color: "bg-gray-400" },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-foreground/70">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                style={{ width: `${Math.round((item.value / item.total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pasien Baru */}
      <div className="glass-panel rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Pasien Baru</h2>
          <Link href="/dashboard/patients" className="text-xs text-primary hover:underline">Lihat →</Link>
        </div>
        <div className="space-y-2.5">
          {stats.loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-foreground/10" />
                <div className="h-3 bg-foreground/10 rounded flex-1" />
              </div>
            ))
          ) : stats.recentPatients.length === 0 ? (
            <div className="text-xs text-foreground/40 text-center py-2">Belum ada pasien.</div>
          ) : (
            stats.recentPatients.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {(p.full_name || p.email || "?")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{p.full_name || p.email}</div>
                  <div className="text-[10px] text-foreground/40">
                    {new Date(p.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Jadwal Dokter Terbaru */}
      <div className="glass-panel rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Jadwal Dokter</h2>
          <Link href="/dashboard/doctors" className="text-xs text-primary hover:underline">Master Dokter →</Link>
        </div>
        <div className="space-y-2.5">
          {stats.loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-foreground/10" />
                <div className="h-3 bg-foreground/10 rounded flex-1" />
              </div>
            ))
          ) : stats.recentSchedules?.length === 0 ? (
            <div className="text-xs text-foreground/40 text-center py-2">Belum ada jadwal.</div>
          ) : (
            stats.recentSchedules?.map((s) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-teal-500/15 flex items-center justify-center text-xs font-bold text-teal-600 flex-shrink-0">
                  🩺
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{s.doctor?.name || "Dokter"}</div>
                  <div className="text-[10px] text-foreground/50">
                    {new Date(s.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} • {s.start_time} - {s.end_time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
