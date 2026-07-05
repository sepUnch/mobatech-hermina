import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dispatch, SetStateAction } from "react";
import { APP_STRINGS } from "@/lib/constants";

interface User { id: number; full_name: string; email: string; phone_number: string; }
type FormType = { user_id: number; appointment_id: number; title: string; message: string; reminder_date: string; type: string; };

export function RemindersForm({
  form,
  setForm,
  users,
  saving,
  handleCreate,
  reminderTypes,
}: {
  form: FormType;
  setForm: Dispatch<SetStateAction<FormType>>;
  users: User[];
  saving: boolean;
  handleCreate: () => void;
  reminderTypes: string[];
}) {
  return (
    <Card className="space-y-4">
      <h2 className="font-semibold text-base">Form Kirim Reminder</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Pasien *</label>
          <select disabled={saving}
            value={form.user_id || ""}
            onChange={(e) => setForm((f) => ({ ...f, user_id: (e.target.value === "" ? "" as unknown as number : Number(e.target.value)) }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary"
          >
            <option value="">— Pilih Pasien —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Tipe Reminder</label>
          <select disabled={saving}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary"
          >
            {reminderTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Judul *</label>
          <input disabled={saving}
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder={APP_STRINGS.reminders.titlePlaceholder}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Tanggal &amp; Waktu *</label>
          <input disabled={saving}
            type="datetime-local"
            value={form.reminder_date}
            onChange={(e) => setForm((f) => ({ ...f, reminder_date: e.target.value }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary"
            placeholder={APP_STRINGS.reminders.datePlaceholder}
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Pesan</label>
          <textarea disabled={saving}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={3}
            placeholder={APP_STRINGS.reminders.messagePlaceholder}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleCreate} isLoading={saving}>
          Kirim Reminder
        </Button>
      </div>
    </Card>
  );
}
