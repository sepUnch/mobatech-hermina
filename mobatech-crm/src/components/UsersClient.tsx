"use client";

import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { User } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Edit, Trash2, ShieldAlert, Plus } from "lucide-react";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { UsersFormModal } from "./UsersFormModal";

import { APP_STRINGS } from "@/lib/constants";
import { Formatters } from "@/lib/formatters";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export function UsersClient() {
  const role = useAuthStore((state) => state.user)?.role || "admin";
  if (role !== "admin") return <ForbiddenView />;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });

  const loadUsers = async () => {
    try {
      setLoading(true);
      let url = "/api/admin/users?";
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      if (roleFilter) url += `role=${encodeURIComponent(roleFilter)}`;
      const res = await api.get<User[]>(url);
      setUsers(res.data || []);
    } catch {
      setToast({ isOpen: true, message: "Gagal memuat data pengguna", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [searchQuery, roleFilter]);

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
      <div className="w-full overflow-x-auto">
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Pengguna</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Kontak</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Peran (Role)</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Tidak ada pengguna ditemukan.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <img src={u.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=113c2b&color=fff`} alt={u.full_name} className="w-8 h-8 rounded-full object-cover border border-glass-border" />
                      <div className="text-left"><div className="font-semibold">{u.full_name}</div><div className="text-xs text-foreground/50">ID: {u.id}</div></div>
                    </div>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm"><div className="font-medium">{u.email}</div><div className="text-xs text-foreground/50">{Formatters.phone(u.phone_number)}</div></td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${u.role === "admin" ? "bg-rose-100 text-rose-700" : u.role === "doctor" ? "bg-blue-100 text-blue-700" : u.role === "pharmacist" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {u.role === "admin" && <ShieldAlert size={12} />}
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => { setEditingUser(u); setShowModal(true); }} className="p-1.5 text-info hover:bg-info/10 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => setDeleteConfirm({ id: u.id, title: `Hapus pengguna "${u.full_name}"?` })} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </Card>

      <UsersFormModal isOpen={showModal} onClose={() => setShowModal(false)} user={editingUser} onSuccess={loadUsers} setToast={setToast} />
      <DeleteModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} description={deleteConfirm?.title} />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
