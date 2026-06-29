"use client";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { PromosFormModal } from "./PromosFormModal";
import { APP_STRINGS } from "@/lib/constants";

export function PromosClient() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  const loadPromos = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>("/api/admin/promos");
      let data = res.data || [];
      if (searchQuery) {
        data = data.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setPromos(data);
    } catch {
      setToast({ isOpen: true, message: "Gagal memuat promo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPromos(); }, [searchQuery]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/api/admin/promos/${deleteConfirm.id}`);
      setToast({ isOpen: true, message: "Promo berhasil dihapus", type: "success" });
      loadPromos();
    } catch (err) {
      setToast({ isOpen: true, message: err instanceof ApiError ? err.message : "Gagal menghapus", type: "error" });
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader 
        title="Manajemen Promo" 
        description="Atur promo dan penawaran spesial untuk aplikasi pasien" 
        action={<Button onClick={() => { setEditingPromo(null); setShowModal(true); }} icon={<Plus size={18} />}>Tambah Promo</Button>} 
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-end mb-4 gap-2">
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} placeholder={APP_STRINGS.promos.searchPlaceholder} className="w-full sm:max-w-sm" />
      </div>

      <Card noPadding>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-center border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Promo / Subtitle</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Warna Tema</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Status</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Memuat...</td></tr> : promos.map((p) => (
                <tr key={p.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="text-left"><div className="font-semibold">{p.title}</div><div className="text-xs text-foreground/60">{p.subtitle}</div></div>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-glass-border shadow-sm" style={{backgroundColor: p.themeColor}}></div>
                      <span className="font-mono text-xs text-foreground/75">{p.themeColor}</span>
                    </div>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {p.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => { setEditingPromo(p); setShowModal(true); }} className="p-1.5 text-info hover:bg-info/10 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => setDeleteConfirm({id: p.id, title: `Hapus promo "${p.title}"?`})} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && promos.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Tidak ada promo ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <PromosFormModal isOpen={showModal} onClose={() => setShowModal(false)} promo={editingPromo} onSuccess={loadPromos} setToast={setToast} />
      <DeleteModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} description={deleteConfirm?.title} />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({...t, isOpen: false}))} />
    </div>
  );
}
