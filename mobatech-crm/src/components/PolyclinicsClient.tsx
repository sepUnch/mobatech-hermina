"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { Pagination } from "@/components/ui/Pagination";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Polyclinic } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { Modal } from "@/components/Modal";
import { PolyclinicsTable } from "./PolyclinicsTable";
import { PolyclinicsHeader } from "./PolyclinicsHeader";
import { PolyclinicsModals } from "./PolyclinicsModals";
export function PolyclinicsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";
  const [items, setItems] = useState<Polyclinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Polyclinic | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); const [filterValue, setFilterValue] = useState("");
  const [name, setName] = useState(""); const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [drawerItem, setDrawerItem] = useState<Polyclinic | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning";
  }>({ isOpen: false, message: "", type: "success" });
  const loadItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "10");
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<Polyclinic[]>(`/api/polyclinics${qs}`);
      setItems(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.total_pages);
      }
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterValue]);
  useEffect(() => { loadItems(); }, [searchQuery, filterValue, currentPage]);
  const openForm = (item: Polyclinic | null = null) => {
    setSelectedItem(item);
    setName(item ? item.name : "");
    setDescription(item ? item.description : "");
    setImageUrl(item ? item.image_url : "");
    setIsActive(item ? item.is_active : true);
    setShowModal(true);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name,
      description,
      image_url: imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150",
      is_active: isActive,
    };
    try {
      if (selectedItem) {
        await api.put(`/api/admin/polyclinics/${selectedItem.id}`, payload);
        setToast({ isOpen: true, message: APP_STRINGS.polyclinics.successUpdate, type: "success" });
      } else {
        await api.post("/api/admin/polyclinics", payload);
        setToast({ isOpen: true, message: APP_STRINGS.polyclinics.successCreate, type: "success" });
      }
      setShowModal(false);
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleDelete = async (id: number) => {
    setSaving(true);
    try {
      await api.delete(`/api/admin/polyclinics/${id}`);
      setToast({ isOpen: true, message: APP_STRINGS.polyclinics.successDelete, type: "success" });
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };
  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }
  return (
    <div className="space-y-6 animate-slide-in">
      <PolyclinicsHeader
        openForm={() => openForm(null)}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <PolyclinicsTable
        items={items}
        loading={loading}
        onEdit={openForm}
        onDelete={setDeleteId}
        onViewDetails={(item) => { setDrawerItem(item); setIsDrawerOpen(true); }}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <PolyclinicsModals
        showModal={showModal} setShowModal={setShowModal}
        selectedItem={selectedItem} name={name} setName={setName}
        description={description} setDescription={setDescription}
        imageUrl={imageUrl} setImageUrl={setImageUrl}
        isActive={isActive} setIsActive={setIsActive}
        handleSave={handleSave} saving={saving}
        deleteId={deleteId} setDeleteId={setDeleteId}
        handleDelete={handleDelete}
      />
      <Modal isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Detail Poliklinik">
        {drawerItem && (
          <div className="space-y-3">
            <div className="flex justify-center mb-4">
              <img src={drawerItem.image_url} alt={drawerItem.name} className="w-24 h-24 rounded-xl object-cover shadow-lg border-2 border-white/20" />
            </div>
            <div><strong>Nama:</strong> {drawerItem.name}</div>
            <div><strong>Deskripsi:</strong> {drawerItem.description}</div>
            <div><strong>Status:</strong> {drawerItem.is_active ? "Aktif" : "Non-Aktif"}</div>
          </div>
        )}
      </Modal>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
