import { Appointment } from "@/types/api";
import { Modal } from "@/components/Modal";

interface AppointmentDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  drawerItem: Appointment | null;
}

export function AppointmentDetailView({ isOpen, onClose, drawerItem }: AppointmentDetailViewProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Antrean">
      {drawerItem && (
        <div className="space-y-3">
          <div><strong>Nama Pasien:</strong> {drawerItem.user?.full_name || "-"}</div>
          <div><strong>Email Pasien:</strong> {drawerItem.user?.email || "-"}</div>
          <div><strong>Dokter:</strong> {drawerItem.doctor?.name || "-"}</div>
          <div><strong>Jadwal:</strong> {drawerItem.schedule ? `${drawerItem.schedule.start_time} - ${drawerItem.schedule.end_time}` : "-"}</div>
          <div><strong>Catatan:</strong> {drawerItem.notes || "-"}</div>
          <div><strong>Status:</strong> {drawerItem.status}</div>
        </div>
      )}
    </Modal>
  );
}
