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
      <div className="relative overflow-hidden rounded-3xl border border-glass-border bg-black/10 dark:bg-white/5 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/30 to-emerald-500/30 opacity-70"></div>
        <div className="relative p-6 pt-12 sm:p-10 sm:pt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-32 h-32 rounded-2xl shadow-xl overflow-hidden border-4 border-background/50 flex-shrink-0 bg-background z-10 transition-transform duration-300 hover:scale-105">
            <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center sm:text-left z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground drop-shadow-sm">{doctor.name}</h1>
              {doctor.is_active && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-1.5 shadow-sm mb-1 sm:mb-2">
                  <Activity size={14} /> Aktif
                </span>
              )}
            </div>
            <p className="text-foreground/80 font-medium flex items-center justify-center sm:justify-start gap-1.5 mb-3 text-sm">
              <MapPin size={16} className="text-primary drop-shadow-sm"/> 
              {doctor.polyclinic?.name || "Spesialis Umum"} &bull; {doctor.specialization}
            </p>
            <p className="text-sm text-foreground/60 max-w-2xl leading-relaxed">{doctor.description || "Belum ada deskripsi profil. Klik ubah profil untuk menambahkan deskripsi."}</p>
          </div>
          <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto mt-6 sm:mt-0 z-10">
            <Button onClick={() => openSchedules(doctor)} icon={<Calendar size={18} />} className="flex-1 sm:flex-none justify-center shadow-md hover:shadow-lg transition-all duration-300">
              Kelola Jadwal
            </Button>
            <Button onClick={() => openForm(doctor)} variant="outline" icon={<Edit2 size={18} />} className="flex-1 sm:flex-none justify-center bg-background/50 backdrop-blur-sm border-glass-border shadow-sm hover:shadow-md transition-all duration-300">
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
