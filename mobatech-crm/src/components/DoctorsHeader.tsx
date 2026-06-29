import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { DoctorsTabs } from "./DoctorsTabs";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { APP_STRINGS } from "@/lib/constants";

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
  return (
    <>
      <PageHeader
        title={APP_STRINGS.doctors.title}
        description={APP_STRINGS.doctors.subtitle}
        action={
          <Button onClick={openForm} icon={<Plus size={18} />}>
            {APP_STRINGS.doctors.addBtn}
          </Button>
        }
      />
      <div className="flex justify-between items-center mb-4">
        <DoctorsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex gap-2">
          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={polyclinicOptions}
            placeholder={APP_STRINGS.common.searchPolyclinic}
          />
          <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
    </>
  );
}
