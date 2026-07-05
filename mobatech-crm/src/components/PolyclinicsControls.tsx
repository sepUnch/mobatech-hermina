import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { APP_STRINGS } from "@/lib/constants";

export function PolyclinicsControls({
  filterValue,
  setFilterValue,
  searchQuery,
  setSearchQuery,
}: {
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
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
  );
}
