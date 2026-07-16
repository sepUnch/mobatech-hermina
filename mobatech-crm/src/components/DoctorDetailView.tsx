import { Modal } from "@/components/Modal";
import { Doctor } from "@/types/api";

interface DoctorDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  drawerItem: Doctor | null;
}

export function DoctorDetailView({ isOpen, onClose, drawerItem }: DoctorDetailViewProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Dokter">
      {drawerItem && (
        <div className="space-y-3">
          <div><strong>Nama:</strong> {drawerItem.name}</div>
          <div><strong>Spesialisasi:</strong> {drawerItem.specialization}</div>
          <div><strong>Kontak:</strong> {drawerItem.contact_info}</div>
          <div><strong>Poliklinik:</strong> {drawerItem.polyclinic?.name || "-"}</div>
          <div><strong>Status:</strong> {drawerItem.is_active ? "Aktif" : "Non-Aktif"}</div>
        </div>
      )}
    </Modal>
  );
}
