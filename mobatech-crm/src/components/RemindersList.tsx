import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/Modal";
import { Formatters } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";

import { User, Reminder } from "@/types/api";
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
                    {Formatters.date(r.reminder_date, "datetime")}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <ActionMenu
                  items={[
                    {
                      label: "Hapus",
                      icon: <Trash2 size={14} />,
                      onClick: () => onDelete(r.id),
                      variant: "danger" as const
                    }
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
