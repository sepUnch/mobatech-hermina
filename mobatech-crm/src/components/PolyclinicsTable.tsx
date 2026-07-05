import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Edit2, Trash2, Eye, Inbox } from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Polyclinic } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";

export function PolyclinicsTable({
  items,
  loading,
  onEdit,
  onDelete,
  onViewDetails
}: {
  items: Polyclinic[];
  loading: boolean;
  onEdit: (item: Polyclinic) => void;
  onDelete: (id: number) => void;
  onViewDetails?: (item: Polyclinic) => void;
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
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.polyclinics.tableHeaderName}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.polyclinics.tableHeaderDesc}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.polyclinics.tableHeaderStatus}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.polyclinics.tableHeaderActions}</th>
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
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/75 truncate max-w-xs">{item.description}</td>

                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <Badge variant={item.is_active ? "success" : "error"}>
                      {item.is_active ? APP_STRINGS.polyclinics.statusActive : APP_STRINGS.polyclinics.statusInactive}
                    </Badge>
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
                            onClick: () => onEdit(item),
                          },
                          {
                            label: "Hapus",
                            icon: <Trash2 size={14} />,
                            onClick: () => onDelete(item.id),
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
