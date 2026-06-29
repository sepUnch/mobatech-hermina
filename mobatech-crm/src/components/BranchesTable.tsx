import React from "react";
import { Branch } from "@/types/api";
import { APP_STRINGS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2, MapPin } from "lucide-react";

export function BranchesTable({
  items,
  loading,
  openForm,
  setDeleteId,
}: {
  items: Branch[];
  loading: boolean;
  openForm: (item: Branch) => void;
  setDeleteId: (id: number) => void;
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
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderName}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderAddress}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderGmaps}</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.branches.tableHeaderActions}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (<tr><td colSpan={100} className="text-center py-12 text-foreground/50 text-sm">Tidak ada data yang ditemukan.</td></tr>) : items.map((item) => (
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
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="ghost" onClick={() => openForm(item)} className="text-primary hover:text-primary-hover px-2" icon={<Edit2 size={14} />}>
                        Ubah
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(item.id)} className="text-rose-500 hover:text-rose-600 px-2" icon={<Trash2 size={14} />}>
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
