"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { DeleteModal } from "@/components/DeleteModal";
import { MedicalResultsTable } from "./MedicalResultsTable";
import { MedicalResultsForm } from "./MedicalResultsForm";
import { MedicalResultsHeader } from "./MedicalResultsHeader";

interface User { id: number; full_name: string; email: string; }
interface MedicalResult { id: number; created_at: string; user_id: number; appointment_id: number; doctor_name: string; test_type: string; test_name: string; result: string; notes: string; file_url: string; result_date: string; }
const TEST_TYPES = ["Lab", "Radiologi", "EKG", "USG", "Endoskopi", "Lainnya"];
const defaultForm = { user_id: 0, appointment_id: 0, doctor_name: "", test_type: "Lab", test_name: "", result: "", notes: "", file_url: "", result_date: "" };

export function MedicalResultsClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin", "doctor"].includes(role)) {
    return <ForbiddenView />;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [results, setResults] = useState<MedicalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });

  const showToast = (message: string, type: "success" | "error") => setToast({ isOpen: true, message, type });

  const load = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<MedicalResult[]>(`/api/admin/medical-results${qs}`);
      setResults(res.data || []);
    } catch { showToast("Gagal memuat hasil medis", "error"); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get<User[]>("/api/admin/users?role=patient");
      setUsers(res.data || []);
    } catch { /* non-blocking */ }
  };

  useEffect(() => { load(); }, [searchQuery, filterValue]);
  useEffect(() => { loadUsers(); }, []);

  const openCreate = () => { setForm(defaultForm); setEditId(null); setShowForm(true); };
  const openEdit = (r: MedicalResult) => {
    setForm({ user_id: r.user_id, appointment_id: r.appointment_id, doctor_name: r.doctor_name, test_type: r.test_type, test_name: r.test_name, result: r.result, notes: r.notes, file_url: r.file_url, result_date: r.result_date?.slice(0, 10) ?? "" });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.user_id || !form.test_name || !form.result_date) {
      showToast("User ID, Nama Tes, dan Tanggal wajib diisi", "error");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/api/admin/medical-results/${editId}`, form);
        showToast("Hasil medis diperbarui", "success");
      } else {
        await api.post("/api/admin/medical-results", form);
        showToast("Hasil medis berhasil ditambahkan", "success");
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
      load();
    } catch { showToast("Gagal menyimpan data", "error"); }
    finally { setSaving(false); }
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/medical-results/${id}`);
      showToast("Data dihapus", "success");
      load();
    } catch { 
      showToast("Gagal menghapus data", "error"); 
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
return (
    <div className="space-y-6 animate-slide-in">
      <MedicalResultsHeader
        openCreate={openCreate}
        role={role}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {showForm && (
        <MedicalResultsForm
          form={form}
          setForm={setForm}
          users={users}
          saving={saving}
          editId={editId}
          handleSave={handleSave}
          onCancel={() => setShowForm(false)}
          testTypes={TEST_TYPES}
        />
      )}

      <MedicalResultsTable
        loading={loading}
        results={results}
        users={users}
        onEdit={openEdit}
        onDelete={setDeleteId}
        userRole={role}
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
