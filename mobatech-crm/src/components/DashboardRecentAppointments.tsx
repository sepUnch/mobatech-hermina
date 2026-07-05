import Link from "next/link";
import { DashboardStats } from "@/app/dashboard/types";
import { StatusPill } from "./StatusPill";
import { Formatters } from "@/lib/formatters";

export function DashboardRecentAppointments({ stats }: { stats: DashboardStats }) {
  return (
    <div className="lg:col-span-2 glass-panel rounded-2xl border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border">
        <div>
          <h2 className="font-semibold text-sm">Antrean Terbaru</h2>
          <p className="text-xs text-foreground/50 mt-0.5">{stats.totalAppointments} total janji temu</p>
        </div>
        <Link href="/dashboard/appointments" className="text-xs text-primary hover:underline font-medium">Lihat Semua →</Link>
      </div>
      <div className="divide-y divide-glass-border">
        {stats.loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-foreground/10 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-foreground/10 rounded w-1/3" />
                <div className="h-2.5 bg-foreground/10 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : stats.recentAppointments.length === 0 ? (
          <div className="px-5 py-8 text-center text-foreground/40 text-sm">Belum ada antrean.</div>
        ) : (
          stats.recentAppointments.map((a) => (
            <div key={a.id} className="px-5 py-3 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                #{a.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{a.notes || "Tidak ada catatan"}</div>
                <div className="text-xs text-foreground/50 mt-0.5">
                  {Formatters.date(a.created_at, "short")}
                </div>
              </div>
              <StatusPill status={a.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
