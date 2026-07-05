"use client";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Doctor, DoctorSchedule } from "@/types/api";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ScheduleForm } from "./ScheduleForm";
import { Formatters } from "@/lib/formatters";
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const executeDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/schedules/${id}`);
      setToast({ isOpen: true, message: APP_STRINGS.schedules.successDelete, type: "success" });
      loadSchedules();
      onChange?.();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setDeleteConfirmId(null);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${APP_STRINGS.schedules.title} - ${doctor?.name || ""}`}>
      <div className="space-y-6">
        <ScheduleForm 
          loading={loading}
          date={date}
          setDate={setDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          quota={quota}
          setQuota={setQuota}
          onSubmit={handleAdd}
        />
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4 text-xs text-foreground/50 animate-pulse">Memuat jadwal...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-4 text-xs text-foreground/50">Belum ada jadwal praktik.</div>
          ) : (
            schedules.map((sched) => (
              <div key={sched.id} className="flex items-center justify-between p-3 rounded-xl border border-glass-border glass-card">
                <div>
                  <p className="text-xs font-bold text-foreground">{Formatters.date(sched.date, "weekday")}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {sched.start_time} - {sched.end_time} | Kuota: {sched.quota} (Terisi: {sched.booked})
                  </p>
                </div>
                <Button size="sm" variant="danger" onClick={() => setDeleteConfirmId(sched.id)}>
                  Hapus
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId !== null && executeDelete(deleteConfirmId)}
        title="Hapus Jadwal"
        description={APP_STRINGS.schedules.deleteConfirm}
        confirmText="Ya, Hapus"
        variant="danger"
      />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </Modal>
  );
}
