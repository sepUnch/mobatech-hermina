"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Medicine, MedicineCategory } from "@/types/api";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Edit, Trash2, Package, Plus } from "lucide-react";
import { DeleteModal } from "@/components/DeleteModal";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ImageUpload } from "@/components/ImageUpload";
import { APP_STRINGS } from "@/lib/constants";
import { Formatters } from "@/lib/formatters";

export function PharmacyMedicines({ initialMedicines, categories }: { initialMedicines: Medicine[], categories: MedicineCategory[] }) {
  const role = useAuthStore((state) => state.user)?.role || "admin";
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Partial<Medicine> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [toast, setToast] = useState<{isOpen: boolean; message: string; type: "success"|"error"}>({ isOpen: false, message: "", type: "success" });
  const showToast = (message: string, type: "success" | "error") => setToast({ isOpen: true, message, type });

  const loadMedicines = async () => {
    try {
      const res = await api.get<Medicine[]>(`/api/pharmacy/medicines?search=${encodeURIComponent(searchQuery)}&category_id=${selectedCategory}`);
      setMedicines(res.data || []);
    } catch { showToast(APP_STRINGS.common.loadError, "error"); }
  };

  useEffect(() => { loadMedicines(); }, [searchQuery, selectedCategory]);

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicine?.id) {
        await api.put(`/api/admin/pharmacy/medicines/${editingMedicine.id}`, editingMedicine);
        showToast(APP_STRINGS.common.updateSuccess, "success");
      } else {
        await api.post(`/api/admin/pharmacy/medicines`, editingMedicine);
        showToast(APP_STRINGS.common.createSuccess, "success");
      }
      setIsModalOpen(false);
      loadMedicines();
    } catch { showToast(APP_STRINGS.common.saveError, "error"); }
  };

  const confirmDelete = (id: number, name: string) => {
    setDeleteConfirm({ isOpen: true, id, title: `Hapus obat "${name}"?` });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/api/admin/pharmacy/medicines/${deleteConfirm.id}`);
      showToast(APP_STRINGS.common.deleteSuccess, "success");
      loadMedicines();
    } catch { showToast(APP_STRINGS.common.deleteError, "error"); }
    finally { setDeleteConfirm(null); }
  };

  const categoryOptions = categories.map((c) => ({ label: c.name, value: String(c.id || (c as any).ID) }));

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col sm:flex-row flex-1 gap-2">
          <FilterDropdown value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} placeholder={APP_STRINGS.common.searchFilter} className="w-full sm:w-48 h-11" />
          <SearchFilterBar value={searchQuery} onChange={setSearchQuery} className="w-full sm:max-w-xs h-11" />
        </div>
        <div title={role === "admin" ? APP_STRINGS.common.clinicalOnly : undefined}>
          <button onClick={() => { setEditingMedicine({ requires_prescription: false }); setIsModalOpen(true); }} disabled={role === "admin"} className="w-full sm:w-auto h-11 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
            <Plus size={16} /><span>{APP_STRINGS.pharmacy.addMedicine}</span>
          </button>
        </div>
      </div>

      <Card noPadding>
        <div className="w-full overflow-x-auto">
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.medicineName}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.category}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.price}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.stock}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.prescription}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.common.action}</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id || (m as any).ID} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-10 h-10 object-cover rounded-lg bg-glass-panel border border-glass-border shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-glass-border shrink-0">
                        <Package size={20} className="text-foreground/40" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-foreground/50">{m.generic_name} • {m.dosage} {m.unit}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{m.category?.name ?? "-"}</td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-medium">{Formatters.currency(m.price)}</td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm"><Badge variant={m.stock <= 10 ? "error" : "success"}>{m.stock}</Badge></td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm"><Badge variant={m.requires_prescription ? "warning" : "neutral"}>{m.requires_prescription ? APP_STRINGS.pharmacy.requiresPrescription : APP_STRINGS.pharmacy.otc}</Badge></td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm" title={role === "admin" ? APP_STRINGS.common.clinicalOnly : undefined}>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setEditingMedicine({ ...m, category_id: m.category?.id }); setIsModalOpen(true); }} disabled={role === "admin"} className="text-info disabled:opacity-50"><Edit size={16} /></button>
                    <button onClick={() => confirmDelete(m.id, m.name)} disabled={role === "admin"} className="text-error disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-2xl bg-background shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editingMedicine?.id ? APP_STRINGS.pharmacy.editMedicine : APP_STRINGS.pharmacy.addMedicine}</h2>
            <form onSubmit={handleSaveMedicine} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><label className="block mb-1 font-semibold">{APP_STRINGS.pharmacy.medicineName}</label><input required type="text" value={editingMedicine?.name || ""} onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 bg-background glass-input outline-none focus:border-primary" /></div>
              <div><label className="block mb-1 font-semibold">{APP_STRINGS.pharmacy.price}</label><input required type="number" value={editingMedicine?.price || ""} onChange={(e) => setEditingMedicine({ ...editingMedicine, price: parseFloat(e.target.value) })} className="w-full border rounded-lg px-3 py-2 bg-background glass-input outline-none focus:border-primary" /></div>
              <div className="sm:col-span-2">
                <ImageUpload imageUrl={editingMedicine?.image_url || ""} setImageUrl={(url) => setEditingMedicine({ ...editingMedicine, image_url: url })} label={APP_STRINGS.pharmacy.medicinePhoto} />
              </div>
              <div className="sm:col-span-2 flex gap-2 mt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-black/5 rounded-lg">{APP_STRINGS.common.cancel}</button><button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">{APP_STRINGS.common.save}</button></div>
            </form>
          </Card>
        </div>
      )}
      <DeleteModal isOpen={deleteConfirm?.isOpen || false} onClose={() => setDeleteConfirm(null)} onConfirm={executeDelete} description={deleteConfirm?.title} />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </>
  );
}
