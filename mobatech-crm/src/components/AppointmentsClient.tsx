"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Appointment } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { AppointmentsTable } from "@/components/AppointmentsTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ConfirmModal } from "@/components/ConfirmModal";

export function AppointmentsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin", "doctor"].includes(role)) {
    return <ForbiddenView />;
  }

  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
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
      const res = await api.get<Appointment[]>(`/api/admin/appointments${qs}`);
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

  const handleApprove = async (id: number) => {
    if (processingId) return;
    setProcessingId(id);
    try {
      await api.post(`/api/admin/appointments/${id}/approve`, {});
      setToast({ isOpen: true, message: "Antrean berhasil disetujui", type: "success" });
      await loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const executeCancel = async (id: number) => {
    try {
      await api.post(`/api/admin/appointments/${id}/cancel`, {});
      setToast({ isOpen: true, message: "Antrean dibatalkan", type: "success" });
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    } finally {
      setCancelConfirmId(null);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await api.post(`/api/admin/appointments/${id}/complete`, {});
      setToast({ isOpen: true, message: "Antrean diselesaikan", type: "success" });
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <PageHeader
        title="Antrean Pasien"
        description="Pantau jadwal dan janji temu pasien (Live Booking Queue)."
      />

      <div className="w-full flex flex-row items-center justify-between sm:justify-end gap-2 mb-4">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Hari Ini', value: 'today' },
            { label: 'Besok', value: 'tomorrow' },
          ]}
          placeholder={APP_STRINGS.common.searchSchedule}
          className="flex-1 sm:flex-none sm:w-48 h-11"
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} className="flex-1 sm:flex-none sm:w-64 h-11" />
      </div>

      <Card noPadding className="overflow-x-auto">
        <AppointmentsTable 
          items={items}
          loading={loading}
          onApprove={handleApprove}
          onCancel={setCancelConfirmId}
          onComplete={handleComplete}
        />
      </Card>

      <ConfirmModal
        isOpen={cancelConfirmId !== null}
        onClose={() => setCancelConfirmId(null)}
        onConfirm={() => cancelConfirmId !== null && executeCancel(cancelConfirmId)}
        title="Batalkan Antrean"
        description="Apakah Anda yakin ingin membatalkan antrean pasien ini? Aksi ini tidak dapat dikembalikan."
        confirmText="Ya, Batalkan"
        variant="danger"
      />

      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
