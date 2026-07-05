"use client";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Promo } from "@/types/api";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";

export function PromosFormModal({
  isOpen,
  onClose,
  promo,
  onSuccess,
  setToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  promo?: Promo | null;
  onSuccess: () => void;
  setToast: (toast: { isOpen: boolean; message: string; type: "success" | "error" }) => void;
}) {
  const [formData, setFormData] = useState({ title: "", subtitle: "", themeColor: APP_STRINGS.promos.defaultColor as string, is_active: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: promo?.title || "",
        subtitle: promo?.subtitle || "",
        themeColor: promo?.themeColor || APP_STRINGS.promos.defaultColor,
        is_active: promo?.is_active ?? true,
      });
    }
  }, [isOpen, promo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (promo?.id) {
        await api.put(`/api/admin/promos/${promo.id}`, formData);
      } else {
        await api.post("/api/admin/promos", formData);
      }
      setToast({ isOpen: true, message: "Berhasil menyimpan promo", type: "success" });
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal menyimpan promo";
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={promo ? APP_STRINGS.promos.editPromo : APP_STRINGS.promos.addPromo}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.promos.title}</label>
          <input disabled={isSubmitting} type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder={APP_STRINGS.promos.titlePlaceholder} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2">{APP_STRINGS.promos.subtitle}</label>
          <input disabled={isSubmitting} type="text" required value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground focus:border-primary outline-none transition-all" placeholder={APP_STRINGS.promos.subtitlePlaceholder} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.promos.themeColor}</label>
            <div className="flex items-center gap-3">
              <input disabled={isSubmitting} required type="color" value={formData.themeColor} onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0" />
              <input disabled={isSubmitting} required type="text" value={formData.themeColor} onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })} className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground uppercase font-mono focus:border-primary outline-none transition-all" placeholder={APP_STRINGS.promos.defaultColor} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">{APP_STRINGS.promos.statusActive}</label>
            <label className="flex items-center mt-3 cursor-pointer">
              <input disabled={isSubmitting} type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-glass-border text-primary focus:ring-primary/50 bg-black/5 dark:bg-white/5" />
              <span className="ml-2 text-sm text-foreground/75">{APP_STRINGS.promos.active}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" isLoading={isSubmitting}>Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
