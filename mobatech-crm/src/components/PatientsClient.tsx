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

export function PatientsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin", "doctor"].includes(role)) {
    return <ForbiddenView />;
  }

  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");

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
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<User[]>(`/api/admin/users${qs}`);
      setItems(res.data || []);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [searchQuery, filterValue]);

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
          placeholder="Filter..."
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} placeholder="Cari nama, email, atau no HP pasien..." />
      </div>

      <Card noPadding className="overflow-x-auto">
        <PatientsTable items={items} loading={loading} />
      </Card>

      <CustomSnackbar
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, isOpen: false }))}
      />
    </div>
  );
}
