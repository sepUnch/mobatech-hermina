"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { FormValidators } from "@/lib/validators";
import { Doctor, Polyclinic, User } from "@/types/api";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "./ImageUpload";
import { PhoneInput } from "@/components/ui/PhoneInput";

interface DoctorFormModalProps {
  isOpen: boolean; onClose: () => void; doctor: Doctor | null;
  onSave: (payload: { name: string; specialization: string; polyclinic_id?: number; contact_info: string; description: string; image_url: string; is_active: boolean; user_id?: number }) => Promise<void>;
}

export function DoctorFormModal({ isOpen, onClose, doctor, onSave }: DoctorFormModalProps) {
  const [name, setName] = useState(""); const [polyclinicId, setPolyclinicId] = useState<number | undefined>();
  const [specialization, setSpecialization] = useState(""); const [contactInfo, setContactInfo] = useState("+62");
  const [description, setDescription] = useState(""); const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true); const [submitting, setSubmitting] = useState(false);
  const [polyclinics, setPolyclinics] = useState<Polyclinic[]>([]);
  const [users, setUsers] = useState<User[]>([]); const [userId, setUserId] = useState<number | undefined>();
  const [errors, setErrors] = useState<{name?: string, phone?: string}>({});

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        api.get<Polyclinic[]>("/api/polyclinics"),
        api.get<User[]>("/api/admin/users?role=doctor")
      ]).then(([p, u]) => { setPolyclinics(p.data || []); setUsers(u.data || []); });
    }
  }, [isOpen]);

  useEffect(() => {
    setName(doctor?.name || ""); setPolyclinicId(doctor?.polyclinic_id ?? undefined);
    setSpecialization(doctor?.specialization || ""); setContactInfo(doctor?.contact_info || "+62");
    setDescription(doctor?.description || ""); setImageUrl(doctor?.image_url || "");
    setIsActive(doctor?.is_active ?? true); setUserId(doctor?.user_id ?? undefined);
  }, [doctor, isOpen]);

  const handlePolyChange = (val: string) => {
    const id = Number(val); setPolyclinicId(id || undefined);
    const poly = polyclinics.find((p) => p.id === id);
    if (poly && !specialization) setSpecialization(poly.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({});
    const nameErr = FormValidators.name(name); const phoneErr = FormValidators.phone(contactInfo);
    if (nameErr || phoneErr) return setErrors({ name: nameErr || undefined, phone: phoneErr || undefined });
    setSubmitting(true);
    try {
      await onSave({ name, specialization, polyclinic_id: polyclinicId, contact_info: contactInfo, description, image_url: imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "Doctor"}`, is_active: isActive, user_id: userId });
      onClose();
    } catch { } finally { setSubmitting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doctor ? APP_STRINGS.doctors.editTitle : APP_STRINGS.doctors.addTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold mb-2">{APP_STRINGS.doctors.nameLabel}</label><input disabled={submitting} type="text" required value={name} onChange={(e) => setName(e.target.value)} className={`w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground ${errors.name ? "border-error focus:border-error" : ""}`} placeholder={APP_STRINGS.doctors.namePlaceholder} />{errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}</div>
          <div><label className="block text-xs font-semibold mb-2">Poliklinik</label><select disabled={submitting} required value={polyclinicId ?? ""} onChange={(e) => handlePolyChange(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground cursor-pointer focus:border-primary outline-none"><option value="">Pilih Poliklinik</option>{polyclinics.filter((p) => p.is_active).map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold mb-2">{APP_STRINGS.doctors.specLabel}</label><input disabled={submitting} type="text" required value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder={APP_STRINGS.doctors.specPlaceholder} /></div>
          <div><label className="block text-xs font-semibold mb-2">Tautkan Akun (User ID)</label><select disabled={submitting} value={userId ?? ""} onChange={(e) => setUserId((e.target.value === "" ? "" as unknown as number : Number(e.target.value)) || undefined)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground cursor-pointer focus:border-primary outline-none"><option value="">Kosongkan (Belum Ada Akun)</option>{users.map((u) => (<option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>))}</select></div>
        </div>
        <div><label className="block text-xs font-semibold mb-2">{APP_STRINGS.doctors.contactLabel}</label><PhoneInput disabled={submitting} value={contactInfo} onChange={setContactInfo} className={errors.phone ? "border-error focus-within:border-error" : ""} />{errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}</div>
        <div><label className="block text-xs font-semibold mb-2">{APP_STRINGS.doctors.descLabel}</label><textarea disabled={submitting} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl border glass-input text-sm text-foreground h-20 resize-none focus:border-primary outline-none" placeholder={APP_STRINGS.doctors.descPlaceholder} /></div>
        <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} label={APP_STRINGS.doctors.imgLabel} />
        <div className="flex items-center gap-2"><input disabled={submitting} type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-glass-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" /><label htmlFor="isActive" className="text-xs font-semibold cursor-pointer">{APP_STRINGS.doctors.activeLabel}</label></div>
        <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" disabled={submitting} onClick={onClose}>{APP_STRINGS.doctors.cancelBtn}</Button><Button type="submit" isLoading={submitting}>{APP_STRINGS.doctors.saveBtn}</Button></div>
      </form>
    </Modal>
  );
}
