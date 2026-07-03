/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doctor, DoctorSchedule } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit2, Calendar, MapPin, Activity } from "lucide-react";
import { DoctorsScheduleTab } from "./DoctorsScheduleTab";

export function DoctorProfileView({ 
  doctor, schedules, openSchedules, openForm 
}: { 
  doctor: Doctor | undefined; 
  schedules: DoctorSchedule[];
  openSchedules: (d: Doctor) => void;
  openForm: (d: Doctor | null) => void;
}) {
  if (!doctor) {
    return <div className="text-center py-20 text-foreground/50">Profil dokter tidak ditemukan. Mohon minta admin untuk menautkan akun Anda.</div>;
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="relative overflow-hidden rounded-2xl border glass-panel shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-sm overflow-hidden border border-glass-border flex-shrink-0 bg-background/50 z-10">
            <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
          </div>
          <div className="flex-1 text-center sm:text-left z-10">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mb-1">{doctor.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold tracking-wide uppercase border border-primary/20">
                <MapPin size={12} /> {doctor.polyclinic?.name || "Umum"}
              </span>
              <span className="text-xs font-semibold text-foreground/60">
                {doctor.specialization}
              </span>
            </div>
            <p className="text-xs text-foreground/70 max-w-2xl leading-relaxed">
              {doctor.description || "Belum ada deskripsi profil. Klik ubah profil untuk menambahkan deskripsi."}
            </p>
          </div>
          <div className="flex flex-row sm:flex-col gap-2.5 w-full sm:w-auto mt-2 sm:mt-0 z-10">
            <Button onClick={() => openSchedules(doctor)} size="sm" icon={<Calendar size={14} />} className="flex-1 sm:flex-none justify-center h-10 shadow-sm">
              Kelola Jadwal
            </Button>
            <Button onClick={() => openForm(doctor)} size="sm" variant="outline" icon={<Edit2 size={14} />} className="flex-1 sm:flex-none justify-center h-10 border-glass-border shadow-sm hover:bg-black/5 dark:hover:bg-white/5">
              Ubah Profil
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-2 mt-10 mb-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
          <Calendar size={18} />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Jadwal Praktik Anda</h2>
      </div>
      
      <Card noPadding className="overflow-hidden shadow-lg border-glass-border fade-in-up" style={{ animationDelay: "0.2s" }}>
        <DoctorsScheduleTab schedules={schedules} />
      </Card>
    </div>
  );
}
