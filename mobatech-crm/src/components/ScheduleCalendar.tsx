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
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

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
            
            // Format YYYY-MM-DD local timezone safely
            const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const hasSchedules = !!groupedSchedules[dStr];
            const schedCount = hasSchedules ? groupedSchedules[dStr].length : 0;
            const isSelected = selectedDateStr === dStr;
            const isToday = dStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

            return (
              <button
                key={i}
                onClick={() => setSelectedDateStr(dStr)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all
                  ${isSelected ? "bg-primary text-primary-foreground shadow-lg scale-105" : "hover:bg-black/5 dark:hover:bg-white/5 bg-background border border-glass-border"}
                  ${isToday && !isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                `}
              >
                <span className="text-sm font-semibold">{d.getDate()}</span>
                {hasSchedules && (
                  <div className={`text-[10px] mt-1 px-1.5 rounded-full ${isSelected ? "bg-white/20" : "bg-primary/20 text-primary"}`}>
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
            <div className="text-center py-10 text-foreground/50 bg-black/5 dark:bg-white/5 rounded-2xl border border-glass-border">
              Tidak ada jadwal dokter pada tanggal ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
              {selectedSchedules.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-glass-border bg-black/5 dark:bg-white/5 flex flex-col gap-2 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-glass-border">
                        {s.doctor?.image_url ? (
                          <img src={s.doctor.image_url} alt={s.doctor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold text-sm">{s.doctor?.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-base">{s.doctor?.name || "Dokter"}</div>
                        <div className="text-xs text-foreground/60">{s.doctor?.specialization}</div>
                      </div>
                    </div>
                    {(() => {
                      const isAvailable = s.is_available && s.booked < s.quota;
                      return (
                        <Badge variant={isAvailable ? "success" : "error"}>
                          {isAvailable ? "Tersedia" : "Penuh"}
                        </Badge>
                      );
                    })()}
                  </div>
                  <div className="mt-3 text-sm flex items-center gap-2 font-medium text-primary">
                    <Clock size={16} /> {s.start_time} - {s.end_time}
                  </div>
                  <div className="text-xs flex justify-between mt-2 pt-2 border-t border-glass-border">
                    <span className="text-foreground/70">Tersedia: <b className="text-foreground">{s.quota - s.booked}</b></span>
                    <span className="text-foreground/50">Terisi {s.booked}/{s.quota}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
