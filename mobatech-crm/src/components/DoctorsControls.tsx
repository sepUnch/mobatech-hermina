import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { DoctorsTabs } from "./DoctorsTabs";
import { APP_STRINGS } from "@/lib/constants";

export function DoctorsControls({
  activeTab,
  setActiveTab,
  filterValue,
  setFilterValue,
  searchQuery,
  setSearchQuery,
}: {
  activeTab: "doctors" | "schedules";
  setActiveTab: (val: "doctors" | "schedules") => void;
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <DoctorsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Jantung', value: 'Jantung' },
            { label: 'Mata', value: 'Mata' },
            { label: 'Gigi', value: 'Gigi' },
            { label: 'Umum', value: 'Umum' },
          ]}
          placeholder={APP_STRINGS.common.searchPolyclinic}
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </div>
  );
}
