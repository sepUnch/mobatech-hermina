/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { APP_STRINGS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface ScheduleFormProps {
  loading: boolean;
  date: string;
  setDate: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  quota: number;
  setQuota: (val: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScheduleForm({
  loading, date, setDate, startTime, setStartTime, endTime, setEndTime, quota, setQuota, onSubmit
}: ScheduleFormProps) {

  const formatTimeSmart = (val: string) => {
    if (!val) return val;
    let clean = val.replace(/[^\d:]/g, "");
    
    if (!clean.includes(":")) {
      const num = parseInt(clean, 10);
      if (!isNaN(num)) {
        if (clean.length <= 2) {
          let hour = num;
          if (hour >= 1 && hour <= 6) hour += 12; // 1->13, 6->18
          if (hour > 23) hour = 23;
          clean = `${hour.toString().padStart(2, "0")}:00`;
        } else if (clean.length === 3) {
          clean = `0${clean[0]}:${clean.slice(1)}`;
        } else if (clean.length === 4) {
          clean = `${clean.slice(0, 2)}:${clean.slice(2)}`;
        }
      }
    } else {
       const [h, m] = clean.split(":");
       if (h !== undefined && m !== undefined) {
         let hour = parseInt(h, 10) || 0;
         if (hour >= 1 && hour <= 6) hour += 12;
         if (hour > 23) hour = 23;
         clean = `${hour.toString().padStart(2, "0")}:${m.padStart(2, "0").slice(0,2)}`;
       }
    }
    return clean;
  };

  const handleBlurStart = (e: React.FocusEvent<HTMLInputElement>) => {
    setStartTime(formatTimeSmart(e.target.value));
  };

  const handleBlurEnd = (e: React.FocusEvent<HTMLInputElement>) => {
    setEndTime(formatTimeSmart(e.target.value));
  };

  return (
    <form onSubmit={onSubmit} className="p-4 rounded-xl border border-glass-border bg-black/5 dark:bg-white/5 space-y-4">
      <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">{APP_STRINGS.schedules.addBtn}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.schedules.dateLabel}</label>
          <input disabled={loading} type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder={APP_STRINGS.schedules.datePlaceholder} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.schedules.quotaLabel}</label>
          <input disabled={loading} type="number" required value={quota} onChange={(e) => setQuota((e.target.value === "" ? "" as unknown as number : Number(e.target.value)))} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder={APP_STRINGS.schedules.quotaPlaceholder} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.schedules.startLabel}</label>
          <input disabled={loading} type="text" required placeholder={APP_STRINGS.schedules.startPlaceholder} value={startTime} onChange={(e) => setStartTime(e.target.value)} onBlur={handleBlurStart} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.schedules.endLabel}</label>
          <input disabled={loading} type="text" required placeholder={APP_STRINGS.schedules.endPlaceholder} value={endTime} onChange={(e) => setEndTime(e.target.value)} onBlur={handleBlurEnd} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" />
        </div>
      </div>
      <Button type="submit" disabled={loading} size="sm" className="w-full">{APP_STRINGS.schedules.saveBtn}</Button>
    </form>
  );
}
