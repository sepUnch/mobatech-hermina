import { Appointment } from "@/types/api";
import { format } from "date-fns";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, CheckCircle2 } from "lucide-react";

interface AppointmentsTableProps {
  items: Appointment[];
  loading: boolean;
  onApprove: (id: number) => void;
  onCancel: (id: number) => void;
  onComplete: (id: number) => void;
}

export function AppointmentsTable({ items, loading, onApprove, onCancel, onComplete }: AppointmentsTableProps) {
  const getStatusBadge = (status: string) => {
    let variant: BadgeVariant = "warning";
    let label = "Menunggu";

    switch (status) {
      case "approved":
        variant = "success";
        label = "Disetujui";
        break;
      case "cancelled":
        variant = "error";
        label = "Dibatalkan";
        break;
      case "completed":
        variant = "info";
        label = "Selesai";
        break;
    }

    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat data...</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-center border-collapse text-sm">
        <thead>
          <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Tanggal Daftar</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Pasien</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Dokter & Jadwal</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Catatan</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Status</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/80">{format(new Date(item.created_at), "dd MMM yyyy HH:mm")}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm font-semibold">
                {item.user?.full_name || `Pasien #${item.user_id}`}
                <div className="text-xs text-foreground/60 font-normal">{item.user?.email}</div>
              </td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                <div className="font-semibold">{item.doctor?.name}</div>
                <div className="text-xs text-foreground/60">
                  {item.schedule ? `${item.schedule.date} (${item.schedule.start_time} - ${item.schedule.end_time})` : "Jadwal tidak ditemukan"}
                </div>
              </td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/75 max-w-[150px] truncate">{item.notes || "-"}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">{getStatusBadge(item.status)}</td>
              <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm space-x-2">
                {item.status === "pending" && (
                  <>
                    <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10" onClick={() => onApprove(item.id)} icon={<Check size={14} />}>
                      Setujui
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onCancel(item.id)} icon={<X size={14} />}>
                      Tolak
                    </Button>
                  </>
                )}
                {item.status === "approved" && (
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-500/30 hover:bg-blue-500/10" onClick={() => onComplete(item.id)} icon={<CheckCircle2 size={14} />}>
                    Selesai
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/50">Tidak ada antrean saat ini</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
