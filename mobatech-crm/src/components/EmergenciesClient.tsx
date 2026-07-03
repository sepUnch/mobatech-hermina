/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { Formatters } from "@/lib/formatters";
import { EmergencyRequest } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { EmergenciesHeader } from "./EmergenciesHeader";
export function EmergenciesClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }
  const [items, setItems] = useState<EmergencyRequest[]>([]);
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
      const res = await api.get<EmergencyRequest[]>(`/api/admin/emergencies${qs}`);
      setItems(res.data || []);
    } catch {
      setToast({ isOpen: true, message: APP_STRINGS.login.networkError, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    const interval = setInterval(loadItems, 10000);
return () => clearInterval(interval);
  }, [searchQuery, filterValue]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/admin/emergencies/${id}/status`, { status });
      setToast({ isOpen: true, message: `Status diperbarui menjadi ${status}`, type: "success" });
      loadItems();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : APP_STRINGS.login.networkError;
      setToast({ isOpen: true, message: msg, type: "error" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="error" className="animate-pulse">Kritis (Menunggu)</Badge>;
      case "Dispatched":
        return <Badge variant="warning">Ambulans Jalan</Badge>;
      case "Arrived":
        return <Badge variant="info">Tiba di Lokasi</Badge>;
      case "Resolved":
        return <Badge variant="success">Selesai</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };
return (
    <div className="space-y-6 animate-slide-in">
      <EmergenciesHeader
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Card noPadding className="overflow-x-auto">
        {loading && items.length === 0 ? (
          <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat data...</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
                <th className="p-4">Waktu Laporan</th>
                <th className="p-4">Nama Pasien</th>
                <th className="p-4">Kondisi</th>
                <th className="p-4">Lokasi & Kontak</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={`border-b border-glass-border/50 transition-colors ${item.status === 'Pending' ? 'bg-rose-500/5 dark:bg-rose-500/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <td className="p-4 text-foreground/80">{Formatters.date(item.created_at, "datetimesec")}</td>
                  <td className="p-4 font-semibold text-rose-600 dark:text-rose-400">{item.patient_name}</td>
                  <td className="p-4 text-foreground/80 max-w-[150px] truncate">{item.condition}</td>
                  <td className="p-4">
                    <div className="text-foreground/80 font-medium truncate max-w-[200px]">{item.location}</div>
                    <div className="text-xs text-foreground/60 mt-1">{Formatters.phone(item.phone_number)}</div>
                  </td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    {item.status === "Pending" && (
                      <Button size="sm" onClick={() => updateStatus(item.id, "Dispatched")} className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20">
                        Kirim Ambulans
                      </Button>
                    )}
                    {item.status === "Dispatched" && (
                      <Button size="sm" onClick={() => updateStatus(item.id, "Arrived")} className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">
                        Tiba di Lokasi
                      </Button>
                    )}
                    {item.status === "Arrived" && (
                      <Button size="sm" onClick={() => updateStatus(item.id, "Resolved")} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                        Selesai
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-foreground/50 text-sm">Tidak ada keadaan darurat saat ini</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
