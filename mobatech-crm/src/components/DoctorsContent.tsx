import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { DoctorsTable } from "./DoctorsTable";
import { DoctorProfileView } from "./DoctorProfileView";
import { DoctorsScheduleTab } from "./DoctorsScheduleTab";
import { Doctor, DoctorSchedule } from "@/types/api";

export function DoctorsContent({
  activeTab,
  items,
  loading,
  openSchedules,
  openForm,
  setDeleteId,
  schedules,
}: {
  activeTab: "doctors" | "schedules";
  items: Doctor[];
  loading: boolean;
  openSchedules: (item: Doctor) => void;
  openForm: (item: Doctor | null) => void;
  setDeleteId: (id: number | null) => void;
  schedules: DoctorSchedule[];
}) {
  const user = useAuthStore((state) => state.user);
  if (user?.role === "doctor") {
    return <DoctorProfileView doctor={items[0]} schedules={schedules} openSchedules={openSchedules} openForm={openForm} />;
  }
  return (
    <Card noPadding className="overflow-x-auto">
      {activeTab === "doctors" ? (
        <DoctorsTable
          items={items}
          loading={loading}
          openSchedules={openSchedules}
          openForm={openForm}
          setDeleteId={setDeleteId}
        />
      ) : (
        <DoctorsScheduleTab schedules={schedules} />
      )}
    </Card>
  );
}
