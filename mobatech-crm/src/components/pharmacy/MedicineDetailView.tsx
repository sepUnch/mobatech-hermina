import { Medicine } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Package } from "lucide-react";
import { APP_STRINGS } from "@/lib/constants";
import { Formatters } from "@/lib/formatters";
import { SideDrawer } from "@/components/ui/SideDrawer";

interface MedicineDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

export function MedicineDetailView({ isOpen, onClose, medicine }: MedicineDetailViewProps) {
  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="Detail Obat">
      {medicine && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b border-glass-border pb-4">
            {medicine.image_url ? (
              <img src={medicine.image_url} alt={medicine.name} className="w-20 h-20 object-cover rounded-xl border border-glass-border shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-glass-border">
                <Package size={32} className="text-foreground/40" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold">{medicine.name}</h3>
              <div className="text-sm text-foreground/60">{medicine.generic_name}</div>
              <Badge variant={medicine.requires_prescription ? "warning" : "neutral"} className="mt-1">
                {medicine.requires_prescription ? APP_STRINGS.pharmacy.requiresPrescription : APP_STRINGS.pharmacy.otc}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col"><span className="text-xs text-foreground/50">Kategori</span><span className="text-sm font-medium">{medicine.category?.name || "-"}</span></div>
            <div className="flex flex-col"><span className="text-xs text-foreground/50">Dosis / Satuan</span><span className="text-sm font-medium">{medicine.dosage} {medicine.unit}</span></div>
            <div className="flex flex-col"><span className="text-xs text-foreground/50">Harga (Rp)</span><span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{Formatters.currency(medicine.price)}</span></div>
            <div className="flex flex-col"><span className="text-xs text-foreground/50">Stok Saat Ini</span><span className="text-sm font-medium"><Badge variant={medicine.stock <= 10 ? "error" : "success"}>{medicine.stock} pcs</Badge></span></div>
            <div className="flex flex-col col-span-2"><span className="text-xs text-foreground/50">Ditambahkan Pada</span><span className="text-sm font-medium">{new Date(medicine.created_at).toLocaleString('id-ID')}</span></div>
          </div>
        </div>
      )}
    </SideDrawer>
  );
}
