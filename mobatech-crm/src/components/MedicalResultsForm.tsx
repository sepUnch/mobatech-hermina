import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dispatch, SetStateAction } from "react";

interface User { id: number; full_name: string; email: string; }
type FormType = { user_id: number, appointment_id: number, doctor_name: string, test_type: string, test_name: string, result: string, notes: string, file_url: string, result_date: string };

export function MedicalResultsForm({ 
  form, 
  setForm, 
  users, 
  saving, 
  editId, 
  handleSave, 
  onCancel,
  testTypes
}: { 
  form: FormType;
  setForm: Dispatch<SetStateAction<FormType>>;
  users: User[];
  saving: boolean;
  editId: number | null;
  handleSave: () => void;
  onCancel: () => void;
  testTypes: string[];
}) {
  return (
    <Card className="space-y-4">
      <h2 className="font-semibold text-base">{editId ? "Edit Hasil Medis" : "Tambah Hasil Medis Baru"}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Pasien *</label>
          <select disabled={isLoading}
            value={form.user_id || ""}
            onChange={(e) => setForm((f) => ({ ...f, user_id: Number(e.target.value) }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary"
            placeholder="Contoh: Pilih Pasien"
          >
            <option value="">— Pilih Pasien —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">ID Janji Temu (opsional)</label>
          <input disabled={isLoading} type="number" value={form.appointment_id || ""} onChange={(e) => setForm((f) => ({ ...f, appointment_id: Number(e.target.value) }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" placeholder="Contoh: 10234" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Nama Dokter</label>
          <input disabled={isLoading} type="text" value={form.doctor_name} onChange={(e) => setForm((f) => ({ ...f, doctor_name: e.target.value }))}
            placeholder="Contoh: dr. Budi Santoso, Sp.PD" className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Tipe Pemeriksaan</label>
          <select disabled={isLoading} value={form.test_type} onChange={(e) => setForm((f) => ({ ...f, test_type: e.target.value }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" placeholder="Contoh: Laboratorium">
            {testTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Nama Tes *</label>
          <input disabled={isLoading} type="text" value={form.test_name} onChange={(e) => setForm((f) => ({ ...f, test_name: e.target.value }))}
            placeholder="Contoh: Darah Lengkap" className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Tanggal Hasil *</label>
          <input disabled={isLoading} type="date" value={form.result_date} onChange={(e) => setForm((f) => ({ ...f, result_date: e.target.value }))}
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" placeholder="Contoh: 2023-12-31" />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Hasil / Kesimpulan *</label>
          <textarea disabled={isLoading} value={form.result} onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
            rows={3} placeholder="Contoh: Kadar hemoglobin normal..."
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary resize-none" />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs text-foreground/60 font-medium">Catatan Dokter</label>
          <textarea disabled={isLoading} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2} placeholder="Contoh: Perbanyak minum air putih..."
            className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary resize-none" />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs text-foreground/60 font-medium">URL Berkas (PDF / Gambar)</label>
          <input disabled={isLoading} type="text" value={form.file_url} onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))}
            placeholder="Contoh: https://herminahospitals.com/hasil.pdf" className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Batal</Button>
        <Button onClick={handleSave} isLoading={saving}>
          {editId ? "Simpan Perubahan" : "Tambahkan"}
        </Button>
      </div>
    </Card>
  );
}
