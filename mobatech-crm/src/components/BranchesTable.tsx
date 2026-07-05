import React from "react";
import { Branch } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Edit2, Trash2, MapPin, Eye, Inbox } from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export function BranchesTable({
  items,
  loading,
  openForm,
  setDeleteId,
  onViewDetails,
}: {
  items: Branch[];
  loading: boolean;
  openForm: (item: Branch) => void;
  setDeleteId: (id: number) => void;
  onViewDetails?: (item: Branch) => void;
}) {
  return (
    <Card noPadding>
      <div className="w-full overflow-x-auto">
        {loading ? (
          <SkeletonTable rows={5} columns={4} />
        ) : (
          <table className="w-full text-center border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderName}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderAddress}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderGmaps}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderActions}</th>
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
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-semibold flex items-center justify-center gap-3">
                    <img src={item.image_url} alt={item.name} className="w-8 h-8 rounded-full object-cover bg-glass-panel" />
                    {item.name}
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/75 truncate max-w-xs">{item.address}</td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    {item.gmaps_link ? (
                      <a href={item.gmaps_link} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center justify-center gap-1">
                        <MapPin size={14} /> Buka Maps
                      </a>
                    ) : (
                      <span className="text-foreground/40 text-xs">Belum ada</span>
                    )}
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex justify-center">
                      <ActionMenu
                        items={[
                          ...(onViewDetails ? [{
                            label: "Lihat Detail",
                            icon: <Eye size={14} />,
                            onClick: () => onViewDetails(item),
                          }] : []),
                          {
                            label: "Ubah",
                            icon: <Edit2 size={14} />,
                            onClick: () => openForm(item),
                          },
                          {
                            label: "Hapus",
                            icon: <Trash2 size={14} />,
                            onClick: () => setDeleteId(item.id),
                            variant: "danger" as const,
                          }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
