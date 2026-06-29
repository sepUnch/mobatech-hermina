"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Doctor, DoctorSchedule } from "@/types/api";
import { Modal } from "@/components/Modal";
import { CustomSnackbar } from "@/components/CustomSnackbar";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onChange?: () => void;
}

export function ScheduleModal({ isOpen, onClose, doctor, onChange }: ScheduleModalProps) {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [quota, setQuota] = useState(10);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "success" });

  const loadSchedules = async () => {
    if (!doctor) return;
    try {
      const res = await api.get<DoctorSchedule[]>(`/api/doctors/${doctor.id}/schedules`);
      setSchedules(res.data || []);
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && doctor) {
      setLoading(true);
      loadSchedules();
    }
  }, [isOpen, doctor]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    try {
      const payload = {
        doctor_id: doctor.id,
        date: new Date(date).toISOString(),
        start_time: startTime,
        end_time: endTime,
        quota: Number(quota),
      };
      await api.post("/api/admin/schedules", payload);
      setToast({ isOpen: true, message: APP_STRINGS.schedules.successCreate, type: "success" });
      setDate("");
      setStartTime("");
      setEndTime("");
      loadSchedules();
      onChange?.();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(APP_STRINGS.schedules.deleteConfirm)) return;
    try {
      await api.delete(`/api/admin/schedules/${id}`);
      setToast({ isOpen: true, message: APP_STRINGS.schedules.successDelete, type: "success" });
      loadSchedules();
      onChange?.();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    }
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${APP_STRINGS.schedules.title} - ${doctor?.name || ""}`}>
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="p-4 rounded-xl border border-glass-border bg-black/5 dark:bg-white/5 space-y-4">
          <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">{APP_STRINGS.schedules.addBtn}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold mb-1 uppercase text-foreground/75">{APP_STRINGS.schedules.dateLabel}</label>
              <input disabled={loading} type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-9 px-3 rounded-lg border glass-input text-xs text-foreground" placeholder="Contoh: 2023-12-31" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1 uppercase text-foreground/75">{APP_STRINGS.schedules.quotaLabel}</label>
              <input disabled={loading} type="number" required value={quota} onChange={(e) => setQuota(Number(e.target.value))} className="w-full h-9 px-3 rounded-lg border glass-input text-xs text-foreground" placeholder="Contoh: 20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold mb-1 uppercase text-foreground/75">{APP_STRINGS.schedules.startLabel}</label>
              <input disabled={loading} type="text" required placeholder="Contoh: 08:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full h-9 px-3 rounded-lg border glass-input text-xs text-foreground" />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-1 uppercase text-foreground/75">{APP_STRINGS.schedules.endLabel}</label>
              <input disabled={loading} type="text" required placeholder="Contoh: 12:00" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full h-9 px-3 rounded-lg border glass-input text-xs text-foreground" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full h-9 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-lg transition-colors cursor-pointer">{APP_STRINGS.schedules.saveBtn}</button>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4 text-xs text-foreground/50 animate-pulse">Memuat jadwal...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-4 text-xs text-foreground/50">Belum ada jadwal praktik.</div>
          ) : (
            schedules.map((sched) => (
              <div key={sched.id} className="flex items-center justify-between p-3 rounded-xl border border-glass-border glass-card">
                <div>
                  <p className="text-xs font-bold text-foreground">{formatDate(sched.date)}</p>
                  <p className="text-[10px] text-foreground/60 mt-0.5">
                    ⏰ {sched.start_time} - {sched.end_time} | 👥 Kuota: {sched.quota} (Terisi: {sched.booked})
                  </p>
                </div>
                <button onClick={() => handleDelete(sched.id)} className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer text-xs">
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </Modal>
  );
}
