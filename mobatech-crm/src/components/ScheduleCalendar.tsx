"use client";
import { useState } from "react";
import { DoctorSchedule } from "@/types/api";
import { Badge } from "./ui/Badge";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Formatters } from "@/lib/formatters";

interface Props {
  groupedSchedules: Record<string, DoctorSchedule[]>;
}

export function ScheduleCalendar({ groupedSchedules }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(new Date().toLocaleDateString("en-CA"));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  const selectedSchedules = selectedDateStr ? groupedSchedules[selectedDateStr] || [] : [];

  return (
    <div className="space-y-6">
      {/* Kalender Grid */}
      <div className="border border-glass-border bg-black/5 dark:bg-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary">
            {Formatters.date(currentDate, "long")}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2 text-center text-xs font-semibold text-foreground/50">
          <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {days.map((d, i) => {
            if (!d) return <div key={i} className="aspect-square" />;
            
            const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const hasSchedules = !!groupedSchedules[dStr];
            const schedCount = hasSchedules ? groupedSchedules[dStr].length : 0;
            const isSelected = selectedDateStr === dStr;
            const isToday = dStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

            return (
              <button
                key={i}
                onClick={() => setSelectedDateStr(dStr)}
                className={`relative aspect-square rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-md scale-105" : "hover:bg-black/5 dark:hover:bg-white/5 bg-background border border-glass-border"} ${isToday && !isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}
              >
                <span className="text-sm sm:text-base font-semibold">{d.getDate()}</span>
                {hasSchedules && (
                  <div className={`absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full text-[9px] font-bold px-1 ring-2 ring-background shadow-sm ${isSelected ? "bg-emerald-400 text-emerald-950" : "bg-primary text-primary-foreground"}`}>
                    {schedCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jadwal Terpilih */}
      {selectedDateStr && (
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
            Jadwal Tanggal {Formatters.date(selectedDateStr, "weekday")}
          </h3>
          
          {selectedSchedules.length === 0 ? (
            <div className="text-center py-12 text-foreground/50 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-glass-border">
              Tidak ada jadwal dokter pada tanggal ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-in slide-in-from-bottom-4 fade-in duration-300">
              {selectedSchedules.map((s) => {
                const isAvailable = s.is_available && s.booked < s.quota;
                const progressPercentage = Math.min((s.booked / s.quota) * 100, 100) || 0;
                
                return (
                  <div key={s.id} className="group relative p-5 rounded-2xl border border-glass-border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-colors group-hover:bg-primary/10"></div>
                    
                    <div className="flex items-start justify-between z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center overflow-hidden border border-glass-border shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {s.doctor?.image_url ? (
                            <img src={s.doctor.image_url} alt={s.doctor.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-sm">{s.doctor?.name?.charAt(0) || "D"}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground tracking-tight line-clamp-1">{s.doctor?.name || "Dokter Spesialis"}</div>
                          <div className="text-xs text-foreground/60">{s.doctor?.specialization || "Spesialis Umum"}</div>
                        </div>
                      </div>
                      <Badge variant={isAvailable ? "success" : "error"} className="shadow-sm">
                        {isAvailable ? "Tersedia" : "Penuh"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 py-3 border-y border-glass-border/50 z-10">
                      <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                        <Clock size={14} className="opacity-70" /> 
                        <span className="text-xs font-bold">{s.start_time} - {s.end_time}</span>
                      </div>
                    </div>
                    
                    <div className="z-10 w-full space-y-1.5 mt-auto">
                      <div className="flex justify-between items-end text-xs">
                        <span className="text-foreground/70 font-medium">Tersedia: <span className="text-foreground font-bold">{s.quota - s.booked}</span></span>
                        <span className="text-foreground/50 text-[10px]">Terisi {s.booked}/{s.quota}</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isAvailable ? 'bg-primary' : 'bg-destructive'}`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
