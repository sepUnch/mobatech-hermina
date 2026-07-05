import React from "react";
import { Doctor } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { Formatters } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2, Calendar, Eye, Inbox } from "lucide-react";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { ActionMenu } from "@/components/ui/ActionMenu";
export function DoctorsTable({
  items,
  loading,
  onViewDetails,
  openSchedules,
  openForm,
  setDeleteId,
}: {
  items: Doctor[];
  loading: boolean;
  onViewDetails: (item: Doctor) => void;
  openSchedules: (item: Doctor) => void;
  openForm: (item: Doctor) => void;
  setDeleteId: (id: number) => void;
}) {
  const user = useAuthStore((state) => state.user);
  const isDoctor = user?.role === "doctor";
  if (loading) {
    return <SkeletonTable rows={5} columns={6} />;
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
          {items.length === 0 ? (
            <tr>
              <td colSpan={100} className="text-center py-16">
                <div className="flex flex-col items-center justify-center text-foreground/50">
                  <Inbox className="w-12 h-12 mb-3 text-foreground/20" />
                  <p className="text-sm">Data tidak ditemukan</p>
                </div>
              </td>
            </tr>
          ) : items.map((item) => (
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
                <div className="flex justify-center">
                  <ActionMenu
                    items={[
                      {
                        label: "Lihat Detail",
                        icon: <Eye size={14} />,
                        onClick: () => onViewDetails(item),
                      },
                      {
                        label: "Jadwal",
                        icon: <Calendar size={14} />,
                        onClick: () => openSchedules(item),
                      },
                      {
                        label: "Ubah",
                        icon: <Edit2 size={14} />,
                        onClick: () => openForm(item),
                      },
                      ...(!isDoctor ? [{
                        label: "Hapus",
                        icon: <Trash2 size={14} />,
                        onClick: () => setDeleteId(item.id),
                        variant: "danger" as const,
                      }] : [])
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
