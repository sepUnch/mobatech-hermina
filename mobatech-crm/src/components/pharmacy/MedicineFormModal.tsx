/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Medicine, MedicineCategory } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ImageUpload";

interface MedicineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Partial<Medicine> | null;
  categories: MedicineCategory[];
  onSave: (payload: Partial<Medicine>) => Promise<void>;
}

export function MedicineFormModal({ isOpen, onClose, medicine, categories, onSave }: MedicineFormModalProps) {
  const [formData, setFormData] = useState<Partial<Medicine>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(medicine || { requires_prescription: false });
    }
  }, [isOpen, medicine]);

  const update = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={medicine?.id ? APP_STRINGS.pharmacy.editMedicine : APP_STRINGS.pharmacy.addMedicine}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.pharmacy.medicineName}</label>
            <input disabled={saving} type="text" required value={formData.name || ""} onChange={(e) => update("name", e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder="Contoh: Paracetamol 500mg" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">Nama Generik</label>
            <input disabled={saving} type="text" value={formData.generic_name || ""} onChange={(e) => update("generic_name", e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder="Contoh: Acetaminophen" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">Dosis</label>
            <input disabled={saving} type="text" value={formData.dosage || ""} onChange={(e) => update("dosage", e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder="500mg" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">Satuan</label>
            <input disabled={saving} type="text" value={formData.unit || ""} onChange={(e) => update("unit", e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder="Tablet" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.pharmacy.category}</label>
            <select disabled={saving} value={formData.category_id || ""} onChange={(e) => update("category_id", (e.target.value === "" ? "" as unknown as number : Number(e.target.value)))} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground cursor-pointer focus:border-primary outline-none transition-all">
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.pharmacy.price}</label>
            <input disabled={saving} type="number" required min={0} value={formData.price ?? ""} onChange={(e) => update("price", parseFloat(e.target.value))} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder="15000" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.pharmacy.stock}</label>
            <input disabled={saving} type="number" min={0} value={formData.stock ?? ""} onChange={(e) => update("stock", parseInt(e.target.value, 10))} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder="100" />
          </div>
        </div>
        <ImageUpload imageUrl={formData.image_url || ""} setImageUrl={(url) => update("image_url", url)} label={APP_STRINGS.pharmacy.medicinePhoto} />
        <div className="flex items-center gap-2">
          <input disabled={saving} type="checkbox" id="requiresPrescription" checked={formData.requires_prescription || false} onChange={(e) => update("requires_prescription", e.target.checked)} className="rounded border-glass-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
          <label htmlFor="requiresPrescription" className="text-xs font-semibold cursor-pointer">{APP_STRINGS.pharmacy.requiresPrescription}</label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>{APP_STRINGS.common.cancel}</Button>
          <Button type="submit" isLoading={saving}>{APP_STRINGS.common.save}</Button>
        </div>
      </form>
    </Modal>
  );
}
