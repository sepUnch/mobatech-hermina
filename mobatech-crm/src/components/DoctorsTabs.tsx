import React from "react";
import { Users, Clock } from "lucide-react";

export function DoctorsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "doctors" | "schedules";
  setActiveTab: (tab: "doctors" | "schedules") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl w-full sm:w-max">
      <button
        onClick={() => setActiveTab("doctors")}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
          activeTab === "doctors" ? "bg-white dark:bg-black/50 shadow text-primary" : "text-foreground/60 hover:text-foreground"
        }`}
      >
        <Users size={16} /> Daftar Dokter
      </button>
      <button
        onClick={() => setActiveTab("schedules")}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
          activeTab === "schedules" ? "bg-white dark:bg-black/50 shadow text-primary" : "text-foreground/60 hover:text-foreground"
        }`}
      >
        <Clock size={16} /> Jadwal by Day
      </button>
    </div>
  );
}
