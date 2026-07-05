"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { APP_STRINGS } from "@/lib/constants";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PatientsTable, User } from "@/components/PatientsTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { Pagination } from "@/components/ui/Pagination";

export function PatientsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [drawerItem, setDrawerItem] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("role", "patient");
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "10");
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<User[]>(`/api/admin/users${qs}`);
      setItems(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.total_pages);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterValue]);

  useEffect(() => {
    loadItems();
  }, [searchQuery, filterValue, currentPage]);

  

  if (!["admin", "doctor"].includes(role)) {
    return <ForbiddenView />;
  }
  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader
        title="Daftar Pasien"
        description="Kelola dan pantau data demografi pasien yang terdaftar di aplikasi mobile."
      />

      <div className="flex justify-end mb-4 gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Terbaru', value: 'newest' },
            { label: 'Terlama', value: 'oldest' },
          ]}
          placeholder={APP_STRINGS.common.searchFilter}
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} placeholder={APP_STRINGS.common.searchPatient} />
      </div>

      <Card noPadding className="overflow-x-auto">
        <PatientsTable items={items} loading={loading} onViewDetails={(u) => { setDrawerItem(u); setIsDrawerOpen(true); }} />
      </Card>
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Detail Pasien">
        {drawerItem && (
          <div className="space-y-3">
            <div><strong>Nama:</strong> {drawerItem.full_name}</div>
            <div><strong>Email:</strong> {drawerItem.email}</div>
            <div><strong>Telepon:</strong> {drawerItem.phone_number}</div>
            <div><strong>Golongan Darah:</strong> {drawerItem.blood_type || "-"}</div>
            <div><strong>Tinggi:</strong> {drawerItem.height || 0} cm</div>
            <div><strong>Berat:</strong> {drawerItem.weight || 0} kg</div>
            <div><strong>Alergi:</strong> {drawerItem.allergies || "-"}</div>
          </div>
        )}
      </SideDrawer>

      <CustomSnackbar
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, isOpen: false }))}
      />
    </div>
  );
}
