import React from "react";
import { Doctor } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { Formatters } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2, Calendar } from "lucide-react";

export function DoctorsTable({
  items,
  loading,
  openSchedules,
  openForm,
  setDeleteId,
}: {
  items: Doctor[];
  loading: boolean;
  openSchedules: (item: Doctor) => void;
  openForm: (item: Doctor) => void;
  setDeleteId: (id: number) => void;
}) {
  const user = useAuthStore((state) => state.user);
  const isDoctor = user?.role === "doctor";
  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat data...</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-center border-collapse text-sm">
        <thead>
          <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.doctors.tableHeaderName}</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Poliklinik</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.doctors.tableHeaderSpec}</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.doctors.tableHeaderContact}</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.doctors.tableHeaderStatus}</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.doctors.tableHeaderActions}</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (<tr><td colSpan={100} className="text-center py-12 text-foreground/50 text-sm">Tidak ada data yang ditemukan.</td></tr>) : items.map((item) => (
            <tr key={item.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-semibold">{item.name}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/75">{item.polyclinic?.name || "-"}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/75">{item.specialization}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/60">{Formatters.phone(item.contact_info)}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                <Badge variant={item.is_active ? "success" : "error"}>
                  {item.is_active ? APP_STRINGS.doctors.statusActive : APP_STRINGS.doctors.statusInactive}
                </Badge>
              </td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline" onClick={() => openSchedules(item)} icon={<Calendar size={14} />}>
                    Jadwal
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openForm(item)} className="text-primary hover:text-primary-hover px-2" icon={<Edit2 size={14} />}>
                    Ubah
                  </Button>
                  {!isDoctor && (
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(item.id)} className="text-rose-500 hover:text-rose-600 px-2" icon={<Trash2 size={14} />}>
                      Hapus
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
