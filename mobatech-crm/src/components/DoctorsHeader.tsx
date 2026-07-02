import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { DoctorsTabs } from "./DoctorsTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { APP_STRINGS } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";

export function DoctorsHeader({
  openForm,
  activeTab,
  setActiveTab,
  filterValue,
  setFilterValue,
  searchQuery,
  setSearchQuery,
  polyclinicOptions,
}: {
  openForm: () => void;
  activeTab: "doctors" | "schedules";
  setActiveTab: (val: "doctors" | "schedules") => void;
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  polyclinicOptions: { label: string; value: string }[];
}) {
  const user = useAuthStore((state) => state.user);
  const isDoctor = user?.role === "doctor";
  return (
    <>
      <PageHeader
        title={isDoctor ? "Jadwal Praktik Saya" : APP_STRINGS.doctors.title}
        description={isDoctor ? "Kelola ketersediaan waktu dan jadwal praktik Anda." : APP_STRINGS.doctors.subtitle}
        action={
          !isDoctor ? (
            <Button onClick={openForm} icon={<Plus size={18} />}>
              {APP_STRINGS.doctors.addBtn}
            </Button>
          ) : null
        }
      />
      {!isDoctor && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 w-full">
          <DoctorsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2">
            <FilterDropdown
              value={filterValue}
              onChange={setFilterValue}
              options={polyclinicOptions}
              placeholder={APP_STRINGS.common.searchPolyclinic}
              className="w-full sm:w-48 h-11"
            />
            <SearchFilterBar value={searchQuery} onChange={setSearchQuery} className="w-full sm:max-w-xs h-11" />
          </div>
        </div>
      )}
    </>
  );
}
