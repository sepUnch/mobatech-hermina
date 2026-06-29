import { Button } from "@/components/ui/Button";
import { Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface User { id: number; full_name: string; email: string; }
interface MedicalResult { id: number; created_at: string; user_id: number; appointment_id: number; doctor_name: string; test_type: string; test_name: string; result: string; notes: string; file_url: string; result_date: string; }

export function MedicalResultsTable({ 
  loading, 
  results, 
  users, 
  onEdit, 
  onDelete 
}: { 
  loading: boolean;
  results: MedicalResult[];
  users: User[];
  onEdit: (r: MedicalResult) => void;
  onDelete: (id: number) => void;
  userRole?: string;
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
                <tr><td colSpan={6} className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/50">Belum ada data hasil medis.</td></tr>
              ) : results.map((r) => (
                <tr key={r.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/70 text-xs">
                    {new Date(r.result_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
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
                    <div className="flex gap-2 justify-center" title={userRole === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
                      <Button size="sm" variant="ghost" onClick={() => onEdit(r)} disabled={userRole === "admin"} className="text-primary hover:text-primary-hover px-2" icon={<Edit2 size={14} />}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(r.id)} disabled={userRole === "admin"} className="text-rose-500 hover:text-rose-600 px-2" icon={<Trash2 size={14} />}>
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
