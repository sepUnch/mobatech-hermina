import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { APP_STRINGS } from "@/lib/constants";
import { ImageUpload } from "@/components/ImageUpload";
import React from "react";

export function PolyclinicsFormModal({
  showModal,
  setShowModal,
  selectedItem,
  name,
  setName,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  isActive,
  setIsActive,
  handleSave,
  saving,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedItem: {id?: number, name?: string, description?: string, icon?: string} | null;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  handleSave: (e: React.FormEvent) => void;
  saving: boolean;
}) {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedItem ? APP_STRINGS.polyclinics.editTitle : APP_STRINGS.polyclinics.addTitle}>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.polyclinics.nameLabel}</label>
          <input disabled={saving} type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none" placeholder={APP_STRINGS.polyclinics.namePlaceholder} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.polyclinics.descLabel}</label>
          <textarea disabled={saving} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl border glass-input text-sm text-foreground h-20 resize-none focus:border-primary outline-none" placeholder={APP_STRINGS.polyclinics.descPlaceholder} />
        </div>
        <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} label={APP_STRINGS.polyclinics.imgLabel} />
        <div className="flex items-center gap-2">
          <input disabled={saving} type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-glass-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
          <label htmlFor="isActive" className="text-xs font-semibold cursor-pointer">{APP_STRINGS.polyclinics.activeLabel}</label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>{APP_STRINGS.polyclinics.cancelBtn}</Button>
          <Button type="submit" isLoading={saving}>{APP_STRINGS.polyclinics.saveBtn}</Button>
        </div>
      </form>
    </Modal>
  );
}
