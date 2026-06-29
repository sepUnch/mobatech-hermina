"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Polyclinic } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { PolyclinicsTable } from "./PolyclinicsTable";
import { PolyclinicsFormModal } from "./PolyclinicsFormModal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";

export function PolyclinicsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }

  const [items, setItems] = useState<Polyclinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Polyclinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning";
  }>({ isOpen: false, message: "", type: "success" });

  const loadItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      
      const res = await api.get<Polyclinic[]>(`/api/polyclinics${qs}`);
      setItems(res.data || []);
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, [searchQuery, filterValue]);

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

  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader
        title={APP_STRINGS.polyclinics.title}
        description={APP_STRINGS.polyclinics.subtitle}
        action={
          <Button onClick={() => openForm(null)} icon={<Plus size={18} />}>
            {APP_STRINGS.polyclinics.addBtn}
          </Button>
        }
      />

      <div className="flex justify-end mb-4 gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Aktif', value: 'active' },
            { label: 'Nonaktif', value: 'inactive' },
          ]}
          placeholder="Status..."
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <PolyclinicsTable
        items={items}
        loading={loading}
        onEdit={openForm}
        onDelete={setDeleteId}
      />

      <PolyclinicsFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItem={selectedItem}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        isActive={isActive}
        setIsActive={setIsActive}
        handleSave={handleSave}
        saving={saving}
      />

      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        isLoading={saving}
      />

      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
