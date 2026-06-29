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
}: {
  openForm: () => void;
  activeTab: "doctors" | "schedules";
  setActiveTab: (val: "doctors" | "schedules") => void;
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
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
            options={[
              { label: 'Jantung', value: 'Jantung' },
              { label: 'Mata', value: 'Mata' },
              { label: 'Gigi', value: 'Gigi' },
              { label: 'Umum', value: 'Umum' },
            ]}
            placeholder="Poliklinik..."
          />
          <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
    </>
  );
}
