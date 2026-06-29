"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Branch } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { BranchesTable } from "./BranchesTable";
import { BranchFormModal } from "./BranchFormModal";

export function BranchesClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }

  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Branch | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");

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
      const res = await api.get<Branch[]>(`/api/branches${qs}`);
      setItems(res.data || []);
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [searchQuery, filterValue]);

  const openForm = (item: Branch | null = null) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/branches/${id}`);
      setToast({ isOpen: true, message: APP_STRINGS.branches.successDelete, type: "success" });
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader
        title={APP_STRINGS.branches.title}
        description={APP_STRINGS.branches.subtitle}
        action={
          <Button onClick={() => openForm(null)} icon={<Plus size={18} />}>
            {APP_STRINGS.branches.addBtn}
          </Button>
        }
      />

      <div className="flex justify-end mb-4 gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'A-Z', value: 'az' },
            { label: 'Z-A', value: 'za' },
          ]}
          placeholder="Urutkan..."
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <BranchesTable
        items={items}
        loading={loading}
        openForm={openForm}
        setDeleteId={setDeleteId}
      />

      <BranchFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        branch={selectedItem}
        onSuccess={loadItems}
        setToast={setToast}
      />

      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        isLoading={isDeleting}
      />

      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
