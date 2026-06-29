import { ShieldAlert } from "lucide-react";
import { Card } from "./Card";

export function ForbiddenView({ message = "Akses Ditolak" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-fade-in">
      <Card className="max-w-md w-full flex flex-col items-center justify-center text-center p-8 border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">403 Forbidden</h2>
        <p className="text-foreground/70">{message}</p>
        <p className="text-sm text-foreground/50 mt-4">
          Anda tidak memiliki izin untuk melihat halaman ini. Silakan hubungi administrator.
        </p>
      </Card>
    </div>
  );
}
