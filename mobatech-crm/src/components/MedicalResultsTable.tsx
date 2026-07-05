import { Edit2, Trash2, Pill, Eye, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Formatters } from "@/lib/formatters";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

interface User { id: number; full_name: string; email: string; }
interface MedicalResult { id: number; created_at: string; user_id: number; appointment_id: number; doctor_name: string; test_type: string; test_name: string; result: string; notes: string; file_url: string; result_date: string; }

export function MedicalResultsTable({ 
  loading, 
  results, 
  users, 
  onEdit, 
  onDelete,
  onViewDetails,
  userRole 
}: { 
  loading: boolean;
  results: MedicalResult[];
  users: User[];
  onEdit: (r: MedicalResult) => void;
  onDelete: (id: number) => void;
  onViewDetails?: (r: MedicalResult) => void;
  userRole?: string;
}) {
  const router = useRouter();

  return (
    <Card noPadding>
      <div className="w-full overflow-x-auto">
        {loading ? (
          <SkeletonTable rows={5} columns={6} />
        ) : (
          <table className="w-full text-center border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Tanggal</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Pasien</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Dokter</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Pemeriksaan</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Ringkasan Hasil</th>
                <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <Inbox className="w-12 h-12 mb-3 text-foreground/20" />
                      <p className="text-sm">Belum ada data hasil medis.</p>
                    </div>
                  </td>
                </tr>
              ) : results.map((r) => (
                <tr key={r.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/70 text-xs">
                    {Formatters.date(r.result_date, "short")}
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-semibold">
                    {users.find((u) => u.id === r.user_id)?.full_name || users.find((u) => u.id === r.user_id)?.email || `User #${r.user_id}`}
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/80">{r.doctor_name || "-"}</td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div>{r.test_name}</div>
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs mt-1 inline-block">{r.test_type}</span>
                  </td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/70 max-w-xs truncate">{r.result}</td>
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                    <div className="flex justify-center" title={userRole === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
                      <ActionMenu
                        items={[
                          ...(onViewDetails ? [{
                            label: "Lihat Detail",
                            icon: <Eye size={14} />,
                            onClick: () => onViewDetails(r),
                          }] : []),
                          {
                            label: "E-Resep",
                            icon: <Pill size={14} />,
                            onClick: () => router.push(`/dashboard/pharmacy?action=create_prescription&appointment_id=${r.appointment_id || ''}&user_id=${r.user_id}`),
                            variant: "info" as const,
                          },
                          {
                            label: "Edit",
                            icon: <Edit2 size={14} />,
                            onClick: () => onEdit(r),
                            disabled: userRole === "admin",
                          },
                          {
                            label: "Hapus",
                            icon: <Trash2 size={14} />,
                            onClick: () => onDelete(r.id),
                            disabled: userRole === "admin",
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
