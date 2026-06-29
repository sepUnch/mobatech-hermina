import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Edit2, Trash2 } from "lucide-react";
import { Polyclinic } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";

export function PolyclinicsTable({
  items,
  loading,
  onEdit,
  onDelete
}: {
  items: Polyclinic[];
  loading: boolean;
  onEdit: (item: Polyclinic) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card noPadding>
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat data...</div>
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
              {items.length === 0 ? (<tr><td colSpan={100} className="text-center py-12 text-foreground/50 text-sm">Tidak ada data yang ditemukan.</td></tr>) : items.map((item) => (
                <tr key={item.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-semibold">{item.name}</td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/75 truncate max-w-xs">{item.description}</td>

                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <Badge variant={item.is_active ? "success" : "error"}>
                      {item.is_active ? APP_STRINGS.polyclinics.statusActive : APP_STRINGS.polyclinics.statusInactive}
                    </Badge>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(item)} className="text-primary hover:text-primary-hover px-2" icon={<Edit2 size={14} />}>
                        Ubah
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-600 px-2" icon={<Trash2 size={14} />}>
                        Hapus
                      </Button>
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
