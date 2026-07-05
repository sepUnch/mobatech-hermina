"use client";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { PromosFormModal } from "./PromosFormModal";
import { APP_STRINGS } from "@/lib/constants";
import { Promo } from "@/types/api";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { PromoDetailView } from "./PromoDetailView";

export function PromosClient() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [viewingPromo, setViewingPromo] = useState<Promo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPromos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "10");
      if (searchQuery) queryParams.append("search", searchQuery);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<Promo[]>(`/api/admin/promos${qs}`);
      setPromos(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.total_pages);
      }
    } catch {
      setToast({ isOpen: true, message: "Gagal memuat promo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);
  useEffect(() => { loadPromos(); }, [searchQuery, currentPage]);

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
                    <div className="flex justify-center">
                      <ActionMenu
                        items={[
                          {
                            label: "Lihat Detail",
                            icon: <Eye size={14} />,
                            onClick: () => { setViewingPromo(p); setIsDrawerOpen(true); }
                          },
                          {
                            label: "Ubah",
                            icon: <Edit size={14} />,
                            onClick: () => { setEditingPromo(p); setShowModal(true); }
                          },
                          {
                            label: "Hapus",
                            icon: <Trash2 size={14} />,
                            onClick: () => setDeleteConfirm({ id: p.id, title: `Hapus promo "${p.title}"?` }),
                            variant: "danger" as const
                          }
                        ]}
                      />
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <PromosFormModal isOpen={showModal} onClose={() => setShowModal(false)} promo={editingPromo} onSuccess={loadPromos} setToast={setToast} />
      <DeleteModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} description={deleteConfirm?.title} />
      <PromoDetailView isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} promo={viewingPromo} />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
