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
import { AppointmentDetailView } from "@/components/AppointmentDetailView";
import { Pagination } from "@/components/ui/Pagination";

export function AppointmentsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerItem, setDrawerItem] = useState<Appointment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning";
  }>({ isOpen: false, message: "", type: "success" });

  const loadItems = async () => {
    try {
      const q = new URLSearchParams({ page: currentPage.toString(), limit: "10" });
      if (searchQuery) q.append("search", searchQuery);
      if (filterValue) q.append("filter", filterValue);
      const res = await api.get<Appointment[]>(`/api/admin/appointments?${q}`);
      setItems(res.data || []);
      if (res.meta) setTotalPages(res.meta.total_pages);
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
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

  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleAction = async (id: number, action: string, msg: string, onFin?: () => void) => {
    try {
      await api.post(`/api/admin/appointments/${id}/${action}`, {});
      setToast({ isOpen: true, message: msg, type: "success" });
      loadItems();
    } catch (err) {
      setToast({ isOpen: true, message: err instanceof ApiError ? err.message : APP_STRINGS.login.networkError, type: "error" });
    } finally {
      onFin?.();
    }
  };

  const handleApprove = async (id: number) => {
    if (processingId) return;
    setProcessingId(id);
    await handleAction(id, "approve", "Antrean berhasil disetujui", () => setProcessingId(null));
  };
  const executeCancel = (id: number) => handleAction(id, "cancel", "Antrean dibatalkan", () => setCancelConfirmId(null));
  const handleComplete = (id: number) => handleAction(id, "complete", "Antrean diselesaikan");

  const openDrawer = (item: Appointment) => {
    setDrawerItem(item);
    setIsDrawerOpen(true);
  };

  

  if (!["admin", "doctor"].includes(role)) {
    return <ForbiddenView />;
  }
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
          onViewDetails={openDrawer}
        />
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <ConfirmModal
        isOpen={cancelConfirmId !== null}
        onClose={() => setCancelConfirmId(null)}
        onConfirm={() => cancelConfirmId !== null && executeCancel(cancelConfirmId)}
        title="Batalkan Antrean"
        description="Apakah Anda yakin ingin membatalkan antrean pasien ini? Aksi ini tidak dapat dikembalikan."
        confirmText="Ya, Batalkan"
        variant="danger"
      />

      <AppointmentDetailView isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} drawerItem={drawerItem} />

      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
