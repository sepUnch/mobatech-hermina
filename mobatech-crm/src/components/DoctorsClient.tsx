"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Doctor, DoctorSchedule, Polyclinic } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DoctorFormModal } from "@/components/DoctorFormModal";
import { ScheduleModal } from "@/components/ScheduleModal";
import { DeleteModal } from "@/components/DeleteModal";
import { DoctorsHeader } from "./DoctorsHeader";
import { DoctorsContent } from "./DoctorsContent";
export function DoctorsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";
  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }
  const [items, setItems] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [activeTab, setActiveTab] = useState<"doctors" | "schedules">("doctors");
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSchedModal, setShowSchedModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [polyclinics, setPolyclinics] = useState<Polyclinic[]>([]);
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
      
      const [docRes, schedRes] = await Promise.allSettled([
        api.get<Doctor[]>(`/api/doctors${qs}`),
        api.get<DoctorSchedule[]>("/api/admin/schedules?limit=200")
      ]);
      setItems(docRes.status === "fulfilled" ? (docRes.value.data || []) : []);
      setSchedules(schedRes.status === "fulfilled" ? (schedRes.value.data || []) : []);
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    api.get<Polyclinic[]>("/api/polyclinics").then((res) => setPolyclinics(res.data || [])).catch(() => {});
  }, []);
  useEffect(() => {
    loadItems();
    const interval = setInterval(() => loadItems(), 5000);
return () => clearInterval(interval);
  }, [searchQuery, filterValue]);
  const openForm = (item: Doctor | null = null) => {
    setSelectedItem(item);
    setShowFormModal(true);
  };
  const openSchedules = (item: Doctor) => {
    setSelectedItem(item);
    setShowSchedModal(true);
  };
  const handleSave = async (payload: {
    name: string;
    specialization: string;
    polyclinic_id?: number;
    contact_info: string;
    description: string;
    image_url: string;
    is_active: boolean;
  }) => {
    try {
      if (selectedItem) {
        await api.put(`/api/admin/doctors/${selectedItem.id}`, payload);
        setToast({ isOpen: true, message: APP_STRINGS.doctors.successUpdate, type: "success" });
      } else {
        await api.post("/api/admin/doctors", payload);
        setToast({ isOpen: true, message: APP_STRINGS.doctors.successCreate, type: "success" });
      }
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
      throw err;
    }
  };
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/doctors/${id}`);
      setToast({ isOpen: true, message: APP_STRINGS.doctors.successDelete, type: "success" });
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
      <DoctorsHeader
        openForm={() => openForm(null)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        polyclinicOptions={polyclinics.map((p) => ({ label: p.name, value: p.name }))}
      />
      <DoctorsContent
        activeTab={activeTab}
        items={items}
        loading={loading}
        openSchedules={openSchedules}
        openForm={openForm}
        setDeleteId={setDeleteId}
        schedules={schedules}
      />
      <DoctorFormModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} doctor={selectedItem} onSave={handleSave} />
      <ScheduleModal isOpen={showSchedModal} onClose={() => setShowSchedModal(false)} doctor={selectedItem} onChange={loadItems} />
      
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
