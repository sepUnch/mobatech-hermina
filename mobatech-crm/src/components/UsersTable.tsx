import { User } from "@/types/api";
import { Formatters } from "@/lib/formatters";
import { ShieldAlert, Eye, Edit, Trash2 } from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  authUser: User | null;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number, name: string) => void;
}

export function UsersTable({ users, loading, authUser, onView, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-center border-collapse text-sm">
        <thead>
          <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
            <th className="text-center align-middle whitespace-nowrap py-3 px-6 text-sm">Pengguna</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Kontak</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Peran (Role)</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Tidak ada pengguna ditemukan.</td></tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="text-left align-middle whitespace-nowrap py-3 px-6 text-sm">
                  <div className="flex items-center justify-start gap-3">
                    <img src={u.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=113c2b&color=fff`} alt={u.full_name} className="w-8 h-8 rounded-full object-cover border border-glass-border" />
                    <div className="text-left"><div className="font-semibold">{u.full_name}</div><div className="text-xs text-foreground/50">ID: {u.id}</div></div>
                  </div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="font-medium">{u.email}</div>
                  <div className="text-xs text-foreground/50">{Formatters.phone(u.phone_number)}</div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${u.role === "admin" ? "bg-rose-100 text-rose-700" : u.role === "doctor" ? "bg-blue-100 text-blue-700" : u.role === "pharmacist" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {u.role === "admin" && <ShieldAlert size={12} />}
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="flex justify-center">
                    <ActionMenu
                      items={[
                        {
                          label: "Lihat Detail",
                          icon: <Eye size={14} />,
                          onClick: () => onView(u)
                        },
                        {
                          label: "Ubah",
                          icon: <Edit size={14} />,
                          onClick: () => onEdit(u)
                        },
                        ...(u.id !== authUser?.id ? [{
                          label: "Hapus",
                          icon: <Trash2 size={14} />,
                          onClick: () => onDelete(u.id, u.full_name),
                          variant: "danger" as const
                        }] : [])
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
