"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { Pagination } from "@/components/ui/Pagination";
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
import { SideDrawer } from "@/components/ui/SideDrawer";
import { BranchesTable } from "./BranchesTable";
import { BranchFormModal } from "./BranchFormModal";
export function BranchesClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";
  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Branch | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [drawerItem, setDrawerItem] = useState<Branch | null>(null);
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
      const res = await api.get<Branch[]>(`/api/branches${qs}`);
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
  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }
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
          placeholder={APP_STRINGS.common.searchSort}
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <BranchesTable
        items={items}
        loading={loading}
        openForm={openForm}
        setDeleteId={setDeleteId}
        onViewDetails={(item) => { setDrawerItem(item); setIsDrawerOpen(true); }}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Detail Cabang">
        {drawerItem && (
          <div className="space-y-3">
            <div className="flex justify-center mb-4">
              <img src={drawerItem.image_url} alt={drawerItem.name} className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white/20" />
            </div>
            <div><strong>Nama Cabang:</strong> {drawerItem.name}</div>
            <div><strong>Alamat:</strong> {drawerItem.address}</div>
            {drawerItem.gmaps_link && (
              <div><strong>Google Maps:</strong> <a href={drawerItem.gmaps_link} target="_blank" rel="noreferrer" className="text-primary hover:underline">Buka Link</a></div>
            )}
          </div>
        )}
      </SideDrawer>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
