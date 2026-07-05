"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Medicine, MedicineCategory } from "@/types/api";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { DeleteModal } from "@/components/DeleteModal";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { APP_STRINGS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { MedicineFormModal } from "./MedicineFormModal";
import { MedicineDetailView } from "./MedicineDetailView";
import { PharmacyMedicinesTable } from "./PharmacyMedicinesTable";

export function PharmacyMedicines({ initialMedicines, categories }: { initialMedicines: Medicine[], categories: MedicineCategory[] }) {
  const role = useAuthStore((state) => state.user)?.role || "admin";
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Partial<Medicine> | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{isOpen: boolean; message: string; type: "success"|"error"}>({ isOpen: false, message: "", type: "success" });
  const showToast = (message: string, type: "success" | "error") => setToast({ isOpen: true, message, type });

  const loadMedicines = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "10");
      if (searchQuery) queryParams.append("search", searchQuery);
      if (selectedCategory) queryParams.append("category_id", selectedCategory);
      
      const res = await api.get<Medicine[]>(`/api/pharmacy/medicines?${queryParams.toString()}`);
      setMedicines(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.total_pages);
      }
    } catch { showToast(APP_STRINGS.common.loadError, "error"); }
  };

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory]);
  useEffect(() => { loadMedicines(); }, [searchQuery, selectedCategory, currentPage]);

  const handleSaveMedicine = async (payload: Partial<Medicine>) => {
    try {
      if (payload.id) {
        await api.put(`/api/admin/pharmacy/medicines/${payload.id}`, payload);
        showToast(APP_STRINGS.common.updateSuccess, "success");
      } else {
        await api.post(`/api/admin/pharmacy/medicines`, payload);
        showToast(APP_STRINGS.common.createSuccess, "success");
      }
      setIsModalOpen(false);
      loadMedicines();
    } catch { showToast(APP_STRINGS.common.saveError, "error"); }
  };

  const confirmDelete = (id: number, name: string) => {
    setDeleteConfirm({ isOpen: true, id, title: `Hapus obat "${name}"?` });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/api/admin/pharmacy/medicines/${deleteConfirm.id}`);
      showToast(APP_STRINGS.common.deleteSuccess, "success");
      loadMedicines();
    } catch { showToast(APP_STRINGS.common.deleteError, "error"); }
    finally { setDeleteConfirm(null); }
  };

  const categoryOptions = categories.map((c) => ({ label: c.name, value: String(c.id) }));

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col sm:flex-row flex-1 gap-2">
          <FilterDropdown value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} placeholder={APP_STRINGS.common.searchFilter} className="w-full sm:w-48 h-11" />
          <SearchFilterBar value={searchQuery} onChange={setSearchQuery} className="w-full sm:max-w-xs h-11" />
        </div>
        <div title={role === "admin" ? APP_STRINGS.common.clinicalOnly : undefined}>
          <Button onClick={() => { setEditingMedicine({ requires_prescription: false }); setIsModalOpen(true); }} disabled={role === "admin"} icon={<Plus size={16} />}>
            {APP_STRINGS.pharmacy.addMedicine}
          </Button>
        </div>
      </div>

      <PharmacyMedicinesTable
        medicines={medicines}
        role={role}
        onView={(m) => { setViewingMedicine(m); setIsDrawerOpen(true); }}
        onEdit={(m) => { setEditingMedicine(m); setIsModalOpen(true); }}
        onDelete={(id, name) => confirmDelete(id, name)}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <MedicineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicine={editingMedicine}
        categories={categories}
        onSave={handleSaveMedicine}
      />
      <DeleteModal isOpen={deleteConfirm?.isOpen || false} onClose={() => setDeleteConfirm(null)} onConfirm={executeDelete} description={deleteConfirm?.title} />
      <MedicineDetailView isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} medicine={viewingMedicine} />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </>
  );
}
