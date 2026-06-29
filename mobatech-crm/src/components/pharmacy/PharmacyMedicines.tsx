"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { Medicine, MedicineCategory } from "@/types/api";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Edit, Trash2, Package } from "lucide-react";
import { DeleteModal } from "@/components/DeleteModal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";

export function PharmacyMedicines({ initialMedicines, categories, showToast }: { initialMedicines: Medicine[], categories: MedicineCategory[], showToast: (msg: string, type: "success"|"error") => void }) {
  const role = useAuthStore((state) => state.user)?.role || "admin";
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Partial<Medicine> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMedicines = async () => {
    try {
      const res = await api.get<Medicine[]>(`/api/pharmacy/medicines${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      setMedicines(res.data || []);
    } catch { showToast("Gagal memuat obat", "error"); }
  };

  useEffect(() => { loadMedicines(); }, [searchQuery]);

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicine?.id) {
        await api.put(`/api/admin/pharmacy/medicines/${editingMedicine.id}`, editingMedicine);
        showToast("Obat diperbarui", "success");
      } else {
        await api.post(`/api/admin/pharmacy/medicines`, editingMedicine);
        showToast("Obat ditambahkan", "success");
      }
      setIsModalOpen(false);
      loadMedicines();
    } catch { showToast("Gagal menyimpan obat", "error"); }
  };

  const confirmDelete = (id: number, name: string) => {
    setDeleteConfirm({ isOpen: true, id, title: `Hapus obat "${name}"?` });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/api/admin/pharmacy/medicines/${deleteConfirm.id}`);
      showToast("Obat dihapus", "success");
      loadMedicines();
    } catch { showToast("Gagal menghapus", "error"); }
    finally { setDeleteConfirm(null); }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
        <div title={role === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
          <button onClick={() => { setEditingMedicine({ requires_prescription: false }); setIsModalOpen(true); }} disabled={role === "admin"} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold whitespace-nowrap disabled:opacity-50">Tambah Obat</button>
        </div>
      </div>
      <Card noPadding className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-black/5 font-semibold">
              <th className="p-4">Nama Obat</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Stok</th>
              <th className="p-4">Resep</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id} className="border-b border-glass-border/50">
                <td className="p-4">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-foreground/50">{m.generic_name} • {m.dosage} {m.unit}</div>
                </td>
                <td className="p-4">{m.category?.name ?? "-"}</td>
                <td className="p-4 font-medium">Rp {m.price?.toLocaleString("id-ID")}</td>
                <td className="p-4"><Badge variant={m.stock <= 10 ? "error" : "success"}>{m.stock}</Badge></td>
                <td className="p-4"><Badge variant={m.requires_prescription ? "warning" : "neutral"}>{m.requires_prescription ? "Wajib Resep" : "Bebas"}</Badge></td>
                <td className="p-4 flex gap-2" title={role === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
                  <button onClick={() => { setEditingMedicine({ ...m, category_id: m.category?.id }); setIsModalOpen(true); }} disabled={role === "admin"} className="text-info disabled:opacity-50"><Edit size={16} /></button>
                  <button onClick={() => confirmDelete(m.id, m.name)} disabled={role === "admin"} className="text-error disabled:opacity-50"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      
      {/* Basic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-2xl bg-background shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editingMedicine?.id ? "Edit Obat" : "Tambah Obat"}</h2>
            <form onSubmit={handleSaveMedicine} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 font-semibold">Nama Obat</label>
                <input required type="text" value={editingMedicine?.name || ""} onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 bg-background glass-input outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Harga (Rp)</label>
                <input required type="number" value={editingMedicine?.price || ""} onChange={(e) => setEditingMedicine({ ...editingMedicine, price: parseFloat(e.target.value) })} className="w-full border rounded-lg px-3 py-2 bg-background glass-input outline-none focus:border-primary" />
              </div>
              <div className="sm:col-span-2 flex gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-black/5 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Simpan</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <DeleteModal isOpen={deleteConfirm?.isOpen || false} onClose={() => setDeleteConfirm(null)} onConfirm={executeDelete} description={deleteConfirm?.title} />
    </>
  );
}
