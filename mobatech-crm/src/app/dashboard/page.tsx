"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { DashboardStats, Doctor, Polyclinic, User, Appointment, Emergency, DoctorSchedule } from "./types";
import { DashboardStatCards } from "@/components/DashboardStatCards";
import { DashboardRecentAppointments } from "@/components/DashboardRecentAppointments";
import { DashboardRightPanel } from "@/components/DashboardRightPanel";
import { StatusPill } from "@/components/StatusPill";
import { Formatters } from "@/lib/formatters";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<DashboardStats>({
    doctors: 0, polyclinics: 0, patients: 0,
    totalAppointments: 0, pendingAppointments: 0, completedAppointments: 0,
    activeEmergencies: 0,
    recentAppointments: [], recentEmergencies: [], recentPatients: [], recentSchedules: [],
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [doctorsRes, polyRes, patientsRes, appRes, emergRes, scheduleRes] = await Promise.allSettled([
          api.get<Doctor[]>("/api/doctors"),
          api.get<Polyclinic[]>("/api/polyclinics"),
          api.get<User[]>("/api/admin/users?role=patient"),
          api.get<Appointment[]>("/api/admin/appointments"),
          api.get<Emergency[]>("/api/admin/emergencies"),
          api.get<DoctorSchedule[]>("/api/admin/schedules?limit=4"),
        ]);

        const doctors    = doctorsRes.status   === "fulfilled" ? (doctorsRes.value.data   || []) : [];
        const polys      = polyRes.status       === "fulfilled" ? (polyRes.value.data       || []) : [];
        const patients   = patientsRes.status   === "fulfilled" ? (patientsRes.value.data   || []) : [];
        const appts      = appRes.status        === "fulfilled" ? (appRes.value.data        || []) : [];
        const emergencies= emergRes.status      === "fulfilled" ? (emergRes.value.data      || []) : [];
        const schedules  = scheduleRes.status   === "fulfilled" ? (scheduleRes.value.data   || []) : [];

        setStats({
          doctors: doctors.length,
          polyclinics: polys.length,
          patients: patients.length,
          totalAppointments: appts.length,
          pendingAppointments: appts.filter((a) => a.status?.toLowerCase() === "pending").length,
          completedAppointments: appts.filter((a) => a.status?.toLowerCase() === "completed").length,
          activeEmergencies: emergencies.filter((e) => !["resolved", "cancelled"].includes(e.status?.toLowerCase())).length,
          recentAppointments: [...appts].reverse().slice(0, 5),
          recentEmergencies: [...emergencies].reverse().slice(0, 3),
          recentPatients: [...patients].reverse().slice(0, 4),
          recentSchedules: schedules,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-foreground/50">{greeting} 👋</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
            {user?.full_name ?? "Admin"}
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            {Formatters.date(new Date(), "weekday")}
          </p>
        </div>
        {stats.activeEmergencies > 0 && (
          <Link href="/dashboard/emergencies"
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold animate-pulse shadow-lg hover:bg-red-600 transition-colors">
            🚨 {stats.activeEmergencies} Darurat Aktif
          </Link>
        )}
      </div>

      <DashboardStatCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardRecentAppointments stats={stats} />
        <DashboardRightPanel stats={stats} />
      </div>

      {/* Gawat Darurat Aktif */}
      {(stats.activeEmergencies > 0 || stats.recentEmergencies.length > 0) && (
        <div className="glass-panel rounded-2xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border bg-red-500/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <h2 className="font-semibold text-sm text-red-600">Gawat Darurat Terbaru</h2>
            </div>
            <Link href="/dashboard/emergencies" className="text-xs text-primary hover:underline font-medium">Lihat Semua →</Link>
          </div>
          <div className="divide-y divide-glass-border">
            {stats.recentEmergencies.map((e) => (
              <div key={e.id} className="px-5 py-3 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-base flex-shrink-0">🚨</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Kasus #{e.id}</div>
                  <div className="text-xs text-foreground/50">
                    {Formatters.date(e.created_at, "datetime")}
                  </div>
                </div>
                <StatusPill status={e.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-sm text-foreground/60 uppercase tracking-wider mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/doctors",        icon: "🩺", label: "Tambah Dokter"     },
            { href: "/dashboard/reminders",      icon: "🔔", label: "Kirim Reminder"    },
            { href: "/dashboard/medical-results", icon: "🧾", label: "Input Hasil Medis" },
            { href: "/dashboard/ai-audit",        icon: "🤖", label: "Sinkronisasi AI"   },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="glass-panel rounded-2xl border p-4 flex flex-col items-center gap-2 text-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group shadow-sm">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{action.icon}</span>
              <span className="text-xs font-medium text-foreground/70">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
