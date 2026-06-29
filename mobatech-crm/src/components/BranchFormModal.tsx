import React, { useState, useEffect } from "react";
import { Branch } from "@/types/api";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";

export function BranchFormModal({
  isOpen,
  onClose,
  branch,
  onSuccess,
  setToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
  onSuccess: () => void;
  setToast: (toast: any) => void;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [gmapsLink, setGmapsLink] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(branch ? branch.name : "");
    setAddress(branch ? branch.address : "");
    setLatitude(branch ? branch.latitude : 0);
    setLongitude(branch ? branch.longitude : 0);
    setImageUrl(branch ? branch.image_url : "");
    setGmapsLink(branch ? branch.gmaps_link : "");
  }, [branch, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name,
      address,
      latitude,
      longitude,
      image_url: imageUrl || `https://placehold.co/400x400/1E5E44/FFFFFF/png?text=${encodeURIComponent(name)}`,
      gmaps_link: gmapsLink,
    };

    try {
      if (branch) {
        await api.put(`/api/admin/branches/${branch.id}`, payload);
        setToast({ isOpen: true, message: APP_STRINGS.branches.successUpdate, type: "success" });
      } else {
        await api.post("/api/admin/branches", payload);
        setToast({ isOpen: true, message: APP_STRINGS.branches.successCreate, type: "success" });
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={branch ? APP_STRINGS.branches.editTitle : APP_STRINGS.branches.addTitle}>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.branches.nameLabel}</label>
          <input disabled={saving} type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder="Contoh: Cabang Jakarta Pusat" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.branches.addressLabel}</label>
          <textarea disabled={saving} required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 rounded-xl border glass-input text-sm text-foreground h-20 resize-none focus:border-primary outline-none" placeholder="Contoh: Jl. Jend. Sudirman Kav. 21, Jakarta Selatan" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.branches.latLabel}</label>
            <input disabled={saving} type="number" step="any" required value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder="Contoh: -6.2088" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.branches.lngLabel}</label>
            <input disabled={saving} type="number" step="any" required value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder="Contoh: 106.8456" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.branches.gmapsLabel}</label>
          <input disabled={saving} type="url" value={gmapsLink} onChange={(e) => setGmapsLink(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder="Contoh: https://maps.app.goo.gl/abcd123" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.branches.imgLabel}</label>
          <input disabled={saving} type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder="Contoh: https://herminahospitals.com/image.jpg" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>{APP_STRINGS.branches.cancelBtn}</Button>
          <Button type="submit" isLoading={saving}>{APP_STRINGS.branches.saveBtn}</Button>
        </div>
      </form>
    </Modal>
  );
}
