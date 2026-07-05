"use client";

import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import { User } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { UsersFormModal } from "./UsersFormModal";
import { APP_STRINGS } from "@/lib/constants";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { UsersTable } from "./UsersTable";
import { UserDetailView } from "./UserDetailView";

export function UsersClient() {
  const authUser = useAuthStore((state) => state.user);
  const role = authUser?.role || "admin";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "10");
      if (searchQuery) queryParams.append("search", searchQuery);
      if (roleFilter) queryParams.append("role", roleFilter);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      
      const res = await api.get<User[]>(`/api/admin/users${qs}`);
      setUsers(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.total_pages);
      }
    } catch {
      setToast({ isOpen: true, message: "Gagal memuat data pengguna", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter]);
  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/api/admin/users/${deleteConfirm.id}`);
      setToast({ isOpen: true, message: "Pengguna berhasil dihapus", type: "success" });
      loadUsers();
    } catch (err) {
      setToast({ isOpen: true, message: err instanceof ApiError ? err.message : "Gagal menghapus", type: "error" });
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (role !== "admin") return <ForbiddenView />;

  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader
        title={APP_STRINGS.users.title}
        description={APP_STRINGS.users.subtitle}
        action={
          <Button onClick={() => { setEditingUser(null); setShowModal(true); }} icon={<Plus size={18} />}>
            {APP_STRINGS.users.addBtn}
          </Button>
        }
      />

      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <FilterDropdown
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Dokter', value: 'doctor' },
              { label: 'Apoteker', value: 'pharmacist' },
              { label: 'Pasien', value: 'patient' },
            ]}
            placeholder={APP_STRINGS.common.searchFilter}
          />
          <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <Card noPadding>
        <UsersTable 
          users={users} 
          loading={loading} 
          authUser={authUser}
          onView={(u) => { setViewingUser(u); setIsDrawerOpen(true); }}
          onEdit={(u) => { setEditingUser(u); setShowModal(true); }}
          onDelete={(id, name) => setDeleteConfirm({ id, title: `Hapus pengguna "${name}"?` })}
        />
      </Card>
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <UsersFormModal isOpen={showModal} onClose={() => setShowModal(false)} user={editingUser} onSuccess={loadUsers} setToast={setToast} />
      <DeleteModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} description={deleteConfirm?.title} />
      <UserDetailView isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={viewingUser} />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
