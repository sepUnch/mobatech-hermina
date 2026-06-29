"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus, X } from "lucide-react";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { RemindersForm } from "./RemindersForm";
import { RemindersList } from "./RemindersList";

interface User { id: number; full_name: string; email: string; phone_number: string; }
interface Reminder { id: number; created_at: string; user_id: number; appointment_id: number; title: string; message: string; reminder_date: string; is_read: boolean; type: string; }

const REMINDER_TYPES = ["Appointment", "Medication", "Checkup", "General"];

const defaultForm = { user_id: 0, appointment_id: 0, title: "", message: "", reminder_date: "", type: "General" };

export function RemindersClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ isOpen: true, message, type });

  const loadUsers = async () => {
    try {
      const res = await api.get<User[]>("/api/admin/users");
      setUsers(res.data || []);
    } catch { /* non-blocking */ }
  };

  const loadReminders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<Reminder[]>(`/api/admin/reminders${qs}`);
      setReminders(res.data || []);
    } catch { showToast("Gagal memuat data reminder", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { loadReminders(); }, [searchQuery, filterValue]);

  const handleCreate = async () => {
    if (!form.user_id || !form.title || !form.reminder_date) {
      showToast("Pilih pasien, isi Judul, dan Tanggal", "error");
      return;
    }
    // Go time.Time requires RFC3339 format — append seconds and timezone if missing
    const isoDate = form.reminder_date.includes(":") && form.reminder_date.length === 16
      ? form.reminder_date + ":00+07:00"
      : form.reminder_date;
    setSaving(true);
    try {
      await api.post("/api/admin/reminders", { ...form, reminder_date: isoDate });
      showToast("Reminder berhasil dikirim ke pasien", "success");
      setShowForm(false);
      setForm(defaultForm);
      loadReminders();
    } catch { showToast("Gagal membuat reminder", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus reminder ini?")) return;
    try {
      await api.delete(`/api/admin/reminders/${id}`);
      showToast("Reminder dihapus", "success");
      loadReminders();
    } catch { showToast("Gagal menghapus reminder", "error"); }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader
        title="Pengingat Pasien"
        description="Kirim notifikasi / pengingat ke pasien terdaftar."
        action={
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "primary"} icon={showForm ? <X size={18} /> : <Plus size={18} />}>
            {showForm ? "Batal" : "Kirim Reminder Baru"}
          </Button>
        }
      />

      <div className="flex justify-end mb-4 gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Obat', value: 'medicine' },
            { label: 'Jadwal', value: 'schedule' },
          ]}
          placeholder="Jenis..."
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {showForm && (
        <RemindersForm
          form={form}
          setForm={setForm}
          users={users}
          saving={saving}
          handleCreate={handleCreate}
          reminderTypes={REMINDER_TYPES}
        />
      )}

      <RemindersList
        loading={loading}
        reminders={reminders}
        users={users}
        onDelete={handleDelete}
      />

      <CustomSnackbar
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, isOpen: false }))}
      />
    </div>
  );
}
