import { Badge } from "@/components/ui/Badge";

export interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  date_of_birth: string;
}

export interface User {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  blood_type: string;
  height: number;
  weight: number;
  allergies: string;
  date_of_birth: string;
  gender: string;
  family_members?: FamilyMember[];
}

interface PatientsTableProps {
  items: User[];
  loading: boolean;
}

export function PatientsTable({ items, loading }: PatientsTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat data...</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-center border-collapse text-sm">
        <thead>
          <tr className="border-b border-glass-border bg-black/5 dark:bg-white/5 font-semibold">
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Tanggal Daftar</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Identitas Pasien</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Kontak</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Data Medis Dasar</th>
            <th className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">Anggota Keluarga</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/50">
                Tidak ada pasien ditemukan.
              </td>
            </tr>
          ) : (
            items.map((user) => (
              <tr key={user.id} className="border-b border-glass-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm text-foreground/80">
                  {new Date(user.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="font-semibold">{user.full_name || "Tanpa Nama"}</div>
                  <div className="text-xs text-foreground/60 capitalize mt-1">
                    {user.gender ? (user.gender.toLowerCase() === 'male' || user.gender.toLowerCase() === 'laki-laki' ? 'Laki-laki' : 'Perempuan') : '-'}
                    {user.date_of_birth && ` • ${user.date_of_birth}`}
                  </div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="text-foreground/90">{user.email}</div>
                  <div className="text-xs text-foreground/60 mt-1">{user.phone_number || "-"}</div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <div className="flex flex-wrap justify-center gap-1 text-xs">
                    <Badge variant="neutral" className="bg-primary/10 text-primary border-primary/20">
                      Gol. Darah: {user.blood_type || "-"}
                    </Badge>
                    {(user.height > 0 || user.weight > 0) && (
                      <Badge variant="info">
                        {user.height} cm / {user.weight} kg
                      </Badge>
                    )}
                    {user.allergies && (
                      <Badge variant="error">
                        Alergi: {user.allergies}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="text-center align-middle whitespace-nowrap py-2 px-4 text-sm">
                  <Badge variant="neutral">
                    {user.family_members?.length || 0} Terhubung
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
