import { Medicine } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Package, Edit, Trash2, Eye } from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { APP_STRINGS } from "@/lib/constants";
import { Formatters } from "@/lib/formatters";

interface PharmacyMedicinesTableProps {
  medicines: Medicine[];
  role: string;
  onView: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: number, name: string) => void;
}

export function PharmacyMedicinesTable({ medicines, role, onView, onEdit, onDelete }: PharmacyMedicinesTableProps) {
  return (
    <Card noPadding>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.medicineName}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.category}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.price}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.stock}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.pharmacy.prescription}</th>
              <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{APP_STRINGS.common.action}</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-10 h-10 object-cover rounded-lg bg-glass-panel border border-glass-border shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-glass-border shrink-0">
                        <Package size={20} className="text-foreground/40" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-foreground/50">{m.generic_name} • {m.dosage} {m.unit}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{m.category?.name ?? "-"}</td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-medium">{Formatters.currency(m.price)}</td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm"><Badge variant={m.stock <= 10 ? "error" : "success"}>{m.stock}</Badge></td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm"><Badge variant={m.requires_prescription ? "warning" : "neutral"}>{m.requires_prescription ? APP_STRINGS.pharmacy.requiresPrescription : APP_STRINGS.pharmacy.otc}</Badge></td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm" title={role === "admin" ? APP_STRINGS.common.clinicalOnly : undefined}>
                  <div className="flex justify-center">
                    <ActionMenu
                      items={[
                        {
                          label: "Lihat Detail",
                          icon: <Eye size={14} />,
                          onClick: () => onView(m)
                        },
                        {
                          label: "Ubah",
                          icon: <Edit size={14} />,
                          onClick: () => onEdit({ ...m, category_id: m.category?.id }),
                          disabled: role === "admin"
                        },
                        {
                          label: "Hapus",
                          icon: <Trash2 size={14} />,
                          onClick: () => onDelete(m.id, m.name),
                          disabled: role === "admin",
                          variant: "danger" as const
                        }
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
