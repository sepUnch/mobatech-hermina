import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill, CheckCircle } from "lucide-react";
import { Prescription } from "@/types/api";
import { Formatters } from "@/lib/formatters";

export function PharmacyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<{isOpen: boolean, message: string, type: "success"|"error"}>({ isOpen: false, message: "", type: "success" });

  const load = async () => {
    try {
      const res = await api.get<Prescription[]>("/api/admin/pharmacy/prescriptions");
      setPrescriptions(res.data || []);
    } catch (e) {
      console.error(e);
      setToast({ isOpen: true, message: "Gagal memuat resep", type: "error" });
    } finally {
      setLoading(false);
    }
  };

   
  useEffect(() => { load(); }, []);

  const handleProcess = async (id: number) => {
    try {
      await api.post(`/api/admin/pharmacy/prescriptions/${id}/process`, {});
      setToast({ isOpen: true, message: "Resep berhasil diproses ke pesanan", type: "success" });
      load();
    } catch {
      setToast({ isOpen: true, message: "Gagal memproses resep", type: "error" });
    }
  };

  const filtered = useMemo(() => {
    return prescriptions.filter(p => {
      const matchSearch = p.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) || String(p.id).includes(searchQuery);
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [prescriptions, searchQuery, statusFilter]);

  if (loading) return <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat E-Resep...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Antrean E-Resep"
        description="Kelola dan proses resep obat masuk dari dokter ke instalasi farmasi."
      />

      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Semua Status", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Selesai", value: "completed" }
          ]}
          placeholder="Filter Status"
          className="w-full sm:w-48 h-10"
        />
        <SearchFilterBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="w-full sm:max-w-xs h-10"
          placeholder="Cari dokter atau ID..."
        />
      </div>

      <Card noPadding>
        <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold text-center">
              <th className="py-2 px-4">Tanggal</th>
              <th className="py-2 px-4">ID Pasien</th>
              <th className="py-2 px-4">Dokter</th>
              <th className="py-2 px-4">Diagnosa</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 text-center">
                <td className="py-3 px-4 font-medium text-xs">{Formatters.date(p.created_at, "datetime")}</td>
                <td className="py-3 px-4 text-xs font-semibold">RES-{p.id}</td>
                <td className="py-3 px-4 font-semibold">{p.doctor_name || "Anonim"}</td>
                <td className="py-3 px-4">
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-bold">
                    {p.items?.length || 0} Obat
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {p.status === "pending" ? (
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-500/30 hover:bg-blue-500/10 shadow-sm" onClick={() => handleProcess(p.id)} icon={<Pill size={14}/>}>
                      Proses
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl w-max mx-auto"><CheckCircle size={14}/> Tuntas</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-4 text-center text-foreground/50">Tidak ada E-Resep saat ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
      </Card>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(t => ({...t, isOpen: false}))} />
    </div>
  );
}
