import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Prescription, Medicine } from "@/types/api";
import { Trash2, Plus } from "lucide-react";

interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: Partial<Prescription>) => Promise<void>;
  initialAppointmentId?: number;
  initialUserId?: number;
  medicines: Medicine[];
}

export function PrescriptionFormModal({
  isOpen, onClose, onSave, initialAppointmentId, initialUserId, medicines
}: PrescriptionFormModalProps) {
  const [form, setForm] = useState<Partial<Prescription>>({
    user_id: initialUserId || 0,
    appointment_id: initialAppointmentId || 0,
    doctor_name: "",
    diagnosis: "",
    items: []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddItem = () => {
    setForm((f: any) => ({
      ...f,
      items: [...(f.items || []), { medicine_id: 0, dosage_instruction: "", duration: "", quantity: 1, notes: "" }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setForm((f: any) => ({
      ...f,
      items: f.items?.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setForm((f: any) => {
      const newItems = [...(f.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...f, items: newItems };
    });
  };

  const handleSubmit = async () => {
    if (!form.user_id || !form.items?.length) return; // Validation
    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terbitkan E-Resep Baru">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-foreground/60 font-medium">ID Pasien *</label>
            <input type="number" value={form.user_id || ""} onChange={e => setForm((f: any) => ({ ...f, user_id: (e.target.value === "" ? "" as any : Number(e.target.value)) }))} className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/60 font-medium">ID Janji Temu</label>
            <input type="number" value={form.appointment_id || ""} onChange={e => setForm((f: any) => ({ ...f, appointment_id: (e.target.value === "" ? "" as any : Number(e.target.value)) }))} className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/60 font-medium">Nama Dokter</label>
            <input type="text" value={form.doctor_name || ""} onChange={e => setForm((f: any) => ({ ...f, doctor_name: e.target.value }))} className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-foreground/60 font-medium">Diagnosa Medis</label>
            <input type="text" value={form.diagnosis || ""} onChange={e => setForm((f: any) => ({ ...f, diagnosis: e.target.value }))} className="w-full glass-input rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary" />
          </div>
        </div>

        <div className="border border-glass-border rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">Daftar Obat (Resep)</h3>
            <Button size="sm" variant="outline" onClick={handleAddItem} icon={<Plus size={14}/>}>Tambah Obat</Button>
          </div>
          
          {form.items?.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end border-b border-glass-border/30 pb-3">
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs text-foreground/60">Pilih Obat</label>
                <select value={item.medicine_id} onChange={e => updateItem(index, 'medicine_id', (e.target.value === "" ? "" as any : Number(e.target.value)))} className="w-full glass-input rounded-lg px-2 py-1 text-sm">
                  <option value={0}>- Obat -</option>
                  {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs text-foreground/60">Dosis (Cth: 3x1 Sesudah Makan)</label>
                <input type="text" value={item.dosage_instruction} onChange={e => updateItem(index, 'dosage_instruction', e.target.value)} className="w-full glass-input rounded-lg px-2 py-1 text-sm" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-foreground/60">Durasi (Hari)</label>
                <input type="text" value={item.duration} onChange={e => updateItem(index, 'duration', e.target.value)} className="w-full glass-input rounded-lg px-2 py-1 text-sm" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-foreground/60">Jumlah (Qty)</label>
                <input type="number" min={1} value={item.quantity} onChange={e => updateItem(index, 'quantity', (e.target.value === "" ? "" as any : Number(e.target.value)))} className="w-full glass-input rounded-lg px-2 py-1 text-sm" />
              </div>
              <div className="sm:col-span-2 text-right">
                <Button size="sm" variant="danger" onClick={() => handleRemoveItem(index)} icon={<Trash2 size={14}/>}>Hapus</Button>
              </div>
            </div>
          ))}
          {!form.items?.length && <div className="text-xs text-foreground/50 text-center py-2">Belum ada obat yang ditambahkan ke dalam resep.</div>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Batal</Button>
          <Button onClick={handleSubmit} isLoading={isSaving} disabled={!form.items?.length || !form.user_id}>Terbitkan E-Resep</Button>
        </div>
      </div>
    </Modal>
  );
}
