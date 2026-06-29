import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface User { id: number; full_name: string; email: string; phone_number: string; }
interface Reminder { id: number; created_at: string; user_id: number; appointment_id: number; title: string; message: string; reminder_date: string; is_read: boolean; type: string; }

export function RemindersList({
  loading,
  reminders,
  users,
  onDelete
}: {
  loading: boolean;
  reminders: Reminder[];
  users: User[];
  onDelete: (id: number) => void;
}) {
  const getUserName = (userId: number) => {
    const u = users.find((u) => u.id === userId);
    return u ? u.full_name || u.email : `User #${userId}`;
  };

  return (
    <Card noPadding>
      {loading ? (
        <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat data...</div>
      ) : reminders.length === 0 ? (
        <div className="p-10 text-center text-foreground/50 text-sm">Belum ada reminder yang dikirim.</div>
      ) : (
        <div className="divide-y divide-glass-border">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="p-4 flex items-start justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${r.is_read ? "bg-gray-300" : "bg-primary"}`} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{r.title}</span>
                    <Badge variant={r.type === 'Appointment' ? 'info' : r.type === 'Medication' ? 'success' : r.type === 'Checkup' ? 'warning' : 'neutral'}>
                      {r.type}
                    </Badge>
                    {r.is_read && <span className="text-xs text-foreground/40">Sudah dibaca</span>}
                  </div>
                  {r.message && <div className="text-xs text-foreground/60 mt-1">{r.message}</div>}
                  <div className="text-xs text-foreground/40 mt-1">
                    Kepada: <span className="font-medium text-foreground/60">{getUserName(r.user_id)}</span>
                    {" • "}
                    {new Date(r.reminder_date).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <Button size="sm" variant="ghost" onClick={() => onDelete(r.id)} className="text-rose-500 hover:text-rose-600 px-2 flex-shrink-0" icon={<Trash2 size={14} />}>
                Hapus
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
