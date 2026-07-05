"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/api";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { FormValidators } from "@/lib/validators";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { ImageUpload } from "@/components/ImageUpload";
import { Eye, EyeOff } from "lucide-react";

export function UsersFormModal({ isOpen, onClose, user, onSuccess, setToast }: { isOpen: boolean; onClose: () => void; user: Partial<User> | null; onSuccess: () => void; setToast: (t: {isOpen: boolean, message: string, type: 'success' | 'error'}) => void; }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+62");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone_number || "+62");
    setPassword("");
    setRole(user?.role || "patient");
    setImageUrl(user?.image_url || "");
    setErrors({});
  }, [user, isOpen]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const nameErr = FormValidators.name(fullName);
    if (nameErr) e.fullName = nameErr;
    const emailErr = FormValidators.email(email);
    if (emailErr) e.email = emailErr;
    const phoneErr = FormValidators.phone(phone);
    if (phoneErr) e.phone = phoneErr;
    if (!user && !password.trim()) e.password = "Kata sandi wajib diisi untuk pengguna baru.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { full_name: fullName, email, phone_number: phone, password, role, image_url: imageUrl };
    try {
      if (user?.id) {
        await api.put(`/api/admin/users/${user.id}`, payload);
        setToast({ isOpen: true, message: "Pengguna diperbarui", type: "success" });
      } else {
        await api.post("/api/admin/users", payload);
        setToast({ isOpen: true, message: "Pengguna ditambahkan", type: "success" });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setToast({ isOpen: true, message: err instanceof ApiError ? err.message : "Kesalahan server", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit Pengguna" : "Tambah Pengguna Baru"}>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-2">Nama Lengkap</label>
          <input disabled={saving} type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all ${errors.fullName ? "border-error" : ""}`} placeholder={APP_STRINGS.users.namePlaceholder} />
          {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">Email</label>
            <input disabled={saving} type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all ${errors.email ? "border-error" : ""}`} placeholder={APP_STRINGS.users.emailPlaceholder} />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">No. HP</label>
            <PhoneInput disabled={saving} value={phone} onChange={setPhone} className={errors.phone ? "border-error" : ""} />
            {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">Peran (Role)</label>
            <select disabled={saving} required value={role} onChange={(e) => setRole(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground cursor-pointer focus:border-primary outline-none">
              <option value="patient">Pasien (Patient)</option>
              <option value="doctor">Dokter (Doctor)</option>
              <option value="pharmacist">Apoteker (Pharmacist)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">Kata Sandi {user && "(Opsional)"}</label>
            <div className="relative">
              <input disabled={saving} type={showPassword ? "text" : "password"} required={!user} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full h-10 px-3 pr-10 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all ${errors.password ? "border-error" : ""}`} placeholder={user ? APP_STRINGS.users.passEditPlaceholder : APP_STRINGS.users.passNewPlaceholder} />
              <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
          </div>
        </div>
        <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} label="Foto Profil" />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" isLoading={saving}>Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
