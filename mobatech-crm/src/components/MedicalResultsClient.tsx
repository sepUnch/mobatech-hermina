"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { APP_STRINGS } from "@/lib/constants";
import { DeleteModal } from "@/components/DeleteModal";
import { SideDrawer } from "@/components/ui/SideDrawer";
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
  const [users, setUsers] = useState<User[]>([]);
  const [results, setResults] = useState<MedicalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); const [filterValue, setFilterValue] = useState("");
  const [drawerItem, setDrawerItem] = useState<MedicalResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    } catch { showToast(APP_STRINGS.common.medicalResultsLoadFailed, "error"); }
    finally { setLoading(false); } };
  const loadUsers = async () => {
    try {
      const res = await api.get<User[]>("/api/admin/users?role=patient");
      setUsers(res.data || []);
    } catch { /* non-blocking */ } };
  useEffect(() => { load(); }, [searchQuery, filterValue]);
  useEffect(() => {
    loadUsers();
    if (searchParams && searchParams.appointment_id) {
      setForm({
        ...defaultForm,
        appointment_id: Number(searchParams.appointment_id),
        user_id: searchParams.user_id ? Number(searchParams.user_id) : 0,
        doctor_name: typeof searchParams.doctor_name === 'string' ? searchParams.doctor_name : "",
      });
      setShowForm(true); }
  }, []);
  const openCreate = () => { setForm(defaultForm); setEditId(null); setShowForm(true); };
  const openEdit = (r: MedicalResult) => { setForm({ user_id: r.user_id, appointment_id: r.appointment_id, doctor_name: r.doctor_name, test_type: r.test_type, test_name: r.test_name, result: r.result, notes: r.notes, file_url: r.file_url, result_date: r.result_date?.slice(0, 10) ?? "" }); setEditId(r.id); setShowForm(true); };
  const handleSave = async () => {
    if (!form.user_id || !form.test_name || !form.result_date) {
      showToast("User ID, Nama Tes, dan Tanggal wajib diisi", "error");
      return; }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/api/admin/medical-results/${editId}`, form);
        showToast(APP_STRINGS.common.medicalResultsUpdated, "success");
      } else {
        await api.post("/api/admin/medical-results", form);
        showToast(APP_STRINGS.common.medicalResultsAdded, "success"); }
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
      load();
    } catch { showToast(APP_STRINGS.common.medicalResultsSaveFailed, "error"); }
    finally { setSaving(false); } };
  const [deleteId, setDeleteId] = useState<number | null>(null); const [isDeleting, setIsDeleting] = useState(false);
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
      setDeleteId(null); } };

  if (!["admin", "doctor"].includes(role)) {
    return <ForbiddenView />; }
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
        onViewDetails={(item) => { setDrawerItem(item); setIsDrawerOpen(true); }}
        userRole={role}
      />
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        isLoading={isDeleting}
      />
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Detail Hasil Medis">
        {drawerItem && (
          <div className="space-y-3">
            <div><strong>Pasien:</strong> {users.find((u) => u.id === drawerItem.user_id)?.full_name || `User #${drawerItem.user_id}`}</div>
            <div><strong>Dokter:</strong> {drawerItem.doctor_name || "-"}</div>
            <div><strong>Tanggal:</strong> {drawerItem.result_date.slice(0, 10)}</div>
            <div><strong>Pemeriksaan:</strong> {drawerItem.test_name} ({drawerItem.test_type})</div>
            <div><strong>Hasil:</strong> {drawerItem.result}</div>
            {drawerItem.notes && <div><strong>Catatan:</strong> {drawerItem.notes}</div>}
            {drawerItem.file_url && (
              <div><strong>Dokumen:</strong> <a href={drawerItem.file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">Unduh File</a></div>
            )}
          </div>
        )}
      </SideDrawer>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div> ); }
