import React from "react";
import { DoctorSchedule } from "@/types/api";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export function DoctorsScheduleTab({ schedules }: { schedules: DoctorSchedule[] }) {
  const groupedSchedules = schedules.reduce((acc, sched) => {
    const d = new Date(sched.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(sched);
    return acc;
  }, {} as Record<string, DoctorSchedule[]>);
  const sortedDates = Object.keys(groupedSchedules).sort();

  return (
    <div className="p-6 space-y-8">
      {sortedDates.length === 0 ? (
        <div className="text-center text-foreground/50 py-10">Belum ada jadwal dokter.</div>
      ) : (
        <ScheduleCalendar groupedSchedules={groupedSchedules} />
      )}
    </div>
  );
}
