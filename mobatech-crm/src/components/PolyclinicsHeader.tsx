import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { APP_STRINGS } from "@/lib/constants";

export function PolyclinicsHeader({
  openForm,
  filterValue,
  setFilterValue,
  searchQuery,
  setSearchQuery,
}: {
  openForm: () => void;
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <>
      <PageHeader
        title={APP_STRINGS.polyclinics.title}
        description={APP_STRINGS.polyclinics.subtitle}
        action={
          <Button onClick={openForm} icon={<Plus size={18} />}>
            {APP_STRINGS.polyclinics.addBtn}
          </Button>
        }
      />
      <div className="flex justify-end mb-4 gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Aktif', value: 'active' },
            { label: 'Nonaktif', value: 'inactive' },
          ]}
          placeholder={APP_STRINGS.common.searchStatus}
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </>
  );
}
